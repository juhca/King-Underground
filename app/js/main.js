var engine, scene, canvas;

document.addEventListener('DOMContentLoaded', function() {
    onload();
}, false);

window.addEventListener("resize", function () {
    if (engine) {
        engine.resize();
    }
},false);

function onload() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

    var stats = initStats();

    initScene();

    engine.runRenderLoop(function() {
        stats.update();
        scene.render();
    });
}

function initScene() {
    scene = new BABYLON.Scene(engine);

    /* set default camera */
    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(10, 20, 20), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas);

    /* physics */
    scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());

    // ustvarim luč
    //var h = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
    //h.position = new BABYLON.Vector3(0, 5.0, 0);

    // prikazem koordinatni sistem
    var showAxis = function(size) {
        var axisX = BABYLON.Mesh.CreateLines("axisX", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0) ], scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0) ], scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size) ], scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
    };
    showAxis(50);

    /**
     * FOG
    **/
    //scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    //scene.fogDensity = 0.1;

    /*
     * Background music
     * */
/*
     var music = new BABYLON.Sound("Music", "./music/01. BT-7274.mp3", scene, null, {
     loop: true,
     autoplay: true
     });
     */

    var roomLength = 50;
    var wallHeight = 5;
    var wallWidth = 1;
        // edge of regular triangle at edges of octagon
    var octagonE = 10;

    /**
     *  =============
     *  GLAVNA SOBANA
     *  =============
     **/
    // ustvarim material za tla
    var groundMaterial = createMaterial(scene, './assets/textures/floor.jpg', 'ground', 5.0, 5.0, new BABYLON.Color3.Black());
        // ustvarim tla
    var ground = createBox(scene, groundMaterial, roomLength, 1, roomLength, 'ground');
    ground = properties(ground, 0, 0, 0, 0, 0, 0, 1, 0.01, 1);

    glavna_sobana_zid(roomLength, wallHeight, wallWidth, octagonE);
    glavna_sobana_kupola(roomLength, wallHeight, wallWidth);

    // podatki za stopnice
    var stepHeight = 0.2;
    var stepSize = roomLength / 3;
    var stepNum = 3;
    glavna_sobana_platforma(stepHeight, stepSize, stepNum);

    glavna_sobana_stebri(wallHeight, stepHeight, stepSize, stepNum);

    // podatki za mizo
    var tableDiameter = (stepSize - 4 * stepNum * stepHeight) * (3 / 5);
    var tableHeight = 1;
    glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight);
    glavna_sobana_obok(groundMaterial, roomLength);
    /**
     * ======
     * HODNIK
     * ======
     **/
    stranski_hodnik_in_klancina_tla_in_strop(groundMaterial);

   // var hero = new Hero(scene);
    var goblin1 = new Goblin(scene, new BABYLON.Vector3(-128, 0.5, 0));

    /* test movable box */
    var d = BABYLON.Mesh.CreateBox("s", 3, scene);
    d.position = new BABYLON.Vector3(-20, 1, -3);
    d.setPhysicsState({impostor:BABYLON.PhysicsEngine.BoxImpostor, move:true, mass:5, friction:0.5, restitution:0.1});
    var boxMaterial = new BABYLON.StandardMaterial("boxmat", scene);
    boxMaterial.diffuseColor = BABYLON.Color3.FromInts(75, 71, 89);
    boxMaterial.specularColor = BABYLON.Color3.Black();
    d.material = boxMaterial;

    postavi_bakle(roomLength);
    heightmap();
}

function initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("statsOutput").appendChild(stats.domElement);

    return stats;
}

    /**
     * GLAVNA SOBANA
     * **/
function glavna_sobana_zid(roomLength, wallHeight, wallWidth, octagonE) {
    var wallMaterial = createMaterial(scene, './assets/textures/wall.jpg', 'wall', 1.5, 4.0, new BABYLON.Color3.Black());

    var wall = createWall(scene, wallMaterial, wallHeight, wallWidth, roomLength, octagonE, 'wall1');
    wall = properties(wall, roomLength / 2 - wallWidth / 2, wallHeight / 2, 0, 0, 0, 0, 1, 1, 1);

    var wall2 = clone_and_properties(wall, 'wall2', -(roomLength - wallWidth), 0, -20.5, 0, 0, 0, 1, 1, 1);
    var wall3 = clone_and_properties(wall, 'wall3', -(roomLength - wallWidth), 0, 15.5, 0, 0, 0, 1, 1, 1);
    var wall4 = clone_and_properties(wall, 'wall4', -(roomLength / 2 - wallWidth / 2), 0, (roomLength / 2 - wallWidth / 2), 0, (Math.PI / 2), 0, 1, 1, 1);
    var wall5 = clone_and_properties(wall, 'wall5', -(roomLength / 2 - wallWidth / 2), 0, -(roomLength / 2 - wallWidth / 2), 0, (Math.PI / 2), 0, 1, 1, 1);
    var wall6 = clone_and_properties(wall, 'wall6', -(octagonE / 2), 0, (roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, -(Math.PI / 4), 0, 1, 1, 1);
    var wall7 = clone_and_properties(wall, 'wall7', -(roomLength - octagonE / 2 - wallWidth), 0, (roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, (Math.PI / 4), 0, 1, 1, 1);
    var wall8 = clone_and_properties(wall, 'wall8', -(roomLength - octagonE / 2 - wallWidth), 0, -(roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, -(Math.PI / 4), 0, 1, 1, 1);
    var wall9 = clone_and_properties(wall, 'wall9', -(octagonE / 2), 0, -(roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, +(Math.PI / 4), 0, 1, 1, 1);
        /**
         * STRANSKI HODNIK
        **/
    var wall10 = clone_and_properties(wall, 'wall10', -(roomLength - wallWidth + 14.5), 0, 0, 0, (Math.PI/2), 0, 1, 1, 1);
    var wall11 = clone_and_properties(wall, 'wall11', -(roomLength - wallWidth + 14.5), 0, -5, 0, (Math.PI/2), 0, 1, 1, 1);
        /**
         * KLANCINA
         **/
    var wall12 = clone_and_properties(wall, 'wall12', -(2*roomLength - wallWidth - 11.0), 0, 0.01, 0, (Math.PI/2), 0, 1, 1, 1);
    var wall13 = clone_and_properties(wall, 'wall13', -(2*roomLength - wallWidth - 11.0), 0, -4.99, 0, (Math.PI/2), 0, 1, 1, 1);

        /***
         * ZUNAJ
         * */
    var wall14 = clone_and_properties(wall, 'wall14', -(2*roomLength - wallWidth + 19.0), -1.25, 0.01, 0, (Math.PI/2), 0, 1, 1.5, 1);
    var wall15 = clone_and_properties(wall, 'wall15', -(2*roomLength - wallWidth + 19.0), -1.25, -4.99, 0, (Math.PI/2), 0, 1, 1.5, 1);
    var wall16 = clone_and_properties(wall, 'wall16', -(2*roomLength - wallWidth + 33.0), -1.25, -28.0, 0, 0, 0, 1.0, 1.5, 1.5);
    var wall17 = clone_and_properties(wall, 'wall17', -(2*roomLength - wallWidth + 33.0), -1.25, 27.5, 0, 0, 0, 1.0, 1.5, 1.8);

    var wallMaterial2 = createMaterial(scene, './assets/textures/wall.jpg', 'wall', 2.5, 16.0, new BABYLON.Color3.Black());
    var wall18 = createWall(scene, wallMaterial2, wallHeight, wallWidth, 100, octagonE, 'wall18');
    wall18 = properties(wall18, -(2*roomLength - wallWidth + 45.0), 1.25, 46.5, 0, (Math.PI/2), 0, 1.0, 1.5, 1.5);
    var wall19 = clone_and_properties(wall18,'wall19', 0, 0, -95, 0, 0, 0, 1.0, 1.5, 1.5);
    var wall20 = clone_and_properties(wall18,'wall20', -50, 0, -50, 0, (Math.PI/2), 0, 1.0, 1.5, 1.5);
}

function glavna_sobana_kupola(roomLength, wallHeight, wallWidth) {
    var ceilMaterial = createMaterial(scene, './assets/textures/roof.jpg', 'ground', 1.0, 1.0, new BABYLON.Color3.Black());
    var sphereDiameter = roomLength - 2 * wallWidth;

    var ceilSphere = createSphere(scene, ceilMaterial, sphereDiameter, wallHeight, 'ceilSphere', 0.5, BABYLON.Mesh.BACKSIDE);

    var ceilPlane = createBox(scene, ceilMaterial, roomLength, 2, roomLength, 'ceilPlane');
    ceilPlane = properties(ceilPlane, 0, (wallHeight + 1), 0, 0, 0, 0, 1, 1, 1);

    var csCSG = BABYLON.CSG.FromMesh(ceilSphere);
    var cpCSG = BABYLON.CSG.FromMesh(ceilPlane);
    var ceilSubplane = (cpCSG.subtract(csCSG)).toMesh('ceilSubplane', ceilMaterial, scene, false);
    ceilPlane.dispose();
}

function glavna_sobana_platforma(stepHeight, stepSize, stepNum) {
    var platformMaterial = createMaterial(scene, "./assets/textures/floor1.jpg", 'platform', 3.0, 3.0, new BABYLON.Color3.Black());
    var platform = false;

    for (var i = 0; i < stepNum; i++) {
        var step = createBox(scene, platformMaterial, (stepSize - 4 * i * stepHeight), stepHeight, (stepSize - 4 * i * stepHeight), 'step' + i);
        step.position.y += i * stepHeight + stepHeight / 2;
        if (!platform) {
            platform = BABYLON.CSG.FromMesh(step);
        } else {
            platform = platform.union(BABYLON.CSG.FromMesh(step));
        }
        step.dispose();
    }

    if (platform) {
        platform = platform.toMesh('platform', platformMaterial, scene, false);
        platform.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
    } else {
        console.error('platform not initiated');
    }
}

function glavna_sobana_stebri(wallHeight, stepHeight, stepSize, stepNum) {
    var pillarDiameter = 1.5;
    var pillarHeight = 1.2*wallHeight - stepNum * stepHeight;
    var pillarLocation = ((stepSize - 4 * stepNum * stepHeight) / 2) * 7 / 8;

    var pillarMaterial = createMaterial(scene, "./assets/textures/pillar.jpg", 'pillar', 1.5, 2.0, new BABYLON.Color3.Black());
    var pillar = createCylinder(scene, pillarMaterial, pillarHeight, pillarDiameter, pillarDiameter, 'pillar1');
    pillar = properties(pillar, pillarLocation, (pillarHeight / 2 + stepNum * stepHeight), pillarLocation, 0, 0, 0, 1, 1, 1);

    var pillar2 = clone_and_properties(pillar, 'pillar2', -(2 * pillarLocation), 0, 0, 0, 0, 0, 1, 1, 1);
    var pillar3 = clone_and_properties(pillar, 'pillar3', -(2 * pillarLocation), 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1);
    var pillar4 = clone_and_properties(pillar, 'pillar4', 0, 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1);
}

function glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight) {
    var tableMaterial = createMaterial(scene, "./assets/textures/tableTop.jpg", 'table', 3.0, 3.0, new BABYLON.Color3.Black());

    var tableBot = createCylinder(scene, tableMaterial, (tableHeight * (2 / 3)), (tableDiameter * (1 / 3)), (tableDiameter * (2 / 3)), 'tableBot');
    tableBot.position.y += (tableHeight * (2 / 3)) / 2 + stepNum * stepHeight;

    var tableTop = createCylinder(scene, tableMaterial, (tableHeight * (1/3)), (tableDiameter), (tableDiameter * (1 / 3)), 'tableTop');
    tableTop.position.y = tableBot.position.y + tableHeight * (1 / 3);
}

function glavna_sobana_obok(groundMaterial, roomLength) {
    var obok = createBox(scene, groundMaterial, 1.1, 80, 1.1, 'obok');
    obok = properties(obok, -(roomLength/2 - 0.55), 0.4, -0.05, 0, 0, 0, 1, 0.01, 1);

        // leva stran oboka
    var obok2l = clone_and_properties(obok, 'obok2l', 0, 0, -4.9, 0, 0, 0, 1, 0.01, 1);
    var obok3l = clone_and_properties(obok2l, 'obok3l', 0, 1.5, 0, 0, 0, 0, 1, 0.01, 1);
    var obok4l = clone_and_properties(obok2l, 'obok4l', 0, 3.0, 0, 0, 0, 0, 1, 0.01, 1);
    var obok5l = clone_and_properties(obok2l, 'obok5l', 0, 4.5, 0, 0, 0, 0, 1, 0.01, 1);

        // desna stran oboka
    var obok3d = clone_and_properties(obok3l, 'obok3l', 0, 0, 4.9, 0, 0, 0, 1, 0.01, 1);
    var obok4d = clone_and_properties(obok4l, 'obok4l', 0, 0, 4.9, 0, 0, 0, 1, 0.01, 1);
    var obok5d = clone_and_properties(obok5l, 'obok5l', 0, 0, 4.9, 0, 0, 0, 1, 0.01, 1);
}
    /**
     * STRANSKI HODNIK + KLANCINA
     * **/
function stranski_hodnik_in_klancina_tla_in_strop(groundMaterial) {
        // tla za hodnik
    var ground2 = createBox(scene, groundMaterial, 40, 1, 20,'ground2');
    ground2 = properties(ground2, -45, 0, -2.5, 0, (Math.PI/2), 0, 1, 0.01, 1);
        // tla za klancino
    var ground3 = createBox(scene, groundMaterial, 40, 5, 20, 'ground3');
    ground3 = properties(ground3, -69, 0, -2.5, 0, (Math.PI/2), 0, 1, 0.01, 1);

    var strop1 = clone_and_properties(ground2, 'strop1', 6.5, 5, 0, 0, 0, (Math.PI), 0.5, 0.01, 0.7);
    var strop2 = clone_and_properties(ground3, 'strop2', 5.43, 5, 0, 0, 0, (Math.PI), 0.5, 0.01, 0.7);

        // zunanje stopnice
    for(var i = 0; i < 20; i++)
    {
        var step = createBox(scene, strop2.material, (10 - 4 * 1 * 5), 1, (10 - 4 * 1 * 5), 'step' + i);
        step.position.y -= 0.48 + 0.1*i;
        step.position.x -= 85 + i;
        step.position.z -= 3;
        step.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
    }
        // luc za zunaj
    var lucZunaj = lucke("Luc Zunaj", new BABYLON.Vector3(-50,100,0), new BABYLON.Vector3(-1, -1, 0), 40.5, 50, 60, new BABYLON.Color3(1, 1, 1), new BABYLON.Color3(1, 1, 1));
}

function lucke(name, position, direction, angle, exponent, intensity, diffuse, specular) {
    var luc = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3.Zero(), new BABYLON.Vector3.Zero(), 0, 0, scene);
    luc.name = name;
    luc.position = position;
    luc.direction = direction;
    luc.angle = angle;
    luc.exponent = exponent;
    luc.intensity = intensity;
    luc.diffuse = diffuse;
    luc.specular = specular;
    luc.setEnabled(1);
    return luc;
}

function partikli(ime, st_partiklov, lokacija_texture, objekt) {
    var particleSystem = new BABYLON.ParticleSystem(ime, st_partiklov, scene);
        // tektsturiraj sistem
    particleSystem.particleTexture = new BABYLON.Texture(lokacija_texture, scene);
    particleSystem.emitter = objekt;

    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.6;

        // Emission rate
    particleSystem.emitRate = 500;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 4.71, 0);

        // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(1, 1, 1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

        // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

        // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.005;

        // Start the particle system
    particleSystem.start();
}

function postavi_bakle(roomLength) {
    var bakla;
    BABYLON.SceneLoader.ImportMesh('', 'assets/other/Torch/','Torch.babylon', scene, function (newMeshes) {
            // prva bakla
        bakla = newMeshes[0];
        var baklaMaterial = createMaterial(scene, 'assets/other/Torch/VRayMtl1SG_Base_Color copy.jpg', 'baklaMaterial', 1.0, 1.0, new BABYLON.Color3(0, 0, 0));
        bakla.material = baklaMaterial;

        var baklaLucka11 = lucke("bakla lucka", new BABYLON.Vector3(24, 3, 0), new BABYLON.Vector3(-1,-1,0), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
        var baklaLucka12 = lucke("bakla lucka", new BABYLON.Vector3(8, 2, 0), new BABYLON.Vector3(1,1,0), 5, 5, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));

        bakla = properties(bakla, (roomLength/2 - 1.46), 3.9, 0, 0, 0, 0, 0.2, 0.2, 0.2);
        var nevidnMesh1 = createBox(scene, "", 2, 2, 2, 'nevidnMesh1');
        nevidnMesh1.position.y += 4;
        nevidnMesh1.position.z += 4;
        nevidnMesh1.position.x -= 2;
        nevidnMesh1.isVisible = false;
        nevidnMesh1.parent = bakla;
        partikli("partikel bakla1", 300, 'assets/textures/fire.jpg', nevidnMesh1);

        var bakla2 = clone_and_properties(bakla, 'bakla2', -(roomLength/2 - 2.45), 0, (roomLength/2 - 1.44), 0, -(Math.PI/2), 0, 0.2, 0.2, 0.2);
        var bakla3 = clone_and_properties(bakla, 'bakla3', -(roomLength/2 - 5), 0, -(roomLength/2 - 1.44), 0, (Math.PI/2), 0, 0.2, 0.2, 0.2);

        //var baklaLucka21 = lucke("bakla lucka2", new BABYLON.Vector3(0, 2, 23), new BABYLON.Vector3(1, -1, -16), 10, 10, 60, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
        //var baklaLucka3 = lucke("bakla lucka3", new BABYLON.Vector3(0, 3, -20), new BABYLON.Vector3(0.5, -1,10), 10, 10, 60, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
    });
}

function heightmap() {
    var groundMaterial = createMaterial(scene, "assets/textures/grass.jpg", 'ground4', 20, 20, new BABYLON.Color3(0, 0, 0));
    var ground4 = createBox(scene, groundMaterial, 100, 1, 100, 'ground4');
    ground4.position.x += -150;
    ground4.position.y -= 2;
    ground4.material = groundMaterial;
    scene.executeWhenReady(function() {
        ground4.setPhysicsState({ impostor: BABYLON.PhysicsEngine.HeightmapImpostor, move: false, mass: 0});
    });
}
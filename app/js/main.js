var engine, scene, canvas, camera;

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

    initScene();

    engine.runRenderLoop(function() {
        scene.render();
    });
}

function initScene() {
    scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(10, 20, 20), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas);

        // omogocim gravitacijo
    //scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    // camera.applyGravity = true;
    //camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;
    //camera.speed = 0.3;

        // ustvarim luč
    var h = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
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
     var music = new BABYLON.Sound("Music", "01. BT-7274.mp3", scene, null, {
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
    var groundMaterial = createMaterial(scene, './textures/floor.jpg', 'ground', 5.0, 5.0, new BABYLON.Color3.Black());
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
    glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight, h);
    glavna_sobana_obok(groundMaterial, roomLength);
    /**
     * ======
     * HODNIK
     * ======
     **/
    stranski_hodnik_in_klancina_tla_in_strop(groundMaterial);

}
    /**
     * GLAVNA SOBANA
     * **/
function glavna_sobana_zid(roomLength, wallHeight, wallWidth, octagonE) {
    var wallMaterial = createMaterial(scene, './textures/wall.jpg', 'wall', 1.5, 4.0, new BABYLON.Color3.Black());

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
    var wall12 = clone_and_properties(wall, 'wall12', -(2*roomLength - wallWidth - 11.0), 6, 0.01, (Math.PI/6), (Math.PI/2), 0, 1, 1, 1);
    var wall13 = clone_and_properties(wall, 'wall13', -(2*roomLength - wallWidth - 11.0), 6, -4.99, (Math.PI/6), (Math.PI/2), 0, 1, 1, 1);
}

function glavna_sobana_kupola(roomLength, wallHeight, wallWidth) {
    var ceilMaterial = createMaterial(scene, './textures/roof.jpg', 'ground', 1.0, 1.0, new BABYLON.Color3.Yellow());
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
    var platformMaterial = createMaterial(scene, "./textures/floor1.jpg", 'platform', 3.0, 3.0, new BABYLON.Color3.Black());
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
        //platform.checkCollisions = true;
    } else {
        console.error('platform not initiated');
    }
}

function glavna_sobana_stebri(wallHeight, stepHeight, stepSize, stepNum) {
    var pillarDiameter = 1.5;
    var pillarHeight = 1.2*wallHeight - stepNum * stepHeight;
    var pillarLocation = ((stepSize - 4 * stepNum * stepHeight) / 2) * 7 / 8;

    var pillarMaterial = createMaterial(scene, "./textures/pillar.jpg", 'pillar', 1.5, 2.0, new BABYLON.Color3.Black());
    var pillar = createCylinder(scene, pillarMaterial, pillarHeight, pillarDiameter, pillarDiameter, 'pillar1');
    pillar = properties(pillar, pillarLocation, (pillarHeight / 2 + stepNum * stepHeight), pillarLocation, 0, 0, 0, 1, 1, 1);

    var pillar2 = clone_and_properties(pillar, 'pillar2', -(2 * pillarLocation), 0, 0, 0, 0, 0, 1, 1, 1);
    var pillar3 = clone_and_properties(pillar, 'pillar3', -(2 * pillarLocation), 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1);
    var pillar4 = clone_and_properties(pillar, 'pillar4', 0, 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1);
}

function glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight, h) {
    var tableMaterial = createMaterial(scene, "./textures/tableTop.jpg", 'table', 3.0, 3.0, new BABYLON.Color3.Black());

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
    var ground3 = createBox(scene, groundMaterial, 40, 5, 20,'ground3');
    ground3 = properties(ground3, -70, 9.4, -2.5, (Math.PI/6), (Math.PI/2), 0, 1, 0.01, 1);

    var strop1 = clone_and_properties(ground2, 'strop1', 6.5, 5, 0, 0, 0, (Math.PI), 0.5, 0.01, 0.7);
    var strop2 = clone_and_properties(ground3, 'strop1', 5.43, 2.6, 0, 0, 0, (Math.PI), 0.5, 0.01, 0.7);
}

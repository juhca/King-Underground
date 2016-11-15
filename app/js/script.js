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
        /*
        * FOG
        * */
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.1;

        /*
        * Background music
        * */

    var music = new BABYLON.Sound("Music", "01. BT-7274.mp3", scene, null, {
       loop: true,
       autoplay: true
    });

    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(10, 20, 20), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas);

    /** ===================================================
     * DODAJAM GRAVITACIJO
     * */

    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;
    //camera.speed = 0.3;
    var h = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);

    //var plPosition = new BABYLON.Vector3(0, 25, 0);
    //var pl = new BABYLON.SpotLight('spotlight1', plPosition, new BABYLON.Vector3(0, -1, 0), 1.2, 1.2, scene);
    //pl.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
    //var plMat = new BABYLON.StandardMaterial('pl', scene);
    //plMat.emissiveColor = new BABYLON.Color3.Yellow();
    //var plMesh = BABYLON.MeshBuilder.CreateSphere('pl', {size: 0.3}, scene);
    //plMesh.material = plMat;
    //plMesh.position = plPosition;

    var showAxis = function(size) {
        var axisX = BABYLON.Mesh.CreateLines("axisX", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0) ], scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0) ], scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size) ], scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
    };
    showAxis(50);


    var roomLength = 50;
    var wallHeight = 5;
    var wallWidth = 1;
    // edge of regular triangle at edges of octagon
    var octagonE = 10;


    var groundMaterial = new BABYLON.StandardMaterial('ground', scene);
	groundMaterial.diffuseTexture = new BABYLON.Texture("floor.jpg",scene);
    groundMaterial.specularColor = new BABYLON.Color3.Black();
    groundMaterial.diffuseTexture.uScale = 5.0;
    groundMaterial.diffuseTexture.vScale = 5.0;

    var ground = BABYLON.MeshBuilder.CreateBox('ground', {
        size: roomLength,
        height: 1
    }, scene);
    ground.scaling.y = 0.01;
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    var wallMaterial = new BABYLON.StandardMaterial('wall', scene);
    wallMaterial.diffuseTexture = new BABYLON.Texture("wall.jpg", scene);
    wallMaterial.specularColor = new BABYLON.Color3.Black();
    wallMaterial.diffuseTexture.uScale = 1.5;
    wallMaterial.diffuseTexture.vScale = 4.0;
    // +x
    var wall = BABYLON.MeshBuilder.CreateBox('wall1', {
        height: wallHeight,
        width: wallWidth,
        depth: roomLength - 2 * octagonE
    }, scene);
    wall.position.y += wallHeight / 2;
    wall.position.x += roomLength / 2 - wallWidth / 2;
    wall.material = wallMaterial;
    wall.checkCollisions = true;

    // -x
    var wall2 = wall.clone('wall2');
    wall2.position.x -= roomLength - wallWidth;
    wall2.position.z -= 20.5

    var wall3 = wall.clone('wall3');
    wall3.position.x -= roomLength - wallWidth;
    wall3.position.z += 15.5;

    // +z
    var wall4 = wall.clone('wall4');
    wall4.position.x -= roomLength / 2 - wallWidth / 2;
    wall4.position.z += roomLength / 2 - wallWidth / 2;
    wall4.rotation.y += Math.PI / 2;

    // -z
    var wall5 = wall.clone('wall5');
    wall5.position.x -= roomLength / 2 - wallWidth / 2;
    wall5.position.z -= roomLength / 2 - wallWidth / 2;
    wall5.rotation.y += Math.PI / 2;

    // +x+z
    var wall6 = wall.clone('wall6');
    wall6.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall6.position.x -= octagonE / 2;
    wall6.position.z += roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall6.rotation.y -= Math.PI / 4;

    // -x+z
    var wall7 = wall.clone('wall7');
    wall7.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall7.position.x -= roomLength - octagonE / 2 - wallWidth;
    wall7.position.z += roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall7.rotation.y += Math.PI / 4;

    // -x-z
    var wall8 = wall.clone('wall8');
    wall8.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall8.position.x -= roomLength - octagonE / 2 - wallWidth;
    wall8.position.z -= roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall8.rotation.y -= Math.PI / 4;

    // +x-z
    var wall9 = wall.clone('wall9');
    wall9.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall9.position.x -= octagonE / 2;
    wall9.position.z -= roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall9.rotation.y += Math.PI / 4;

    var ceilMat = new BABYLON.StandardMaterial('ceilMat', scene);
    ceilMat.diffuseTexture = new BABYLON.Texture('roof.jpg', scene);
    ceilMat.specularColor = new BABYLON.Color3.Yellow();
    ceilMat.diffuseTexture.uScale = 1.0;
    ceilMat.diffuseTexture.vScale = 1.0;

    var sphereDiameter = roomLength - 2 * wallWidth;
    var ceilSphere = BABYLON.MeshBuilder.CreateSphere('ceilSphere', {
        diameter: sphereDiameter,
        slice: 0.5,
        sideOrientation: BABYLON.Mesh.BACKSIDE
    }, scene);
    ceilSphere.position.y += wallHeight;
    ceilSphere.material = ceilMat;

    var ceilPlane = BABYLON.MeshBuilder.CreateBox('ceilPlane', {
        size: roomLength,
        height: 2
    }, scene);
    ceilPlane.position.y += wallHeight + 1;
    ceilPlane.material = ceilMat;

    var csCSG = BABYLON.CSG.FromMesh(ceilSphere);
    var cpCSG = BABYLON.CSG.FromMesh(ceilPlane);
    var ceilSubplane = (cpCSG.subtract(csCSG)).toMesh('ceilSubplane', ceilMat, scene, false);
    //ceilSphere.dispose();
    ceilPlane.dispose();

    var stepHeight = 0.2;
    var stepSize = roomLength / 3;
    var stepNum = 3;

    var platformMat = new BABYLON.StandardMaterial('platform', scene);
    platformMat.diffuseTexture = new BABYLON.Texture("floor1.jpg", scene);
    platformMat.specularColor = new BABYLON.Color3.Black();
    platformMat.diffuseTexture.uScale = 3.0;
    platformMat.diffuseTexture.vScale = 3.0;


    var platform = false;

    for (var i = 0; i < stepNum; i++) {
        var step = BABYLON.MeshBuilder.CreateBox('step' + i, {
            size: stepSize - 4 * i * stepHeight,
            height: stepHeight
        }, scene);
        step.position.y += i * stepHeight + stepHeight / 2;

        if (!platform) {
            platform = BABYLON.CSG.FromMesh(step);
        } else {
            platform = platform.union(BABYLON.CSG.FromMesh(step));
        }
        step.dispose();
    }

    if (platform) {
        platform = platform.toMesh('platform', platformMat, scene, false);
        //platform.checkCollisions = true;
    } else {
        console.error('platform not initiated');
    }

    var pillarDiameter = 1.5;
    var pillarHeight = 3*wallHeight - stepNum * stepHeight;
    var pillarLocation = ((stepSize - 4 * stepNum * stepHeight) / 2) * 7 / 8;

    var pillarMat = new BABYLON.StandardMaterial('pillar', scene);
    pillarMat.diffuseTexture = new BABYLON.Texture("pillar.jpg", scene);
    pillarMat.specularColor = new BABYLON.Color3.Black();
    pillarMat.diffuseTexture.uScale = 1.5;
    pillarMat.diffuseTexture.vScale = 2.0;

    var pillar = BABYLON.MeshBuilder.CreateCylinder('pillar1', {
        height: pillarHeight,
        diameter: pillarDiameter
    }, scene);

    // +x+z
    pillar.position.y += pillarHeight / 2 + stepNum * stepHeight;
    pillar.position.x += pillarLocation;
    pillar.position.z += pillarLocation;
    pillar.material = pillarMat;
    pillar.checkCollisions = true;

    // -x+z
    var pillar1 = pillar.clone('pillar1');
    pillar1.position.x -= 2 * pillarLocation;

    // -x-z
    var pillar2 = pillar.clone('pillar2');
    pillar2.position.x -= 2 * pillarLocation;
    pillar2.position.z -= 2 * pillarLocation;

    var pillar3 = pillar.clone('pillar3');
    pillar3.position.z -= 2 * pillarLocation;

    /**
     * DODAM NOVO PLATFORMO
     * */
    var platform2 = platform.clone('platform2');
    platform2.position.y = 3*wallHeight - stepNum * stepHeight + 0.6;
    platform2.rotation.x += Math.PI;

    var tableDiameter = (stepSize - 4 * stepNum * stepHeight) * (3 / 5);
    var tableHeight = 1;

    var tableMat = new BABYLON.StandardMaterial('table', scene);
    tableMat.diffuseTexture = new BABYLON.Texture("tableTop.jpg", scene);
    tableMat.specularColor = new BABYLON.Color3.Black();
    tableMat.diffuseTexture.uScale = 3.0;
    tableMat.diffuseTexture.vScale = 3.0;

    var tableBot = BABYLON.MeshBuilder.CreateCylinder('tableBot', {
        height: tableHeight * (2 / 3),
        diameterTop: tableDiameter * (1 / 3),
        diameterBottom: tableDiameter * (2 / 3)
    }, scene);
    tableBot.position.y += (tableHeight * (2 / 3)) / 2 + stepNum * stepHeight;
    tableBot.checkCollisions = true;
    tableBot.material = tableMat;

    var tableTop = BABYLON.MeshBuilder.CreateCylinder('tableTop', {
        height: tableHeight * (1/3),
        diameterTop: tableDiameter,
        diameterBottom: tableDiameter * (1 / 3)
    }, scene);
    tableTop.position.y = tableBot.position.y + tableHeight * (1 / 3);
    tableTop.checkCollisions = true;
    tableTop.material = tableMat;

    /** ============================================================================0
     * DODATNE STENE ZA NA HODNIK
     **/
    var wall10 = wall.clone('wall10');
    wall10.position.x -= roomLength - wallWidth + 14.5;
    wall10.rotation.y += Math.PI/2;

    var wall11 = wall.clone('wall11');
    wall11.position.x -= roomLength - wallWidth + 14.5;
    wall11.position.z -= 5;
    wall11.rotation.y += Math.PI/2;

    /** ================================================================================
    * STENE ZA KLACINO
    * */
    var wall12 = wall.clone('wall12');
    wall12.position.x -= 2*roomLength - wallWidth - 11.0;
    wall12.position.y += 6;
    wall12.position.z += 0.01;
    wall12.rotation.y += Math.PI/2;
    wall12.rotation.x += Math.PI/6;

    var wall13 = wall.clone('wall13');
    wall13.position.x -= 2*roomLength - wallWidth - 11.0;
    wall13.position.y += 6;
    wall13.position.z -= 5;
    wall13.position.z += 0.01;
    wall13.rotation.y += Math.PI/2;
    wall13.rotation.x += Math.PI/6;

    /**
     * ==============================================================================
     * TLA ZA HODNIK
     */
    var ground2 = BABYLON.MeshBuilder.CreateBox('ground2', {
        size: 40,
        width: 20,
        height: 1
    }, scene);

    ground2.scaling.y = 0.01;
    ground2.position.z -= 2.5;
    ground2.position.x -= 45;
    ground2.rotation.y += Math.PI/2;
    ground2.material = groundMaterial;
    ground2.checkCollisions = true;
    /**
     * ==============================================================================
     * TLA ZA KLANCICO
     */
    var ground3 = BABYLON.MeshBuilder.CreateBox('ground3', {
        size: 40,
        width: 20,
        height: 5
    }, scene);

    ground3.scaling.y = 0.01;
    ground3.position.z -= 2.5;
    ground3.position.x -= 70;
    ground3.position.y += 9.4;
    ground3.rotation.y += Math.PI/2;
    ground3.rotation.x += Math.PI/6;
    ground3.material = groundMaterial;
    ground3.checkCollisions = true;

    /**
     * */
}
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
    //scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    //scene.fogDensity = 0.1;

        /*
        * Background music
        * */

    //var music = new BABYLON.Sound("Music", "01. BT-7274.mp3", scene, null, {
    //   loop: true,
    //   autoplay: true
    //});

    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 50, -50), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas);

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


    var wallMaterial = new BABYLON.StandardMaterial('wall', scene);
    wallMaterial.diffuseTexture = new BABYLON.Texture("wall.jpg", scene);
    wallMaterial.specularColor = new BABYLON.Color3.Black();
    wallMaterial.diffuseTexture.uScale = 1.5;
    wallMaterial.diffuseTexture.vScale = 4.0;
    //wallMaterial.diffuseColor = new BABYLON.Color3.Gray();

    // +x
    var wall = BABYLON.MeshBuilder.CreateBox('wall1', {
        height: wallHeight,
        width: wallWidth,
        depth: roomLength - 2 * octagonE
    }, scene);
    wall.position.y += wallHeight / 2;
    wall.position.x += roomLength / 2 - wallWidth / 2;
    wall.material = wallMaterial;

    // -x
    var wall2 = wall.clone('wall2');
    wall2.position.x -= roomLength - wallWidth;

    // +z
    var wall3 = wall.clone('wall3');
    wall3.position.x -= roomLength / 2 - wallWidth / 2;
    wall3.position.z += roomLength / 2 - wallWidth / 2;
    wall3.rotation.y += Math.PI / 2;

    // -z
    var wall4 = wall.clone('wall4');
    wall4.position.x -= roomLength / 2 - wallWidth / 2;
    wall4.position.z -= roomLength / 2 - wallWidth / 2;
    wall4.rotation.y += Math.PI / 2;

    // +x+z
    var wall5 = wall.clone('wall5');
    wall5.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall5.position.x -= octagonE / 2;
    wall5.position.z += roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall5.rotation.y -= Math.PI / 4;

    // -x+z
    var wall6 = wall.clone('wall6');
    wall6.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall6.position.x -= roomLength - octagonE / 2 - wallWidth;
    wall6.position.z += roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall6.rotation.y += Math.PI / 4;

    // -x-z
    var wall7 = wall.clone('wall7');
    wall7.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall7.position.x -= roomLength - octagonE / 2 - wallWidth;
    wall7.position.z -= roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall7.rotation.y -= Math.PI / 4;

    // +x-z
    var wall8 = wall.clone('wall8');
    wall8.scaling.z *= Math.sqrt(2 * Math.pow(octagonE, 2)) / (roomLength - 2 * octagonE);
    wall8.position.x -= octagonE / 2;
    wall8.position.z -= roomLength / 2 - octagonE / 2 - wallWidth / 2;
    wall8.rotation.y += Math.PI / 4;

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
    //platformMat.diffuseColor = new BABYLON.Color3.Blue();


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
    } else {
        console.error('platform not initiated');
    }

    var pillarDiameter = 1.5;
    var pillarHeight = wallHeight - stepNum * stepHeight;
    var pillarLocation = ((stepSize - 4 * stepNum * stepHeight) / 2) * 7 / 8;

    var pillarMat = new BABYLON.StandardMaterial('pillar', scene);
    pillarMat.diffuseTexture = new BABYLON.Texture("pillar.jpg", scene);
    pillarMat.specularColor = new BABYLON.Color3.Black();
    pillarMat.diffuseTexture.uScale = 1.5;
    pillarMat.diffuseTexture.vScale = 2.0;
    //pillarMat.diffuseColor = new BABYLON.Color3.Gray();

    var pillar = BABYLON.MeshBuilder.CreateCylinder('pillar1', {
        height: pillarHeight,
        diameter: pillarDiameter
    }, scene);

    // +x+z
    pillar.position.y += pillarHeight / 2 + stepNum * stepHeight;
    pillar.position.x += pillarLocation;
    pillar.position.z += pillarLocation;
    pillar.material = pillarMat;

    // -x+z
    var pillar1 = pillar.clone('pillar1');
    pillar1.position.x -= 2 * pillarLocation;

    // -x-z
    var pillar2 = pillar.clone('pillar2');
    pillar2.position.x -= 2 * pillarLocation;
    pillar2.position.z -= 2 * pillarLocation;

    var pillar3 = pillar.clone('pillar3');
    pillar3.position.z -= 2 * pillarLocation;

    var tableDiameter = (stepSize - 4 * stepNum * stepHeight) * (3 / 5);
    var tableHeight = 1;

    var tableMat = new BABYLON.StandardMaterial('table', scene);
    tableMat.diffuseColor = new BABYLON.Color3.Gray();

    var tableBot = BABYLON.MeshBuilder.CreateCylinder('tableBot', {
        height: tableHeight * (2 / 3),
        diameterTop: tableDiameter * (1 / 3),
        diameterBottom: tableDiameter * (2 / 3)
    }, scene);
    tableBot.position.y += (tableHeight * (2 / 3)) / 2 + stepNum * stepHeight;
    tableBot.material = tableMat;

    var tableTop = BABYLON.MeshBuilder.CreateCylinder('tableTop', {
        height: tableHeight * (1/3),
        diameterTop: tableDiameter,
        diameterBottom: tableDiameter * (1 / 3)
    }, scene);
    tableTop.position.y = tableBot.position.y + tableHeight * (1 / 3);
    tableTop.material = tableMat;

}
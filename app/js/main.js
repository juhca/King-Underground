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
    //var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 40, 40), scene);
    //camera.setTarget(BABYLON.Vector3.Zero());

    /* change for different camera focus */
    var cpos = new BABYLON.Vector3(-371.1, 49.0, 153.1);

    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(cpos.x, cpos.y + 15, cpos.z + 15), scene);
    camera.setTarget(cpos);

    camera.attachControl(canvas);

    /* physics */
    scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());

    // ustvarim luč
    var h = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);

    /*var showAxis = function(size) {
        var axisX = BABYLON.Mesh.CreateLines("axisX", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0) ], scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0) ], scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size) ], scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
    };
    showAxis(50);*/

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

    new MainEnvironment(scene);

    var hero = new Hero(scene);
    //var goblin1 = new Goblin(scene, 1, new BABYLON.Vector3(-128, 0.5, 0));

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
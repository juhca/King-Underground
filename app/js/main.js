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

    scene.clearColor = new BABYLON.Color3.Black();

    /* physics */
    scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());

    /* global light */
    var h = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
    h.groundColor = new BABYLON.Color3.Gray();
    h.intensity = 0.35;

    /* fog */
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.05;
    scene.fogColor = new BABYLON.Color3(0.05, 0.05, 0.05);

    /* set default camera */
    var cpos = new BABYLON.Vector3(-371.1, 49.0, 153.1); // change for different camera focus
    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(cpos.x, cpos.y + 15, cpos.z + 15), scene);
    camera.setTarget(cpos);
    camera.attachControl(canvas);


    /* background music */
    /*
    var music = new BABYLON.Sound("Music", "./music/01. BT-7274.mp3", scene, null, {
    loop: true,
    autoplay: true
    });
    */

    new MainEnvironment(scene);

    //var hero = new Hero(scene);
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
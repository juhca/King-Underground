var engine, scene, canvas, HERO;
var SHADOWS = {};

window.addEventListener("resize", function () {
    if (engine) {
        engine.resize();
    }
},false);

function onload() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

    /* no caching */
    engine.enableOfflineSupport = false;

    engine.displayLoadingUI();

    initScene();

    runEngine();
}

function runEngine() {
    if (HERO) {
        HERO.initListeners();
    }
    engine.runRenderLoop(function() {
        scene.render();
    });
}

function initScene() {
    scene = new BABYLON.Scene(engine);

    scene.executeWhenReady(function() {
        engine.hideLoadingUI();
    });

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
    var cpos = new BABYLON.Vector3(100, 50, 50); // change for different camera focus; (100, 50, 50) -> nothing
    var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(cpos.x, cpos.y + 15, cpos.z + 15), scene);
    camera.setTarget(cpos);
    camera.attachControl(canvas);


    /* background music */

    var music = new BABYLON.Sound("Music", "./music/DOOM (2016) OST - 42 - Rip & Tear.mp3", scene, null, {
    loop: true,
    autoplay: true,
    volume: 0.03
    });


    new MainEnvironment(scene);

    HERO = new Hero(scene);

    new GoblinController(scene);

}

function randomInRange(start, end) {
    return Math.random() * (end - start) + start;
}

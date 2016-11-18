Sword = function(scene, afterload) {
    this.scene = scene;
    this.mesh = null;

    var _this = this;

    this.animation = {
        'run': null,
        'attack1': null
    };

    BABYLON.SceneLoader.ImportMesh('', 'assets/weapons/sword/', 'sword.babylon', this.scene, function(meshes, particleSystems, skeletons) {
        _this.mesh = meshes[0];

        _this.mesh.position.x = -0.3;
        //_this.mesh.position.z = 1;
        _this.mesh.position.y = 0.4;

        //_this.mesh.scaling.x *= 0.2;
        //_this.mesh.scaling.z *= 0.2;
        //_this.mesh.scaling.y *= 0.2;

        _this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(- Math.PI * 30 / 100, - Math.PI / 4, 0);
        _this.mesh.rotationQuaternion.multiplyInPlace(BABYLON.Quaternion.RotationYawPitchRoll(0, 0, - Math.PI * 17 / 100));
        //_this.mesh.rotationQuaternion.multiplyInPlace(BABYLON.Quaternion.RotationYawPitchRoll(Math.PI * 35 / 100, 0, 0));

        _this.animation.run = initRun();
        _this.animation.attack1 = initAttack1();

        afterload();
    });


    function initAttack1() {
        var initialQuat = _this.mesh.rotationQuaternion.clone();
        var animation = new BABYLON.Animation("sword-attack1", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var keys = [
            {frame: 0, value: initialQuat},
            {frame: 5, value: initialQuat.multiply(BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, Math.PI / 2))},
            {frame: 20, value: initialQuat}
        ];

        animation.setKeys(keys);

        return animation;
    }

    function initRun() {
        var initialQuat = _this.mesh.rotationQuaternion.clone();
        var animation = new BABYLON.Animation("sword-walk", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var keys = [
            {frame: 0, value: initialQuat},
            {frame: 20, value: initialQuat.multiply(BABYLON.Quaternion.RotationYawPitchRoll(Math.PI / 4, 0, Math.PI / 8))},
            {frame: 27, value: initialQuat}
        ];

        animation.setKeys(keys);

        return animation;
    }
};

Sword.prototype = {
    attach: function(character, bone) {
        this.mesh.attachToBone(bone, character);
    }
};
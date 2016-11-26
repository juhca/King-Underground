GoblinController = function(scene) {
    this.scene = scene;
    this.mesh = null;
    this.skeleton = null;
    this.target = null;
    this.targetName = 'hero';
    this.particleSystem = null;

    this.lastIndex = 0;

    this._initMesh();

    var _this = this;
    this.scene.executeWhenReady(function() {
        _this.target = _this.scene.getMeshByName(_this.targetName);
        _this.initialSpawn();
    });
};

GoblinController.prototype = {
    _initMesh: function() {
        var _this = this;
        BABYLON.SceneLoader.ImportMesh('', 'assets/characters/goblin/', 'gobo6a.babylon', this.scene, function(meshes, particleSystems, skeletons) {
            _this.mesh = meshes[0];
            _this.mesh.isVisible = false;
            _this.skeleton = skeletons[0];

            _this.mesh.scaling.x = 0.12;
            _this.mesh.scaling.z = 0.12;
            _this.mesh.scaling.y = 0.12;

            /* Animation frames
             * Run:  0 - 43
             * Kick: 44 - 54
             * Punch1: 55 - 115
             * Punch2: 116 - 160
             * Punch3: 161 - 205
             * Punch4: 206 - 285
             * Idle1: 302 - 421
             * Fall/die: 422 - 470
             * */
        }, function(){}, function(o, e) {
            console.error('Goblin model loading error.');
            console.error(e);
        });
    },

    initialSpawn: function() {
        var positions = [
            [-150, 0, -10],
            [-150, 0, 10]
        ];

        for (var i = 0; i < positions.length; i++) {
            this.lastIndex++;
            new Goblin(this, this.lastIndex, new BABYLON.Vector3(positions[i][0], positions[i][1], positions[i][2]), scene);
        }
    }
};

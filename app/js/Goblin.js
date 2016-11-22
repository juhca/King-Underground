Goblin = function(scene, position) {
    this.scene = scene;
    this.canvas = this.scene.getEngine().getRenderingCanvas();
    this.mesh = null;
    this.skeleton = null;

    /* movement */
    this.defaultVelocity = 0.1; // magic
    this.velocity = new BABYLON.Vector3(0, -5, 0); // vector of movement per render cycle
    this.isMoving = false;

    /* collisions */
    this.aggroRange = 200;
    this.sphereAggro = null; // sphere for enemy detection
    this.attackRange = 2;
    this.sphereAttack = null;
    this.collisionTransitionRange = 50;
    this.sphereCollision = null;

    this.targetName = 'hero';
    this.target = null;

    this.triggers = {
        alpha: 0,
        isClose: false, // is enemy close
        isCombat: false
    };

    /* animations */
    this.animation = {
        combat: null
    };
    this.attackList = [this.animatePunch3, this.animateKick];

    var _this = this;


    _this._init(position);

    _this.scene.registerBeforeRender(beforeRender);

    function beforeRender() {
        if (_this.isMoving) {
            if (_this.triggers.isClose) {
                _this.mesh.translate(BABYLON.Axis.Z, -4 * _this.defaultVelocity, BABYLON.Space.LOCAL);
            } else {
                _this.mesh.moveWithCollisions(_this.velocity);
            }
        }
        if (_this.triggers.isCombat) {
            _this.combat();
        }
    }
};

Goblin.prototype = {
    _init: function(position) {
        var _this = this;

        BABYLON.SceneLoader.ImportMesh('', 'assets/characters/goblin/', 'gobo6a.babylon', this.scene, function(meshes, particleSystems, skeletons) {
            _this.mesh = meshes[0];
            _this.skeleton = skeletons[0];

            _this.mesh.scaling.x *= 0.12;
            _this.mesh.scaling.z *= 0.12;
            _this.mesh.scaling.y *= 0.12;

            //_this.mesh.rotation.y += Math.PI / 8;
            //_this.mesh.position.y += 0.5;

            if (position) {
                _this.mesh.position = position;
            }

            _this.mesh.checkCollisions = true;
            _this.mesh.ellipsoid = new BABYLON.Vector3(0.24, 0.6, 0.24);
            _this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
            _this.mesh.applyGravity = true;

            //_this.mesh.showBoundingBox = true;
            //console.log(_this.mesh.getBoundingInfo());

            _this.scene.executeWhenReady(function() {
                _this.target = _this.scene.getMeshByName(_this.targetName);
                _this._initTriggers();
            });

            _this.animateIdle();

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

    _initTriggers: function() {
        var _this = this;

        var spMat = new BABYLON.StandardMaterial('spmat', _this.scene);
        spMat.alpha = 0.1;

        /* aggro detection */
        this.sphereAggro = new BABYLON.MeshBuilder.CreateSphere('goboSphere1', {diameter: this.aggroRange * 2}, this.scene);
        this.sphereAggro.parent = this.mesh;
        this.sphereAggro.material = spMat;
        //this.sphereAggro.isVisible = false;

        this.sphereAggro.actionManager = new BABYLON.ActionManager(this.scene);
        /* enter */
        this.sphereAggro.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: this.target
        }, registerRun));
        /* exit */
        this.sphereAggro.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: this.target
        }, function() {
            unregisterRun();
            _this.animateIdle();
        }));


        /* attack detection */
        this.sphereAttack = new BABYLON.MeshBuilder.CreateSphere('goboSphere2', {diameter: this.attackRange * 2}, this.scene);
        this.sphereAttack.parent = this.mesh;
        this.sphereAttack.material = spMat;
        //this.sphereAttack.isVisible = false;

        this.sphereAttack.actionManager = new BABYLON.ActionManager(this.scene);
        /* enter */
        this.sphereAttack.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: this.target
        }, function() {
            unregisterRun();
            _this.triggers.isCombat = true;
        }));
        /* exit */
        this.sphereAttack.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: this.target
        }, function() {
            _this.triggers.isCombat = false;
            registerRun();
        }));


        /* collision change detection */
        this.sphereCollision = new BABYLON.MeshBuilder.CreateSphere('goboSphere3', {diameter: this.collisionTransitionRange * 2}, this.scene);
        this.sphereCollision.parent = this.mesh;
        this.sphereCollision.material = spMat;
        //this.sphereCollision.isVisible = false;

        this.sphereCollision.actionManager = new BABYLON.ActionManager(this.scene);
        /* enter */
        this.sphereCollision.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: this.target
        }, function() {
            _this.triggers.isClose = true;
            _this.mesh.checkCollisions = false;
        }));
        /* exit */
        this.sphereCollision.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: this.target
        }, function() {
            _this.triggers.isClose = false;
            _this.mesh.checkCollisions = true;
        }));


        function registerRun() {
            _this.animateRun();
            _this.target.registerAfterWorldMatrixUpdate(updateRun);
        }

        function unregisterRun() {
            _this.target.unregisterAfterWorldMatrixUpdate(updateRun);
            _this.isMoving = false;
        }

        function updateRun() {
            var pos = _this.target.position;

            var selfDir = new BABYLON.Vector3(0, 0, -1);
            var targetDir = pos.subtract(_this.mesh.position);

            //selfDir.normalize();
            targetDir.normalize();

            /* rotate to target */
            _this.triggers.alpha = Math.acos(BABYLON.Vector3.Dot(selfDir, targetDir));
            if (targetDir.x < 0) {
                _this.triggers.alpha *= -1;
            }
            _this.mesh.rotation.y -= _this.mesh.rotation.y + _this.triggers.alpha;

            _this.isMoving = true;
            /* set velocity */
            _this.velocity.x = _this.defaultVelocity * targetDir.x;
            _this.velocity.z = _this.defaultVelocity * targetDir.z;
        }
    },

    combat: function() {
        if (!this.animation.combat) {
            this.attackList[Math.floor(Math.random() * this.attackList.length)](this);
        }
    },

    animateRun: function() {
        this.scene.beginAnimation(this.skeleton, 0, 43, true, 2.5);
    },

    animateKick: function(_this) {
        _this.animation.combat = _this.scene.beginAnimation(_this.skeleton, 44, 54, false, 1.0, function() {
            _this.animateRun();
            setTimeout(function() {
                _this.animation.combat = null;
            }, 2000)
        });
    },

    animatePunch3: function(_this) {
        _this.animation.combat = _this.scene.beginAnimation(_this.skeleton, 161, 205, false, 2.0, function() {
            _this.animateRun();
            setTimeout(function() {
                _this.animation.combat = null;
            }, 2000)
        });
    },

    animateIdle: function() {
        this.scene.beginAnimation(this.skeleton, 303, 372, true, 0.8);
    },

    animateDie: function() {
        this.scene.beginAnimation(this.skeleton, 373, 421, false, 1.0);
    }
};
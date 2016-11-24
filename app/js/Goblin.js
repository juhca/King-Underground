Goblin = function(scene, index, position) {
    this.scene = scene;
    this.canvas = this.scene.getEngine().getRenderingCanvas();
    this.mesh = null;
    this.body = null;
    this.skeleton = null;

    /* movement */
    this.defaultVelocity = 2;
    this.velocity = null; // vector of movement per render cycle
    this.isMoving = false;

    /* collisions */
    this.aggroRange = 200;
    this.sphereAggro = null; // sphere for enemy detection
    this.attackRange = 8;
    this.sphereAttack = null;
    this.attackRangeMesh = null;

    this.targetName = 'hero';
    this.target = null;

    this.hitPoints = 3;
    this.isDead = false;
    this.bloodEmitMesh = 0;
    this.particleSystem = null;

    this.triggers = {
        isClose: false, // is enemy close
        isCombat: false
    };

    /* animations */
    this.animation = {
        combat: null
    };
    this.attackList = [this.animatePunch3, this.animateKick];

    var _this = this;


    _this._init(index, position);

    _this.scene.registerBeforeRender(beforeRender);

    function beforeRender() {
        if (_this.isDead) {
            return;
        }
        if (_this.isMoving) {
            /* rotate to target */
            var targetDir = _this.target.position.subtract(_this.mesh.position);
            var yaw = -Math.atan2(targetDir.z, targetDir.x) - 3 * Math.PI / 4;
            _this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);

            /* set velocity */
            var rot = new BABYLON.Matrix();
            _this.mesh.rotationQuaternion.toRotationMatrix(rot);
            _this.velocity = new BABYLON.Vector3(-_this.defaultVelocity, -10, -_this.defaultVelocity);
            _this.velocity = BABYLON.Vector3.TransformCoordinates(_this.velocity, rot);

            _this.mesh.getPhysicsImpostor().setLinearVelocity(_this.velocity);
        }
        if (_this.triggers.isCombat) {
            _this.combat();
        }
    }
};

Goblin.prototype = {
    _init: function(index, position) {
        var _this = this;

        BABYLON.SceneLoader.ImportMesh('', 'assets/characters/goblin/', 'gobo6a.babylon', this.scene, function(meshes, particleSystems, skeletons) {
            _this.mesh = meshes[0];
            _this.mesh.name = 'goblin' + index;
            _this.skeleton = skeletons[0];

            _this.mesh.scaling.x *= 0.12;
            _this.mesh.scaling.z *= 0.12;
            _this.mesh.scaling.y *= 0.12;

            if (position) {
                _this.mesh.position = position;
            }

            _this.animateIdle();

            _this.scene.executeWhenReady(function() {
                /* physics */
                _this.body = _this.mesh.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:50, restitution: 0, friction: 0});
                _this.body.linearDamping = 0.99;

                _this.target = _this.scene.getMeshByName(_this.targetName);
                _this._initTriggers();

                _this.createFrontCollider();
                _this._initBloodEmit();
            });

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
        this.sphereAggro.isVisible = false;

        this.sphereAggro.actionManager = new BABYLON.ActionManager(this.scene);
        /* enter */
        this.sphereAggro.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: this.target
        }, function() {
            if (_this.isDead) {
                return;
            }
            _this.isMoving = true;
            _this.animateRun();
        }));
        /* exit */
        this.sphereAggro.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: this.target
        }, function() {
            if (_this.isDead) {
                return;
            }
            _this.isMoving = false;
            _this.animateIdle();
        }));


        /* attack detection */
        this.sphereAttack = new BABYLON.MeshBuilder.CreateSphere('goboSphere2', {diameter: this.attackRange * 2}, this.scene);
        this.sphereAttack.parent = this.mesh;
        this.sphereAttack.material = spMat;
        this.sphereAttack.isVisible = false;

        this.sphereAttack.actionManager = new BABYLON.ActionManager(this.scene);
        /* enter */
        this.sphereAttack.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: this.target
        }, function() {
            if (_this.isDead) {
                return;
            }
            _this.isMoving = false;
            _this.triggers.isCombat = true;
            _this.target.getHero().appendEnemy(_this);
        }));
        /* exit */
        this.sphereAttack.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
            parameter: this.target
        }, function() {
            if (_this.isDead) {
                return;
            }
            _this.isMoving = true;
            _this.triggers.isCombat = false;
            _this.animateRun();
            _this.target.getHero().removeEnemy(_this.mesh.name);
        }));
    },

    _initBloodEmit: function() {
        this.bloodEmitMesh = BABYLON.MeshBuilder.CreateBox("s", {height: 1, width: 1, depth: 1}, this.scene);
        this.bloodEmitMesh.position.y  += 6;
        this.bloodEmitMesh.position.z -= 1.5;
        this.bloodEmitMesh.rotation.z += Math.PI / 4;
        this.bloodEmitMesh.isVisible = false;
        this.bloodEmitMesh.parent = this.mesh;

        this.particleSystem = new BABYLON.ParticleSystem('pBlood', 2000, scene);

        this.particleSystem.particleTexture = new BABYLON.Texture('assets/textures/blood.jpg', scene);
        this.particleSystem.emitter = this.bloodEmitMesh;

        this.particleSystem.minSize = 0.05;
        this.particleSystem.maxSize = 0.1;

        this.particleSystem.emitRate = 1500;

        this.particleSystem.direction1 = new BABYLON.Vector3(5, 0, 5);

        this.particleSystem.minEmitBox = new BABYLON.Vector3(-1.5, 0, 0);
        this.particleSystem.maxEmitBox = new BABYLON.Vector3(1.5, 0, 0);

        this.particleSystem.minLifeTime = 0.15;
        this.particleSystem.maxLifeTime = 0.15;

        this.particleSystem.minEmitPower = 10;
        this.particleSystem.maxEmitPower = 15;
    },

    emitBlood: function() {

        this.particleSystem.start();

        var _this = this;
        setTimeout(function() {
            _this.particleSystem.stop();
        }, 400);
    },

    onHit: function() {
        var _this = this;

        _this.emitBlood();
        _this.hitPoints--;

        if (_this.hitPoints < 1) {
            _this.target.getHero().removeEnemy(_this.mesh.name);
            _this.isMoving = false;
            _this.triggers.isCombat = false;

            _this.isDead = true;

            _this.animateDie(function() {
                setTimeout(function() {
                    _this.mesh.dispose();
                    _this.mesh = null;
                }, 10);
            });
        }
    },

    combat: function() {
        if (!this.animation.combat) {
            this.attackList[Math.floor(Math.random() * this.attackList.length)](this);
        }
    },

    createFrontCollider: function() {
        this.attackRangeMesh = BABYLON.MeshBuilder.CreateBox("s", {height: 16, width: 8, depth: 12}, this.scene);
        this.attackRangeMesh.position.y += 8;
        this.attackRangeMesh.position.z -= 6;
        this.attackRangeMesh.position.x -= 3;
        this.attackRangeMesh.isVisible = false;
        this.attackRangeMesh.parent = this.mesh;
    },

    handleAttack: function() {
        if (this.target.intersectsMesh(this.attackRangeMesh, false)) {
            this.target.getHero().onHit();
        }
    },

    animateRun: function() {
        if (this.isDead) {
            return;
        }
        this.scene.beginAnimation(this.skeleton, 0, 43, true, 2.5);
    },

    animateKick: function(_this) {
        _this.animation.combat = _this.scene.beginAnimation(_this.skeleton, 44, 54, false, 0.6, function() {
            if (_this.isDead) {
                return;
            }
            _this.animateRun();
            setTimeout(function() {
                _this.animation.combat = null;
            }, 2000)
        });

        _this.animation.combat.getAnimations()[0].addEvent(new BABYLON.AnimationEvent(51, function() { _this.handleAttack(); }, true));
    },

    animatePunch3: function(_this) {
        _this.animation.combat = _this.scene.beginAnimation(_this.skeleton, 161, 205, false, 1.0, function() {
            if (_this.isDead) {
                return;
            }
            _this.animateRun();
            setTimeout(function() {
                _this.animation.combat = null;
            }, 2000)
        });

        _this.animation.combat.getAnimations()[0].addEvent(new BABYLON.AnimationEvent(180, function() { _this.handleAttack(); }, true));
    },

    animateIdle: function() {
        this.scene.beginAnimation(this.skeleton, 303, 372, true, 0.8);
    },

    animateDie: function(onEnd) {
        this.scene.beginAnimation(this.skeleton, 373, 421, false, 1.0, onEnd);
    }
};
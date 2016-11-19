Hero = function(scene) {
    this.scene = scene;
    this.canvas = this.scene.getEngine().getRenderingCanvas();
    this.mesh = null;
    this.skeleton = null;
    this.body = null;
    this.weapon = null;
    this.defaultVelocity = 0.16;
    this.translation = {
        'x': 0,
        'z': 0
    };
    this.animation = {
        'walk': null,
        'run': null,
        'weaponRun': null, // animation of weapon while running
        'attack': null,
        'weaponAttack': null
    };
    this.pressedKeys = {
        'w': false, 'a': false, 's': false, 'd': false
    };

    var _this = this;

    this._initListeners();

    this._init(); // import mesh

    /* Handle actions */
    this.scene.registerBeforeRender(beforeRender);

    function beforeRender() {
        if (_this.isWASD()) {
            _this.rotateCamera();
        }
        if (_this.translation.x || _this.translation.z) {
            var rot = new BABYLON.Matrix();
            _this.mesh.rotationQuaternion.toRotationMatrix(rot);
            var translation = new BABYLON.Vector3(_this.translation.x, 0, _this.translation.z);
            translation = BABYLON.Vector3.TransformCoordinates(translation, rot);
            translation.y = -9.81;
            _this.mesh.moveWithCollisions(translation);
        }

        if (!_this.animation.run && _this.animation.weaponRun && _this.animation.weaponRun.animationStarted) {
            _this.stopWeaponAnimation();
        }
    }
};

Hero.prototype = {
    _init: function() {
        var _this = this;
        /* Import character model */
        BABYLON.SceneLoader.ImportMesh('', 'assets/characters/hero/', 'km13.babylon', this.scene, function(meshes, particleSystems, skeletons) {
            _this.mesh = meshes[0];
            _this.mesh.scaling.x *= 0.12;
            _this.mesh.scaling.z *= 0.12;
            _this.mesh.scaling.y *= 0.12;

            _this.mesh.position.y += 5;

            /* COLLISION */
            _this.mesh.checkCollisions = true;
            _this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
            _this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
            _this.mesh.applyGravity = true;
            //_this.body = _this.mesh.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:1});

            _this.skeleton = skeletons[0];

            _this._initCamera();
            _this._initSword();

            _this.animateIdle(_this);

            //_this.mesh.showBoundingBox = true;
            //console.log(_this.mesh.getBoundingInfo());

            /* Animation frames:
             * Walk: 1 - 29
             * Run: 30 - 52
             * Sword1.1: 53 - 143
             * Sword1.2: 144 - 214
             * Sword1.3: 215 - 295
             * Sword1.4: 296 - 425
             * Sword2.1: 426 - 496
             * Sword2.2: 497 - 557
             * Sword2.3: 558 - 612
             * Sword2.4: 613 - 677
             * Sword2.5: 678 - 730
             * Sword2.6: 731 - 765
             * Sword2.7: 766 - 800
             * Sword2.8: 801 - 837
             * Sword2.9: 838 - 872
             * Sword2.10: 873 - 903
             * Sword2.11: 904 - 986
             * Wait: 987 - 1134
             * */

        }, function(){}, function(o, e) {
            console.error('Hero model loading error.');
            console.error(e);
        });
    },

    _initCamera: function() {
        var camera = new BABYLON.ArcRotateCamera('herocam', Math.PI / 2, Math.PI / 4, 18, this.mesh, this.scene);
        camera.attachControl(this.canvas);

        this.scene.activeCamera = camera;
        //this.scene.getEngine().isPointerLock = true;
    },

    _initSword: function() {
        var _this = this;

        _this.weapon = new Sword(this.scene, function() {
            var bones = _this.skeleton.bones;
            for (var i = 0; i < bones.length; i++) {
                if (bones[i].id === 'RThumb') { // RightHandFinger1
                    _this.weapon.attach(_this.mesh, bones[i]);
                }
            }
        });
    },

    _initListeners: function() {
        var _this = this;

        this.canvas.oncontextmenu = function(evt) {
            evt.preventDefault();
        };

        this.canvas.onmousedown = function(evt) {
            _this.handleMousedown(evt);
        };

        document.addEventListener('keydown', function(evt) {
            _this.handleKeydown(evt);
        });

        document.addEventListener('keyup', function(evt) {
            _this.handleKeyup(evt);
        });
    },

    animateIdle: function(_this) {
        _this.scene.beginAnimation(_this.skeleton, 1123, 1124, true, 1);

        _this.stopWeaponAnimation();
    },

    animateWalk: function(_this) {
        if (!_this.animation.walk) {
            _this.animation.walk = _this.scene.beginAnimation(_this.skeleton, 3, 30, true, 1.0);
        }
    },

    animateRun: function(_this, force) {
        if ((!_this.animation.run || force) && !_this.animation.attack) {
            _this.animation.run = _this.scene.beginAnimation(_this.skeleton, 31, 53, true, 1.0);
            _this.animation.weaponRun = _this.scene.beginDirectAnimation(_this.weapon.mesh, [_this.weapon.animation.run], 0, 27, true, 1.0);
        }
    },

    animateSword1: function(_this) {
        if (_this.animation.attack) {
            return;
        }

        _this.stopWeaponAnimation();

        _this.animation.attack = _this.scene.beginAnimation(_this.skeleton, 105, 142, false, 2.5, function() {
            _this.animation.attack = null;
            if (_this.isWASD()) {
                _this.animateRun(_this, true);
            } else {
                _this.animateIdle(_this);
            }
        });

        if (_this.animation.attack) {
            _this.animation.weaponAttack = _this.scene.beginDirectAnimation(_this.weapon.mesh, [_this.weapon.animation.attack1], 0, 20, false, 1.0, function () {
                _this.animation.weaponAttack = null;
            });
        }

        _this.animationFramelock = 10;
    },

    stopWeaponAnimation: function() {
        if (this.animation.weaponRun) {
            this.animation.weaponRun.goToFrame(0);
            this.animation.weaponRun.pause();
            this.animation.weaponRun = null;
        }

        if (this.animation.weaponAttack) {
            this.animation.weaponAttack.goToFrame(0);
            this.animation.weaponAttack.pause();
            this.animation.weaponAttack = null;
        }
    },

    rotateCamera: function() {
        /* rotate with camera */
        var dv = this.mesh.position.subtract(this.scene.activeCamera.position);
        var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
        this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
    },
    handleMousedown: function(evt) {
        if (evt.which === 1) {
            this.rotateCamera();
            this.animateSword1(this);
        }
    },

    isWASD: function() {
        for (var key in this.pressedKeys) {
            if (this.pressedKeys.hasOwnProperty(key) && this.pressedKeys[key] === true) {
                return true;
            }
        }
        return false;
    },

    handleKeydown: function(evt) {
        switch(evt.keyCode) {
            case 87: // W
                this.pressedKeys['w'] = true;
                this.translation.z = -this.defaultVelocity;
                this.animateRun(this);
                break;
            case 65: // A
                this.pressedKeys['a'] = true;
                this.translation.x = this.defaultVelocity;
                this.animateRun(this);
                break;
            case 83: // S
                this.pressedKeys['s'] = true;
                this.translation.z = this.defaultVelocity;
                this.animateWalk(this);
                break;
            case 68: // D
                this.pressedKeys['d'] = true;
                this.translation.x = -this.defaultVelocity;
                this.animateRun(this);
                break;
        }
    },

    handleKeyup: function(evt) {
        switch(evt.keyCode) {
            case 87: // W
                this.pressedKeys['w'] = false;
                if (!this.pressedKeys['s']) {
                    this.translation.z = 0;
                }
                break;
            case 83: // S
                this.pressedKeys['s'] = false;
                if (!this.pressedKeys['w']) {
                    this.translation.z = 0;
                }
                break;
            case 65: // A
                this.pressedKeys['a'] = false;
                if (!this.pressedKeys['d']) {
                    this.translation.x = 0;
                }
                break;
            case 68: // D
                this.pressedKeys['d'] = false;
                if (!this.pressedKeys['a']) {
                    this.translation.x = 0;
                }
                break;
        }
        if (!this.isWASD()) {
            this.animation.run = null;
            this.animation.walk = null;
            this.animateIdle(this);
        }
    }
};
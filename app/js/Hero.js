Hero = function(scene) {
    this.scene = scene;
    this.canvas = this.scene.getEngine().getRenderingCanvas();
    this.mesh = null;
    this.skeleton = null;
    this.body = null;
    this.weapon = null;
    this.crown = null;

    this.defaultVelocity = 8;
    this.translation = {
        'x': 0,
        'z': 0,
        'jump': 0
    };

    this.hitPoints = 100;
    this.isDead = false;
    this.bloodEmitMesh = null;
    this.particleSystem = null;

    this.attackRangeMesh = null;
    this.animation = {
        'walk': null,
        'run': null,
        'weaponRun': null, // animation of weapon while running
        'attack': null,
        'weaponAttack': null
    };
    this.attackList = [this.animateSword1, this.animateSword2, this.animateSword3];

    this.activeLeverMesh = null;

    this.enemiesNearby = {};

    this.camera = null;

    this.light = null;
    this.shadowGenerator = null;

    this.pressedKeys = {
        'w': false, 'a': false, 's': false, 'd': false
    };

    var _this = this;

    this._init(); // import mesh

    /* Handle actions */
    this.scene.registerBeforeRender(beforeRender);
    this.scene.registerAfterRender(afterRender);


    function beforeRender() {
        if (_this.isWASD()) {
            _this.rotateCamera();
        }

        if (_this.translation.x || _this.translation.z) {
            var rot = new BABYLON.Matrix();
            _this.mesh.rotationQuaternion.toRotationMatrix(rot);
            var translation = new BABYLON.Vector3(_this.translation.x, 0, _this.translation.z);
            translation = BABYLON.Vector3.TransformCoordinates(translation, rot);
            translation.y = _this.translation.jump ? _this.translation.jump : -10;
            _this.translation.jump = 0;
            _this.mesh.getPhysicsImpostor().setLinearVelocity(translation);
        }

        if (!_this.animation.run && _this.animation.weaponRun && _this.animation.weaponRun.animationStarted) {
            _this.stopWeaponAnimation();
        }
    }

    function afterRender() {
        if (_this.camera) {
            var dir = _this.scene.getMeshByName('herobox').getAbsolutePosition().subtract(_this.camera.position).normalize();
            var ray = new BABYLON.Ray(_this.camera.position, dir);
            var pick = _this.scene.pickWithRay(ray, null, false);

            if (pick && pick.pickedMesh && pick.distance > 1.0 && pick.pickedMesh.name !== 'herobox') {
                //_this.camera.inertialRadiusOffset += pick.distance;
                _this.camera.radius -= pick.distance;
            }
        }
    }
};

Hero.prototype = {
    _init: function() {
        var _this = this;
        /* Import character model */
        BABYLON.SceneLoader.ImportMesh('', 'assets/characters/hero/', 'km14.babylon', this.scene, function(meshes, particleSystems, skeletons) {
            _this.mesh = meshes[0];
            _this.mesh.name = 'hero';

            _this.skeleton = skeletons[0];

            _this.mesh.getHero = function() {
                return _this;
            };

            _this.mesh.scaling.x *= 0.12;
            _this.mesh.scaling.z *= 0.12;
            _this.mesh.scaling.y *= 0.12;

            _this.mesh.position.y += 2;

            _this._initBoundingMesh();
            _this._initCamera();
            _this._initLight();
            _this._initSword();
            _this._initCrown();

            /* init hp display */
            document.getElementById('hitpoints').innerHTML = '' + _this.hitPoints;

            _this.animateIdle(_this);

            _this.scene.executeWhenReady(function() {
                /* physics */
                _this.body = _this.mesh.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:80, restitution: 0, friction: 0});
                _this.body.linearDamping = 0.99;
                _this.mesh.registerAfterWorldMatrixUpdate(function() {
                    _this.mesh.rotationQuaternion.x = 0;
                    _this.mesh.rotationQuaternion.z = 0;
                });

                _this._initShadows();

                _this.createFrontCollider();
                _this._initBloodEmit();

                _this.initListeners();
            });

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

    _initBoundingMesh: function() {
        var maxBounds = this.mesh.getBoundingInfo().maximum;
        var minBounds = this.mesh.getBoundingInfo().minimum;
        var factor = 1.0;

        var heroBoundMesh = BABYLON.MeshBuilder.CreateBox('herobox', {
            height: maxBounds.y - minBounds.y + factor,
            width: maxBounds.x - minBounds.x + factor,
            depth: maxBounds.z - minBounds.z + factor
        }, this.scene);

        heroBoundMesh.position.y += (maxBounds.y - minBounds.y + factor) / 2;

        heroBoundMesh.material = new BABYLON.StandardMaterial('bmmat', this.scene);
        heroBoundMesh.material.alpha = 0;

        heroBoundMesh.parent = this.mesh;
    },

    _initCamera: function() {
        var followMesh = BABYLON.MeshBuilder.CreateBox("s", {height: 1, width: 1, depth: 1}, this.scene);
        followMesh.position.y += 15;
        followMesh.isVisible = false;
        followMesh.parent = this.mesh;

        this.camera = new BABYLON.ArcRotateCamera('herocam', Math.PI / 2, Math.PI / 3, 10, followMesh, this.scene);

        this.camera.lowerRadiusLimit = 2;
        this.camera.upperRadiusLimit = 12;
        this.camera.lowerBetaLimit = Math.PI / 4;
        this.camera.upperBetaLimit = Math.PI / 2 + Math.PI / 25;

        this.camera.wheelPrecision = 10.0;

        this.camera.attachControl(this.canvas);

        this.scene.activeCamera = this.camera;
        //this.scene.getEngine().isPointerLock = true;
    },

    _initLight: function() {
        this.light = new BABYLON.SpotLight('herolight',
            new BABYLON.Vector3(3, 22, -3),
            new BABYLON.Vector3(0, -1, 0),
            Math.PI *  150 / 100, 2, this.scene
        );

        //var s = BABYLON.MeshBuilder.CreateSphere('s', {diameter: 1}, this.scene);
        //s.material = new BABYLON.StandardMaterial('s', this.scene);
        //s.material.emissiveColor = new BABYLON.Color3.Yellow();
        //s.parent = this.light;

        this.light.diffuse = new BABYLON.Color3(1.0, 0.549, 0.0);
        this.light.specular = new BABYLON.Color3.Black();
        this.light.parent = this.mesh;
        this.light.intensity = 0.8;
    },

    _initShadows: function() {
        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, this.light);
        SHADOWS.heroSG = this.shadowGenerator;

        this.shadowGenerator.bias = 0.01;
        this.shadowGenerator.usePoissonSampling = true;

        this.shadowGenerator.getShadowMap().renderList.push(this.mesh);
        this.mesh.isHeroSG = true;

        this.shadowGenerator.getShadowMap().renderList.push(this.weapon.mesh);
        this.weapon.mesh.isHeroSG = true;

        this.shadowGenerator.getShadowMap().renderList.push(this.crown);
        this.crown.isHeroSG = true;

        this.scene.meshes.forEach(function(mesh) {
            if (mesh.isVisible && !mesh.isHeroSG && mesh.physicsImpostor) {
                SHADOWS.heroSG.getShadowMap().renderList.push(mesh);
                mesh.isHeroSG = true;
            }
        });
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

    _initCrown: function() {
        var _this = this;
        BABYLON.SceneLoader.ImportMesh('', 'assets/characters/hero/', 'crown.babylon', this.scene, function(meshes) {
            _this.crown = meshes[0];
            _this.crown.scaling.x *= 6.8;
            _this.crown.scaling.y *= 7.8;
            _this.crown.scaling.z *= 8.6;
            _this.crown.rotation.x += Math.PI - Math.PI * 7 / 100;
            _this.crown.position.y += 0.6;
            _this.crown.position.z += 0.06;

            var bones = _this.skeleton.bones;
            for (var i = 0; i < bones.length; i++) {
                if (bones[i].id === 'Head') {
                    _this.crown.attachToBone(bones[i], _this.mesh);
                }
            }
        });
    },

    initListeners: function() {
        var _this = this;

        this.canvas.oncontextmenu = function(evt) {
            evt.preventDefault();
        };

        this.canvas.onmousedown = function(evt) {
            _this.handleMousedown(evt);
        };

        document.onkeydown = function(evt) {
            _this.handleKeydown(evt);
        };

        document.onkeyup = function(evt) {
            _this.handleKeyup(evt);
        };
    },

    removeListeners: function() {
        this.canvas.oncontextmenu = null;
        this.canvas.onmousedown = null;
        document.onkeydown = null;
        document.onkeyup = null;
    },

    _initBloodEmit: function() {
        this.bloodEmitMesh = BABYLON.MeshBuilder.CreateBox("s", {height: 1, width: 1, depth: 1}, this.scene);
        this.bloodEmitMesh.position.y  += 12;
        this.bloodEmitMesh.position.z -= 1.5;
        this.bloodEmitMesh.rotation.z += Math.PI / 4;
        this.bloodEmitMesh.isVisible = false;
        this.bloodEmitMesh.parent = this.mesh;

        this.particleSystem = new BABYLON.ParticleSystem('pBlood', 2000, scene);

        this.particleSystem.particleTexture = new BABYLON.Texture('assets/textures/blood.jpg', scene);
        this.particleSystem.emitter = this.bloodEmitMesh;

        this.particleSystem.minSize = 0.05;
        this.particleSystem.maxSize = 0.1;

        this.particleSystem.emitRate = 500;

        this.particleSystem.direction1 = new BABYLON.Vector3(5, 0, 5);

        this.particleSystem.minEmitBox = new BABYLON.Vector3(-1.5, 0, 0);
        this.particleSystem.maxEmitBox = new BABYLON.Vector3(1.5, 0, 0);

        this.particleSystem.minLifeTime = 0.15;
        this.particleSystem.maxLifeTime = 0.15;

        this.particleSystem.minEmitPower = 5;
        this.particleSystem.maxEmitPower = 10;
    },

    handlePick: function() {
        var pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        //console.log(pick.pickedMesh);
        if (pick.pickedMesh && pick.pickedMesh.hasOwnProperty('triggerOnPick')) {
            this.activeLeverMesh = pick.pickedMesh;
            pick.pickedMesh.triggerOnPick(this.mesh);
        }
    },

    emitBlood: function() {

        this.particleSystem.start();

        /* pushback */
        this.translation.z = 3;

        var _this = this;
        setTimeout(function() {
            _this.translation.z = 0;
        }, 100);
        setTimeout(function() {
            _this.particleSystem.stop();
        }, 400);
    },

    onHit: function() {
        var _this = this;

        _this.emitBlood();
        _this.hitPoints--;

        document.getElementById('hitpoints').innerHTML = '' + _this.hitPoints;

        if (_this.hitPoints < 1) {
            _this.isDead = true;
            _this.onDead();
        }
    },

    onDead: function() {
        this.removeListeners();
        this.scene.getEngine().stopRenderLoop();
        MENU.died();
    },

    createFrontCollider: function() {
        this.attackRangeMesh = BABYLON.MeshBuilder.CreateBox("s", {height: 16, width: 17, depth: 15}, this.scene);
        this.attackRangeMesh.position.y += 8;
        this.attackRangeMesh.position.z -= 9;
        this.attackRangeMesh.position.x -= 3;
        this.attackRangeMesh.parent = this.mesh;
        this.attackRangeMesh.isVisible = false;
    },

    handleAttack: function() {
        var _this = this;

        for (var key in _this.enemiesNearby) {
            if (_this.enemiesNearby.hasOwnProperty(key)) {
                if (_this.enemiesNearby[key].mesh.intersectsMesh(_this.attackRangeMesh, false)) {
                    _this.enemiesNearby[key].onHit();
                }
            }
        }
    },

    appendEnemy: function(entity) {
        this.enemiesNearby[entity.mesh.name] = entity;
    },

    removeEnemy: function(name) {
        delete this.enemiesNearby[name];
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
            _this.animation.weaponAttack.getAnimations()[0].addEvent(new BABYLON.AnimationEvent(5, function() { _this.handleAttack(); }, true));
        }
    },

    animateSword2: function(_this) {
        if (_this.animation.attack) {
            return;
        }

        _this.stopWeaponAnimation();

        _this.animation.attack = _this.scene.beginAnimation(_this.skeleton, 325, 365, false, 2.5, function() {
            _this.animation.attack = null;
            if (_this.isWASD()) {
                _this.animateRun(_this, true);
            } else {
                _this.animateIdle(_this);
            }
        });

        if (_this.animation.attack) {
            _this.animation.weaponAttack = _this.scene.beginDirectAnimation(_this.weapon.mesh, [_this.weapon.animation.attack2], 0, 40, false, 2.5, function () {
                _this.animation.weaponAttack = null;
            });
            _this.animation.weaponAttack.getAnimations()[0].addEvent(new BABYLON.AnimationEvent(15, function() { _this.handleAttack(); }, true));
        }
    },

    animateSword3: function(_this) {
        if (_this.animation.attack) {
            return;
        }

        _this.stopWeaponAnimation();

        _this.animation.attack = _this.scene.beginAnimation(_this.skeleton, 630, 665, false, 2.5, function() {
            _this.animation.attack = null;
            if (_this.isWASD()) {
                _this.animateRun(_this, true);
            } else {
                _this.animateIdle(_this);
            }
        });

        if (_this.animation.attack) {
            _this.animation.weaponAttack = _this.scene.beginDirectAnimation(_this.weapon.mesh, [_this.weapon.animation.attack2], 0, 35, false, 2.5, function () {
                _this.animation.weaponAttack = null;
            });
            _this.animation.weaponAttack.getAnimations()[0].addEvent(new BABYLON.AnimationEvent(15, function() { _this.handleAttack(); }, true));
        }
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
            this.attackList[Math.floor(Math.random() * this.attackList.length)](this);
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
            case 32: // Space
                this.translation.jump = 80;
                break;
            case 69: // E
                this.handlePick();
                break;
            case 27: // esc
                this.removeListeners();
                this.scene.getEngine().stopRenderLoop();
                MENU.pause();
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
            case 69: // E
                if (this.activeLeverMesh) this.activeLeverMesh.triggerOnStop();
                break;
        }
        if (!this.isWASD()) {
            this.animation.run = null;
            this.animation.walk = null;
            this.animateIdle(this);
        }
    }
};

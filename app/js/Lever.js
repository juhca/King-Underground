/* Lever for triggering doors */
Lever = function(position, rotation, scene, onEnd) {
    this.scene = scene;
    this.mesh = {
        base: null,
        stick: null,
        aoeSphere: null
    };
    this.onEnd = onEnd; /* callback */

    this.aoeDiameter = 8;

    this.activeAnimation = null;
    this.isAnimationFinished = false;

    this.animation = null;
    this.reverseAnimation = null;

    /* create mesh and apply material */
    this._initMesh(position, rotation);

    this._initAnimations();
    this._initActions();

};

Lever.prototype = {
    _initMesh: function(position, rotation) {
        this.mesh.base = BABYLON.MeshBuilder.CreateBox('leverButton', {height: 1.2/*0.6*/, width: 0.8/*0.4*/, depth: 0.4/*0.2*/}, this.scene);
        this.mesh.base.position = position;
        this.mesh.base.rotation = rotation;
        var lmat = createMaterial(this.scene, 'assets/textures/lever.png', 'leverMat', 1.0, 1.0, new BABYLON.Color3.Black());
        this.mesh.base.material = lmat;

        this.mesh.base.renderOutline = false;
        this.mesh.base.outlineColor = BABYLON.Color3.FromHexString('#6BCAE2');

        this.mesh.stick = BABYLON.MeshBuilder.CreateBox('leverStick', {height: 2, width: 0.3, depth: 0.3}, this.scene);
        var stickMat = createMaterial(this.scene, 'assets/textures/iron.png', 'leverMat', 1.0, 1.0, new BABYLON.Color3.Black());
        this.mesh.stick.material = stickMat;
        this.mesh.stick.rotation.x = -Math.PI/4;
        this.mesh.stick.parent = this.mesh.base;

        this.mesh.aoeSphere = new BABYLON.MeshBuilder.CreateSphere('leverSphere', {diameter: this.aoeDiameter}, this.scene);
        this.mesh.aoeSphere.position = position;
        this.mesh.aoeSphere.isVisible = false;

        var _this = this;

        var triggerPick = function(hero) {
            if (!_this.activeAnimation && hero.intersectsMesh(_this.mesh.aoeSphere, false)) {

                var begin = _this.reverseAnimation.currentFrame ? 50 - Math.floor(_this.reverseAnimation.currentFrame) : 0;

                _this.activeAnimation = _this.scene.beginDirectAnimation(_this.mesh.stick, [_this.animation], begin, 50, false, 1.0, function() {
                    _this.isAnimationFinished = true;
                });
            }
        };

        var triggerStop = function() {
            _this.onAnimationCancel();
        };

        this.mesh.base.triggerOnPick = triggerPick;
        this.mesh.stick.triggerOnPick = triggerPick;
        this.mesh.base.triggerOnStop = triggerStop;
        this.mesh.stick.triggerOnStop = triggerStop;
    },

    _initAnimations: function() {
        this.animation = new BABYLON.Animation(
            'lAnim', 'rotation.x', 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        this.animation.setKeys([
            {frame: 0, value: -Math.PI / 4 },
            {frame: 25, value: -Math.PI / 2 },
            {frame: 50, value: -Math.PI * 3 / 4 }
        ]);

        var _this = this;
        this.animation.addEvent(new BABYLON.AnimationEvent(50, function() {
            if (_this.onEnd) {
                _this.onEnd();
            }
        }, true));

        this.reverseAnimation = new BABYLON.Animation(
            'lRAnim', 'rotation.x', 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        this.reverseAnimation.setKeys([
            {frame: 0, value: -Math.PI * 3 / 4 },
            {frame: 25, value: -Math.PI / 2 },
            {frame: 50, value: -Math.PI / 4 }
        ]);

    },

    _initActions: function() {
        var _this = this;
        this.mesh.base.actionManager = new BABYLON.ActionManager(_this.scene);
        this.mesh.base.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            function() {
                _this.mesh.base.renderOutline = true;
            }
        ));
        this.mesh.base.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            function() {
                _this.mesh.base.renderOutline = false;
                _this.onAnimationCancel();
            }
        ));
    },

    onAnimationCancel: function() {
        if (this.activeAnimation && !this.isAnimationFinished) {
            var begin = 50 - Math.floor(this.animation.currentFrame);
            if (begin !== 50) {
                this.scene.beginDirectAnimation(this.mesh.stick, [this.reverseAnimation], begin, 50, false, 1.0);
            }
            this.activeAnimation.reset();
            this.activeAnimation.stop();
            this.activeAnimation = null;
            this.isAnimationFinished = false;
        }
    }
};
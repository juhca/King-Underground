LastChamber = function (scene) {
    this.scene = scene;

    this.levers = {
        a: null, b: null, c: null, d: null
    };
};

LastChamber.prototype.create = function () {
    var _this = this;

    tla_stene();
    levers();
    hodnik();
    ending();

    function tla_stene() {
        // kreiraj material za tla
        var groundMaterial = createMaterial(this.scene, 'assets/textures/dirt01.jpg', 'tla', 8.0, 16.0, new BABYLON.Color3.Black());
        var ground = createBox(this.scene, groundMaterial, 100, 1, 100, 'ground');
        ground = properties(ground, -328.0, 44.35, 150, 0, 0, 0, 1, 1, 1);

        var wallMaterial = createMaterial(this.scene, 'assets/textures/mossy_rock.jpg', 'stena', 4.0, 8.0, new BABYLON.Color3.Black());
        var groundWall1 = createWall(this.scene, wallMaterial, 20, 1, 100, 10, 'groundWall1');
        groundWall1 = properties(groundWall1, -331.0, 44.35, 200.5, 0, (Math.PI/2), 0, 1, 1, 1);

        var groundWall2 = clone_and_properties(groundWall1, 'groundWall2', 0, 0, -100, 0, 0, 0, 1, 1, 1);
            // vhod
        var groundWall31 = createWall(this.scene, wallMaterial, 20, 1, 65, 10, 'groundWall31');
        groundWall31 = properties(groundWall31, -291.0, 44.35, 178.2, 0, 0, 0, 1, 1, 1);
        var groundWall32 = clone_and_properties(groundWall31, 'groundWall32', 0, 0, -52.5, 0, 0, 0, 1, 1, 1.1);
            // izhod
        var groundWall41 = clone_and_properties(groundWall31, 'groundWall41', -80, 0, 3, 0, 0, 0, 1, 1, 1.0);
        var groundWall42 = clone_and_properties(groundWall32, 'groundWall42', -80, 0, -2, 0, 0, 0, 1, 1, 1.05);
            // strop
        var strop = clone_and_properties(ground, 'strop', 0, 9.35, 0, 0, 0, 0, 1, 1, 1);
            // vrata
        var doorMaterial = createMaterial(this.scene, 'assets/textures/rockDoors.jpg', 'doorMaterial', 1.0, 1.0, new BABYLON.Color3.Black());
        var izhod = createBox(this.scene, doorMaterial, 11.5, 9, 1, 'doorLastChamber');
        izhod = properties(izhod, -371.1, 49.0, 153.1, 0, 0, 0, 1, 1, 1);

/*
        var nevidnMesh12 = createBox(this.scene, "", 2, 2, 2, 'nevidnMesh1');
        nevidnMesh12.position.y += -1;
        nevidnMesh12.position.z += 150 ;
        nevidnMesh12.position.x -= 250;
        nevidnMesh12.isVisible = false;
*/
        //partikliDaljsi("partikel", 500, 'assets/textures/fire.jpg', nevidnMesh12);
        //var lucka = lucke("baklaLucka2R", new BABYLON.Vector3(-250, 5, 150), new BABYLON.Vector3(0, -1, 0), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
    }

    function levers() {
        /* door animation */
        var target = this.scene.getMeshByName('doorLastChamber');
        var height = target.getBoundingInfo().boundingBox.maximum.y - target.getBoundingInfo().boundingBox.minimum.y;

        var tAnim = new BABYLON.Animation(
            'ltAnim', 'position.y', 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        tAnim.setKeys([
            {frame: 0, value: target.position.y },
            {frame: 25, value: target.position.y - height / 2 },
            {frame: 50, value: target.position.y - height + 0.4 }
        ]);

        _this.levers.a = new Lever(
            new BABYLON.Vector3(-370.5, 47, 160), new BABYLON.Vector3(0, - Math.PI / 2, 0), this.scene, function() {
                _this.levers.a.isOn = true;
                handleLevers();
            }
        );
        _this.levers.b = new Lever(
            new BABYLON.Vector3(-370.5, 47, 146.2), new BABYLON.Vector3(0, - Math.PI / 2, 0), this.scene, function() {
                _this.levers.b.isOn = true;
                handleLevers();
            }
        );
        _this.levers.c = new Lever(
            new BABYLON.Vector3(-330, 47, 101), new BABYLON.Vector3(0, Math.PI, 0), this.scene, function() {
                _this.levers.c.isOn = true;
                handleLevers();
            }
        );
        _this.levers.d = new Lever(
            new BABYLON.Vector3(-330, 47, 200), new BABYLON.Vector3(0, 0, 0), this.scene, function() {
                _this.levers.d.isOn = true;
                handleLevers();
            }
        );


        function handleLevers() {
            if (_this.levers.a.isOn && _this.levers.b.isOn && _this.levers.c.isOn && _this.levers.d.isOn) {
                _this.scene.beginDirectAnimation(target, [tAnim], 0, 50, false, 1.0);
            }
        }
    }
    
    function hodnik() {
        // tla
        var groundMaterial = createMaterial(this.scene, 'assets/textures/dirt01.jpg', 'tla', 7.0, 1.0, new BABYLON.Color3.Black());
        var ground = createBox(this.scene, groundMaterial, 100, 1, 12, 'ground');
        ground = properties(ground, -428.0, 44.35, 153, 0, (Math.PI/2), 0, 1, 1, 1);
        // stene
        var wallMaterial = createMaterial(this.scene, 'assets/textures/roof.jpg', 'stena', 1.0, 2.0, new BABYLON.Color3.Black());
        var groundWall1 = createWall(this.scene, wallMaterial, 20, 1, 150, 10, 'groundWall1');
        groundWall1 = properties(groundWall1, -436.0, 44.35, 159.5, 0, (Math.PI/2), 0, 1, 1, 1);
        var groundwall2 = clone_and_properties(groundWall1, 'groundwall2', 0, 0, -12.5, 0, 0, 0, 1, 1, 1);
        // strop
        var strop = clone_and_properties(ground, 'strop', 0, 9.35, 0, 0, 0, 0, 1, 1, 1);
        // box
        var boxMat =  createMaterial(this.scene, 'assets/textures/LastBoxTexture.png', 'stena', 1.5, 1.0, new BABYLON.Color3.Black());
        var box = createBox(this.scene, boxMat, 20, 20, 2, 'videoBox');
        box = properties(box, -470, 50.35, 151.5, 0, 0, 0, 1, 1, 1);
    }

    function ending() {
        var end = BABYLON.MeshBuilder.CreateBox('end', {height: 10, width: 50, depth: 12}, this.scene);
        end.position = new BABYLON.Vector3(-430, 49.0, 153);
        end.isVisible = false;

        var _this = this;
        this.scene.executeWhenReady(function() {
            var target = _this.scene.getMeshByName('hero');
            end.actionManager = new BABYLON.ActionManager(_this.scene);
            end.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: target
            }, function() {
                target.getHero().removeListeners();
                _this.scene.getEngine().stopRenderLoop();
                MENU.survived();
                //setTimeout(function() {
                //    var engine = _this.scene.getEngine();
                //
                //    target.getHero().removeListeners();
                //    _this.scene.dispose();
                //    engine.dispose();
                //}, 1000)
            }));
        });
    }
};

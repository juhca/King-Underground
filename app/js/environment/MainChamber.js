/**
 * Created by tomas on 24. 11. 2016.
 */
MainChamber = function (scene) {
    this.scene = scene;
};

MainChamber.prototype.create = function () {
    var roomLength = 50;
    var wallHeight = 5;
    var wallWidth = 1;
        // edge of regular triangle at edges of octagon
    var octagonE = 10;
        // ustvarim material za tla
    var groundMaterial = createMaterial(this.scene, './assets/textures/floor.jpg', 'ground', 20, 20.0, new BABYLON.Color3.Black());
    groundMaterial.maxsimultaneousLights = 6;
    // ustvarim tla
    var ground = createBox(this.scene, groundMaterial, roomLength, 1, roomLength, 'ground');
    ground = properties(ground, 0, 0, 0, 0, 0, 0, 1, 0.01, 1);

    glavna_sobana_zid(roomLength, wallHeight, wallWidth, octagonE);
    glavna_sobana_kupola(roomLength, wallHeight, wallWidth);

    // podatki za stopnice
    var stepHeight = 0.1;
    var stepSize = roomLength / 3;
    var stepNum = 7;

    glavna_sobana_platforma(stepHeight, stepSize, stepNum);
    glavna_sobana_stebri(wallHeight, stepHeight, stepSize, stepNum);


    // podatki za mizo
    var tableDiameter = (stepSize - 4 * stepNum * stepHeight) * (3 / 5);
    var tableHeight = 1;
    glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight);
    glavna_sobana_obok(groundMaterial, roomLength);
    postavi_bakle(roomLength, ground);

    vrata();
    lever();



    /**
     * GLAVNA SOBANA
     * **/
    function glavna_sobana_zid(roomLength, wallHeight, wallWidth, octagonE) {
        var wallMaterial = createMaterial(this.scene, './assets/textures/wall.jpg', 'wall', 1.5, 4.0, new BABYLON.Color3.Black());

        var wall = createWall(this.scene, wallMaterial, wallHeight, wallWidth, roomLength, octagonE, 'wall1');
        wall = properties(wall, roomLength / 2 - wallWidth / 2, wallHeight / 2, 0, 0, 0, 0, 1, 1, 1);

        var tab = [['wall2', -(roomLength - wallWidth), 0, -20.5, 0, 0, 0, 1, 1, 1], ['wall3', -(roomLength - wallWidth), 0, 15.5, 0, 0, 0, 1, 1, 1], ['wall4', -(roomLength / 2 - wallWidth / 2), 0, (roomLength / 2 - wallWidth / 2), 0, (Math.PI / 2), 0, 1, 1, 1], ['wall5', -(roomLength / 2 - wallWidth / 2), 0, -(roomLength / 2 - wallWidth / 2), 0, (Math.PI / 2), 0, 1, 1, 1], ['wall6', -(octagonE / 2), 0, (roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, -(Math.PI / 4), 0, 1, 1, 1], ['wall7', -(roomLength - octagonE / 2 - wallWidth), 0, (roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, (Math.PI / 4), 0, 1, 1, 1], ['wall8', -(roomLength - octagonE / 2 - wallWidth), 0, -(roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, -(Math.PI / 4), 0, 1, 1, 1],  ['wall9', -(octagonE / 2), 0, -(roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, +(Math.PI / 4), 0, 1, 1, 1]];

        for(var i = 0; i < tab.length; i++)
        {
            var wall2 = clone_and_properties(wall, tab[i][0], tab[i][1], tab[i][2], tab[i][3], tab[i][4], tab[i][5], tab[i][6], tab[i][7], tab[i][8], tab[i][9]);
        }
    }

    function glavna_sobana_kupola(roomLength, wallHeight, wallWidth) {
        var ceilMaterial = createMaterial(this.scene, './assets/textures/roof.jpg', 'ground', 1.0, 1.0, new BABYLON.Color3.Black());
        var sphereDiameter = roomLength - 2 * wallWidth;

        var ceilSphere = createSphere(this.scene, ceilMaterial, sphereDiameter, wallHeight, 'ceilSphere', 0.5, BABYLON.Mesh.DOUBLESIDE);
        ceilSphere.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});

        var ceilPlane = createBox(this.scene, ceilMaterial, roomLength, 2, roomLength, 'ceilPlane');
        ceilPlane = properties(ceilPlane, 0, (wallHeight + 1), 0, 0, 0, 0, 1, 1, 1);

        var csCSG = BABYLON.CSG.FromMesh(ceilSphere);
        var cpCSG = BABYLON.CSG.FromMesh(ceilPlane);
        var ceilSubplane = (cpCSG.subtract(csCSG)).toMesh('ceilSubplane', ceilMaterial, this.scene, false);
        ceilSubplane.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
        ceilPlane.dispose();
    }

    function glavna_sobana_platforma(stepHeight, stepSize, stepNum) {
        var platformMaterial = createMaterial(this.scene, "./assets/textures/floor1.jpg", 'platform', 3.0, 3.0, new BABYLON.Color3.Black());
        var platform = false;

        for (var i = 0; i < stepNum; i++) {
            var step = createBox(this.scene, platformMaterial, (stepSize - 4 * i * stepHeight), stepHeight, (stepSize - 4 * i * stepHeight), 'step' + i);
            step.position.y += i * stepHeight + stepHeight / 2;
            step.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
        }
    }

    function glavna_sobana_stebri(wallHeight, stepHeight, stepSize, stepNum) {
        var pillarDiameter = 1.5;
        var pillarHeight = 1.2*wallHeight - stepNum * stepHeight + 22;
        var pillarLocation = ((stepSize - 4 * stepNum * stepHeight) / 2) * 7 / 8;

        var pillarMaterial = createMaterial(this.scene, "./assets/textures/pillar.jpg", 'pillar', 1.5, 4.0, new BABYLON.Color3.Black());
        var pillar = createCylinder(this.scene, pillarMaterial, pillarHeight, pillarDiameter, pillarDiameter, 'pillar1');
        pillar = properties(pillar, pillarLocation, (pillarHeight / 2 + stepNum * stepHeight), pillarLocation, 0, 0, 0, 1, 1, 1);

        var tab = [['pillar2', -(2 * pillarLocation), 0, 0, 0, 0, 0, 1, 1, 1], ['pillar3', -(2 * pillarLocation), 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1], ['pillar4', 0, 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1]];
        for(var i = 0; i < tab.length; i++)
        {
            var pillar2 = clone_and_properties(pillar, tab[i][0], tab[i][1], tab[i][2], tab[i][3], tab[i][4], tab[i][5], tab[i][6], tab[i][7], tab[i][8], tab[i][9]);
        }
    }

    function glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight) {
        var tableMaterial = createMaterial(this.scene, "./assets/textures/tableTop.jpg", 'table', 3.0, 3.0, new BABYLON.Color3.Black());

        var tableBot = createCylinder(this.scene, tableMaterial, (tableHeight * (2 / 3)), (tableDiameter * (1 / 3)), (tableDiameter * (2 / 3)), 'tableBot');
        tableBot.position.y += (tableHeight * (2 / 3)) / 2 + stepNum * stepHeight;

        var tableTop = createCylinder(this.scene, tableMaterial, (tableHeight * (1/3)), (tableDiameter), (tableDiameter * (1 / 3)), 'tableTop');
        tableTop.position.y = tableBot.position.y + tableHeight * (1 / 3);
    }

    function glavna_sobana_obok(groundMaterial, roomLength) {
        var groundMaterial = createMaterial(this.scene, './assets/textures/floor - Copy.jpg', 'ground', 1, 1, new BABYLON.Color3.Black());
        var obok = createBox(this.scene, groundMaterial, 1.1, 80, 1.1, 'obok');
        obok = properties(obok, -(roomLength/2 - 0.55), 0.4, -0.05, 0, 0, 0, 1, 0.01, 1);

        // leva stran oboka
        var obok2l = clone_and_properties(obok, 'obok2l', 0, 0, -4.9, 0, 0, 0, 1, 0.01, 1);
        var obok3l = clone_and_properties(obok2l, 'obok3l', 0, 1.5, 0, 0, 0, 0, 1, 0.01, 1);
        var obok4l = clone_and_properties(obok2l, 'obok4l', 0, 3.0, 0, 0, 0, 0, 1, 0.01, 1);
        var obok5l = clone_and_properties(obok2l, 'obok5l', 0, 4.5, 0, 0, 0, 0, 1, 0.01, 1);

        // desna stran oboka
        var obok3d = clone_and_properties(obok3l, 'obok3d', 0, 0, 4.9, 0, 0, 0, 1, 0.01, 1);
        var obok4d = clone_and_properties(obok4l, 'obok4d', 0, 0, 4.9, 0, 0, 0, 1, 0.01, 1);
        var obok5d = clone_and_properties(obok5l, 'obok5d', 0, 0, 4.9, 0, 0, 0, 1, 0.01, 1);
    }

    function postavi_bakle(roomLength, ground) {
        var bakla;
        BABYLON.SceneLoader.ImportMesh('', 'assets/other/Torch/','Torch.babylon', this.scene, function (newMeshes) {
                // prva bakla
            bakla = newMeshes[0];
            var baklaMaterial = createMaterial(this.scene, 'assets/other/Torch/VRayMtl1SG_Base_Color copy.jpg', 'baklaMaterial', 1.0, 1.0, new BABYLON.Color3(0, 0, 0));
            bakla.material = baklaMaterial;

            bakla = properties(bakla, (roomLength/2 - 1.46), 3.9, 0, 0, 0, 0, 0.2, 0.2, 0.2);
            var nevidnMesh1 = createBox(this.scene, "", 2, 2, 2, 'nevidnMesh1');
            nevidnMesh1.position.y += 4;
            nevidnMesh1.position.z += 4;
            nevidnMesh1.position.x -= 2;
            nevidnMesh1.isVisible = false;
            nevidnMesh1.parent = bakla;
            partikli("partikel bakla1", 300, 'assets/textures/fire.jpg', nevidnMesh1);
            var bakla2 = clone_and_properties(bakla, 'bakla2', -(roomLength/2 - 2.45), 0, (roomLength/2 - 1.44), 0, 0, -(Math.PI/2), 0.2, 0.2, 0.2);
            var bakla3 = clone_and_properties(bakla, 'bakla3', -(roomLength/2 - 2.45), 0, -(roomLength/2 - 1.44), 0, 0, (Math.PI/2), 0.2, 0.2, 0.2);

            //var baklaLucka2G = lucke("baklaLucka2G", new BABYLON.Vector3(bakla2.position.x, bakla2.position.y, bakla2.position.z), new BABYLON.Vector3(0.25, 1, 1), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
            var baklaLucka2R = lucke("baklaLucka2R", new BABYLON.Vector3(bakla2.position.x, bakla2.position.y, bakla2.position.z), new BABYLON.Vector3(0.25, -1, -1), 10, 10, 1.5, new BABYLON.Color3(1.0, 0.549, 0.0), new BABYLON.Color3(1,1,1));

            //var baklaLucka1G = lucke("baklaLucka1G", new BABYLON.Vector3(bakla.position.x, bakla.position.y, bakla.position.z), new BABYLON.Vector3(0.25, 1, 0), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
            var baklaLucka1D = lucke("baklaLucka1D", new BABYLON.Vector3(bakla.position.x, bakla.position.y, bakla.position.z), new BABYLON.Vector3(-1,-1,0), 10, 10, 1.5, new BABYLON.Color3(1.0, 0.549, 0.0), new BABYLON.Color3(1,1,1));

            //var baklaLucka3G = lucke("baklaLucka3G", new BABYLON.Vector3(bakla3.position.x, bakla3.position.y, bakla3.position.z), new BABYLON.Vector3(0, 0.25, 0), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
            var baklaLucka3R = lucke("baklaLucka3R", new BABYLON.Vector3(bakla3.position.x, bakla3.position.y, bakla3.position.z), new BABYLON.Vector3(-0.25, -1, 1), 10, 10, 1.5, new BABYLON.Color3(1.0, 0.549, 0.0), new BABYLON.Color3(1,1,1));

            var fireEffect = new BABYLON.Sound("FireEffect", "assets/sound-effects/fire.wav", this.scene, function () {
                console.log("ZDAJ SLEDIS");
            }, {loop: true, autoplay: true, volume: 0.1});
            fireEffect.attachToMesh(bakla);
            fireEffect.clone("drugiFireEffect").attachToMesh(bakla2);
            fireEffect.clone("tretjiFireEffect").attachToMesh(bakla3);

        });
    }

    function vrata() {
        var doorMaterial = createMaterial(this.scene, 'assets/textures/rockDoors.jpg', 'doorMaterial', 1.0, 0.5, new BABYLON.Color3.Black());
        var izhod = createBox(this.scene, doorMaterial, 4, 5, 1, 'doorMainChamber');
        izhod = properties(izhod, -25, 2.5, -2.5, 0, 0, 0, 1, 1, 1);
    }

    function lever() {
        /* door animation */
        var target = this.scene.getMeshByName('doorMainChamber');
        var height = target.getBoundingInfo().boundingBox.maximum.y - target.getBoundingInfo().boundingBox.minimum.y;

        var tAnim = new BABYLON.Animation(
            'ltAnim', 'position.y', 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        tAnim.setKeys([
            {frame: 0, value: target.position.y },
            {frame: 25, value: target.position.y - height / 4 },
            {frame: 50, value: target.position.y - height / 2},
            {frame: 55, value: target.position.y - height / 2},
            {frame: 100, value: target.position.y - height }
        ]);

        var _this = this;
        var mainChamberLever = new Lever(
            new BABYLON.Vector3(-24, 2, -6), new BABYLON.Vector3(0, - Math.PI / 2, 0), this.scene, function() {
                _this.scene.beginDirectAnimation(target, [tAnim], 0, 100, false, 1.0);
            }
        );
    }
};


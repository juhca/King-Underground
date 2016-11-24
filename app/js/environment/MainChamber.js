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
    var groundMaterial = createMaterial(scene, './assets/textures/floor.jpg', 'ground', 5.0, 5.0, new BABYLON.Color3.Black());
    groundMaterial.maxsimultaneousLights = 6;
    // ustvarim tla
    var ground = createBox(scene, groundMaterial, roomLength, 1, roomLength, 'ground');
    ground = properties(ground, 0, 0, 0, 0, 0, 0, 1, 0.01, 1);

    glavna_sobana_zid(roomLength, wallHeight, wallWidth, octagonE);
    glavna_sobana_kupola(roomLength, wallHeight, wallWidth);

    // podatki za stopnice
    var stepHeight = 0.2;
    var stepSize = roomLength / 3;
    var stepNum = 3;

    glavna_sobana_platforma(stepHeight, stepSize, stepNum);
    glavna_sobana_stebri(wallHeight, stepHeight, stepSize, stepNum);


    // podatki za mizo
    var tableDiameter = (stepSize - 4 * stepNum * stepHeight) * (3 / 5);
    var tableHeight = 1;
    glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight);
    glavna_sobana_obok(groundMaterial, roomLength);
    postavi_bakle(roomLength);
    /**
     * GLAVNA SOBANA
     * **/
    function glavna_sobana_zid(roomLength, wallHeight, wallWidth, octagonE) {
        var wallMaterial = createMaterial(scene, './assets/textures/wall.jpg', 'wall', 1.5, 4.0, new BABYLON.Color3.Black());

        var wall = createWall(scene, wallMaterial, wallHeight, wallWidth, roomLength, octagonE, 'wall1');
        wall = properties(wall, roomLength / 2 - wallWidth / 2, wallHeight / 2, 0, 0, 0, 0, 1, 1, 1);

        var tab = [['wall2', -(roomLength - wallWidth), 0, -20.5, 0, 0, 0, 1, 1, 1], ['wall3', -(roomLength - wallWidth), 0, 15.5, 0, 0, 0, 1, 1, 1], ['wall4', -(roomLength / 2 - wallWidth / 2), 0, (roomLength / 2 - wallWidth / 2), 0, (Math.PI / 2), 0, 1, 1, 1], ['wall5', -(roomLength / 2 - wallWidth / 2), 0, -(roomLength / 2 - wallWidth / 2), 0, (Math.PI / 2), 0, 1, 1, 1], ['wall6', -(octagonE / 2), 0, (roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, -(Math.PI / 4), 0, 1, 1, 1], ['wall7', -(roomLength - octagonE / 2 - wallWidth), 0, (roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, (Math.PI / 4), 0, 1, 1, 1], ['wall8', -(roomLength - octagonE / 2 - wallWidth), 0, -(roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, -(Math.PI / 4), 0, 1, 1, 1],  ['wall9', -(octagonE / 2), 0, -(roomLength / 2 - octagonE / 2 - wallWidth / 2), 0, +(Math.PI / 4), 0, 1, 1, 1]];

        for(var i = 0; i < tab.length; i++)
        {
            var wall2 = clone_and_properties(wall, tab[i][0], tab[i][1], tab[i][2], tab[i][3], tab[i][4], tab[i][5], tab[i][6], tab[i][7], tab[i][8], tab[i][9]);
        }
    }

    function glavna_sobana_kupola(roomLength, wallHeight, wallWidth) {
        var ceilMaterial = createMaterial(scene, './assets/textures/roof.jpg', 'ground', 1.0, 1.0, new BABYLON.Color3.Black());
        var sphereDiameter = roomLength - 2 * wallWidth;

        var ceilSphere = createSphere(scene, ceilMaterial, sphereDiameter, wallHeight, 'ceilSphere', 0.5, BABYLON.Mesh.BACKSIDE);

        var ceilPlane = createBox(scene, ceilMaterial, roomLength, 2, roomLength, 'ceilPlane');
        ceilPlane = properties(ceilPlane, 0, (wallHeight + 1), 0, 0, 0, 0, 1, 1, 1);

        var csCSG = BABYLON.CSG.FromMesh(ceilSphere);
        var cpCSG = BABYLON.CSG.FromMesh(ceilPlane);
        var ceilSubplane = (cpCSG.subtract(csCSG)).toMesh('ceilSubplane', ceilMaterial, scene, false);
        ceilPlane.dispose();
    }

    function glavna_sobana_platforma(stepHeight, stepSize, stepNum) {
        var platformMaterial = createMaterial(scene, "./assets/textures/floor1.jpg", 'platform', 3.0, 3.0, new BABYLON.Color3.Black());
        var platform = false;

        for (var i = 0; i < stepNum; i++) {
            var step = createBox(scene, platformMaterial, (stepSize - 4 * i * stepHeight), stepHeight, (stepSize - 4 * i * stepHeight), 'step' + i);
            step.position.y += i * stepHeight + stepHeight / 2;
            if (!platform) {
                platform = BABYLON.CSG.FromMesh(step);
            } else {
                platform = platform.union(BABYLON.CSG.FromMesh(step));
            }
            step.dispose();
        }

        if (platform) {
            platform = platform.toMesh('platform', platformMaterial, scene, false);
            platform.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
        } else {
            console.error('platform not initiated');
        }
    }

    function glavna_sobana_stebri(wallHeight, stepHeight, stepSize, stepNum) {
        var pillarDiameter = 1.5;
        var pillarHeight = 1.2*wallHeight - stepNum * stepHeight;
        var pillarLocation = ((stepSize - 4 * stepNum * stepHeight) / 2) * 7 / 8;

        var pillarMaterial = createMaterial(scene, "./assets/textures/pillar.jpg", 'pillar', 1.5, 2.0, new BABYLON.Color3.Black());
        var pillar = createCylinder(scene, pillarMaterial, pillarHeight, pillarDiameter, pillarDiameter, 'pillar1');
        pillar = properties(pillar, pillarLocation, (pillarHeight / 2 + stepNum * stepHeight), pillarLocation, 0, 0, 0, 1, 1, 1);

        var tab = [['pillar2', -(2 * pillarLocation), 0, 0, 0, 0, 0, 1, 1, 1], ['pillar3', -(2 * pillarLocation), 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1], ['pillar4', 0, 0, -(2 * pillarLocation), 0, 0, 0, 1, 1, 1]];
        for(var i = 0; i < tab.length; i++)
        {
            var pillar2 = clone_and_properties(pillar, tab[i][0], tab[i][1], tab[i][2], tab[i][3], tab[i][4], tab[i][5], tab[i][6], tab[i][7], tab[i][8], tab[i][9]);
        }
    }

    function glavna_sobana_miza(tableDiameter, tableHeight, stepNum, stepHeight) {
        var tableMaterial = createMaterial(scene, "./assets/textures/tableTop.jpg", 'table', 3.0, 3.0, new BABYLON.Color3.Black());

        var tableBot = createCylinder(scene, tableMaterial, (tableHeight * (2 / 3)), (tableDiameter * (1 / 3)), (tableDiameter * (2 / 3)), 'tableBot');
        tableBot.position.y += (tableHeight * (2 / 3)) / 2 + stepNum * stepHeight;

        var tableTop = createCylinder(scene, tableMaterial, (tableHeight * (1/3)), (tableDiameter), (tableDiameter * (1 / 3)), 'tableTop');
        tableTop.position.y = tableBot.position.y + tableHeight * (1 / 3);
    }

    function glavna_sobana_obok(groundMaterial, roomLength) {
        var obok = createBox(scene, groundMaterial, 1.1, 80, 1.1, 'obok');
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

    function postavi_bakle(roomLength) {
        var bakla;
        BABYLON.SceneLoader.ImportMesh('', 'assets/other/Torch/','Torch.babylon', scene, function (newMeshes) {
                // prva bakla
            bakla = newMeshes[0];
            var baklaMaterial = createMaterial(scene, 'assets/other/Torch/VRayMtl1SG_Base_Color copy.jpg', 'baklaMaterial', 1.0, 1.0, new BABYLON.Color3(0, 0, 0));
            bakla.material = baklaMaterial;

            bakla = properties(bakla, (roomLength/2 - 1.46), 3.9, 0, 0, 0, 0, 0.2, 0.2, 0.2);
            var nevidnMesh1 = createBox(scene, "", 2, 2, 2, 'nevidnMesh1');
            nevidnMesh1.position.y += 4;
            nevidnMesh1.position.z += 4;
            nevidnMesh1.position.x -= 2;
            nevidnMesh1.isVisible = false;
            nevidnMesh1.parent = bakla;
            partikli("partikel bakla1", 300, 'assets/textures/fire.jpg', nevidnMesh1);
            var bakla2 = clone_and_properties(bakla, 'bakla2', -(roomLength/2 - 2.45), 0, (roomLength/2 - 1.44), 0, 0, -(Math.PI/2), 0.2, 0.2, 0.2);
            var bakla3 = clone_and_properties(bakla, 'bakla3', -(roomLength/2 - 2.45), 0, -(roomLength/2 - 1.44), 0, 0, (Math.PI/2), 0.2, 0.2, 0.2);

            //var baklaLucka2G = lucke("baklaLucka2G", new BABYLON.Vector3(bakla2.position.x, bakla2.position.y, bakla2.position.z), new BABYLON.Vector3(0.25, 1, 1), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
            var baklaLucka2R = lucke("baklaLucka2R", new BABYLON.Vector3(bakla2.position.x, bakla2.position.y, bakla2.position.z), new BABYLON.Vector3(0.25, -1, -1), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));

            //var baklaLucka1G = lucke("baklaLucka1G", new BABYLON.Vector3(bakla.position.x, bakla.position.y, bakla.position.z), new BABYLON.Vector3(0.25, 1, 0), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
            var baklaLucka1D = lucke("baklaLucka1D", new BABYLON.Vector3(bakla.position.x, bakla.position.y, bakla.position.z), new BABYLON.Vector3(-1,-1,0), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));

            //var baklaLucka3G = lucke("baklaLucka3G", new BABYLON.Vector3(bakla3.position.x, bakla3.position.y, bakla3.position.z), new BABYLON.Vector3(0, 0.25, 0), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
            var baklaLucka3R = lucke("baklaLucka3R", new BABYLON.Vector3(bakla3.position.x, bakla3.position.y, bakla3.position.z), new BABYLON.Vector3(-0.25, -1, 1), 10, 10, 5, new BABYLON.Color3(1,1,1), new BABYLON.Color3(1,1,1));
        });
    }
};


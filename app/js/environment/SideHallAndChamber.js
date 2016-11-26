SideHallAndChamber = function (scene) {
    this.scene = scene;
};

SideHallAndChamber.prototype.create = function () {
    var roomLength = 50;
    var wallHeight = 5;
    var wallWidth = 1;
    var octagonE = 10;

    hodnik_dvorana_zid(roomLength, wallHeight, wallWidth, octagonE);
    stranski_hodnik_in_klancina_tla_in_strop(createMaterial(this.scene, './assets/textures/floor.jpg', 'ground', 5.0, 5.0, new BABYLON.Color3.Black()));
    drugaDvoranaTla();
    /**
     * STRANSKI HODNIK + KLANCINA
     * **/
    function hodnik_dvorana_zid(roomLength, wallHeight, wallWidth, octagonE) {
        var wallMaterial = createMaterial(this.scene, './assets/textures/wall.jpg', 'wall', 1.5, 4.0, new BABYLON.Color3.Black());
        var wall = createWall(this.scene, wallMaterial, wallHeight, wallWidth, roomLength, octagonE, 'wall1');
        wall = properties(wall, roomLength / 2 - wallWidth / 2, wallHeight / 2, 0, 0, 0, 0, 1, 1, 1);
        var tab = [['wall10', -(roomLength - wallWidth + 14.5), 0, 0, 0, (Math.PI/2), 0, 1, 1, 1], ['wall11', -(roomLength - wallWidth + 14.5), 0, -5, 0, (Math.PI/2), 0, 1, 1, 1], ['wall12', -(2*roomLength - wallWidth - 11.0), 0, 0.01, 0, (Math.PI/2), 0, 1, 1, 1], ['wall13', -(2*roomLength - wallWidth - 11.0), 0, -4.99, 0, (Math.PI/2), 0, 1, 1, 1], ['wall14', -(2*roomLength - wallWidth + 19.0), -1.25, 0.01, 0, (Math.PI/2), 0, 1, 1.5, 1], ['wall15', -(2*roomLength - wallWidth + 19.0), -1.25, -4.99, 0, (Math.PI/2), 0, 1, 1.5, 1], ['wall16', -(2*roomLength - wallWidth + 33.0), -1.25, -28.0, 0, 0, 0, 1.0, 1.5, 1.5], ['wall17', -(2*roomLength - wallWidth + 33.0), -1.25, 27.5, 0, 0, 0, 1.0, 1.5, 1.8]];

        for(var i = 0; i < tab.length; i++)
        {
            var wall2 = clone_and_properties(wall, tab[i][0], tab[i][1], tab[i][2], tab[i][3], tab[i][4], tab[i][5], tab[i][6], tab[i][7], tab[i][8], tab[i][9]);
        }
        var wallMaterial2 = createMaterial(this.scene, './assets/textures/wall.jpg', 'wall', 2.5, 16.0, new BABYLON.Color3.Black());
        var wall18 = createWall(this.scene, wallMaterial2, wallHeight, wallWidth, 100, octagonE, 'wall18');
        wall18 = properties(wall18, -(2*roomLength - wallWidth + 45), 1.25, 16.5, 0, (Math.PI/2), 0, 1.0, 1.5, 1.5);
        var wall19 = clone_and_properties(wall18,'wall19', 0, 0, -35, 0, 0, 0, 1.0, 1.5, 1.5);
        var wall20 = clone_and_properties(wall18,'wall20', -50, 0, -80, 0, (Math.PI/2), 0, 1.0, 1.5, 1.5);
        var wall21 = clone_and_properties(wall20,'wall21', 0, 0, 125, 0, 0, 0, 1.0, 1.5, 1.5);
            // odstranim prvi zid
        wall.isVisible = false;
    }

    function stranski_hodnik_in_klancina_tla_in_strop(groundMaterial) {
        // tla za hodnik
        var ground2 = createBox(this.scene, groundMaterial, 40, 1, 20,'ground2');
        ground2 = properties(ground2, -45, 0, -2.5, 0, (Math.PI/2), 0, 1, 0.01, 1);
        // tla za klancino
        var ground3 = createBox(this.scene, groundMaterial, 40, 5, 20, 'ground3');
        ground3 = properties(ground3, -69, 0, -2.5, 0, (Math.PI/2), 0, 1, 0.01, 1);

        var strop1 = clone_and_properties(ground2, 'strop1', 6.5, 5, 0, 0, 0, (Math.PI), 0.5, 0.01, 0.7);
        var strop2 = clone_and_properties(ground3, 'strop2', 5.43, 5, 0, 0, 0, (Math.PI), 0.5, 0.01, 0.7);
        var strop3 = clone_and_properties(strop2, 'strop3', -25, 0, 0, 0, 0, 0, 0.5, 0.01, 0.7);

        // zunanje stopnice
        for(var i = 0; i < 20; i++)
        {
            var step = createBox(this.scene, strop2.material, (10 - 4 * 1 * 5), 1, (10 - 4 * 1 * 5), 'step' + i);
            step.position.y -= 0.48 + 0.1*i;
            step.position.x -= 85 + i;
            step.position.z -= 3;
            step.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
        }
        // luc za zunaj
        //var lucZunaj = lucke("Luc Zunaj", new BABYLON.Vector3(-50,100,0), new BABYLON.Vector3(-1, -1, 0), 40.5, 50, 60, new BABYLON.Color3(1, 1, 1), new BABYLON.Color3(1, 1, 1));
    }

    function drugaDvoranaTla() {
        var groundMaterial = createMaterial(scene, "assets/textures/dirt01.jpg", 'ground4', 20, 20, new BABYLON.Color3(0, 0, 0));
        var ground4 = createBox(scene, groundMaterial, 100, 1, 100, 'ground4');
        ground4.position.x += -150;
        ground4.position.y -= 2;
        ground4.material = groundMaterial;
        scene.executeWhenReady(function() {
            ground4.setPhysicsState({ impostor: BABYLON.PhysicsEngine.HeightmapImpostor, move: false, mass: 0});
        });
        var strop = clone_and_properties(ground4, 'stropDvorane', 0, 7.5, 0, 0, 0, 0, 1, 1, 1);
    }
};
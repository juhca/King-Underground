ComplexHall = function (scene) {
    this.scene = scene;
};

ComplexHall.prototype.create = function () {
    // naravnost
    tla();
    stena();
    strop();
    function tla() {
        // kreiraj material za tla
        var groundMaterial = createMaterial(this.scene, 'assets/textures/rock1.jpg', 'tla', 2.0, 4.0, new BABYLON.Color3.Black());
        var ground = createBox(this.scene, groundMaterial, 5, 1, 40, 'ground');
        ground = properties(ground, -220, -2.05, -1, 0, 0, 0, 1, 1, 1);

        var prviKlanec = clone_and_properties(ground, 'prviKlanec', -17.5, 5.75, 20, 0, (Math.PI/2), -(Math.PI/10), 1, 1, 1);
        var ravno1 = clone_and_properties(ground, 'ravno1', -17.5, 11.89, 58.8, 0, (Math.PI/2), 0, 1, 1, 1);
        var drugiKlanec = clone_and_properties(ground, 'drugiKlanec', 0.8, 17, 76.3, 0, (Math.PI), -(Math.PI/10), 1, 1, 1);
        var ravno2 = clone_and_properties(ground, 'ravno2', 39.65, 23.155, 76.3, 0, 0, 0, 1, 1, 1);
        var tretjiKlanec = clone_and_properties(ground, 'tretjiKlanec', 57.15, 29.35, 97.8, 0, (Math.PI/2), -(Math.PI/10), 1, 1, 1);
        var ravno3 = clone_and_properties(ground, 'ravno3', 57.15, 35.5, 136.65, 0, (Math.PI/2), 0, 1, 1, 1);
        var cetrtiKlanec = clone_and_properties(ground, 'cetrtiKlanec', 40, 40.25, 154.2, 0, 0, -(Math.PI/10), 1, 1, 1);
        var ravno4 = clone_and_properties(ground, 'ravno4', 1.15, 46.4, 154.2, 0, 0, 0, 1, 1, 1);
        var ravno5 = clone_and_properties(ground, 'ravno5', -45.15, 46.4, 154.2, 0, 0, 0, 1, 1, 1);
    }
    
    function stena() {
        var wallMaterial = createMaterial(this.scene, 'assets/textures/mossy_rock.jpg', 'stena', 4.0, 8.0, new BABYLON.Color3.Black());

        var groundWall1 = createWall(this.scene, wallMaterial, 10, 1, 100, 10, 'groundWall1');
        groundWall1 = properties(groundWall1, -234.5, 2.05, -4, 0, (Math.PI/2), 0, 1, 1, 1);

        var groundWall2 = createWall(this.scene, wallMaterial, 10, 1, 60, 10, 'groundWall2');
        groundWall2 = properties(groundWall2, -214.5, 2.05, 2, 0, (Math.PI/2), 0, 1, 1, 1);

        var ravno1Wall1 = createWall(this.scene, wallMaterial, 25.5, 1, 91.5, 10, 'ravno1Wall1');
        ravno1Wall1 = properties(ravno1Wall1, -234.5, 2.05, 37.2, 0, 0, 0, 1, 1, 1);

        var ravno1Wall2 = createWall(this.scene, wallMaterial, 50, 1, 110, 10, 'ravno1Wall2');
        ravno1Wall2 = properties(ravno1Wall2, -240.5, 2.05, 40.2, 0, 0, 0, 1, 1, 1);

        var drugiKlanecWall1 = clone_and_properties(ravno1Wall2, 'drugiKlanecWall1', 50.45, 10, 32.1, 0, (Math.PI/2), 0, 1, 1, 1);
        var drugiKlanecWall2 = clone_and_properties(drugiKlanecWall1, 'drugiKlanecWall2', -20.3, 0, 6, 0, 0, 0, 1, 1, 1);

        var ravno2Wall1 = clone_and_properties(ravno1Wall2, 'ravno2Wall1', 80.65, 40, 75.1, 0, 0, 0, 1, 1, 1);
        var ravno2Wall2 = createWall(this.scene, wallMaterial, 47.5, 1, 91.5, 10, 'ravno2Wall2');
        ravno2Wall2 = properties(ravno2Wall2, ravno2Wall1.position.x - 5.99, 40, ravno2Wall2.position.z + 114, 0, 0, 0, 1, 1, 1);

        var cetrtiKlanecWall1 = clone_and_properties(ravno1Wall2, 'cetrtiKlanecWall1', 7.0, 50, 109.9, 0, (Math.PI/2), 0, 1, 1, 1.5);
        var cetrtiKlanecWall2 = clone_and_properties(cetrtiKlanecWall1, 'cetrtiKlanecWall2', 10, 0, 5.99, 0, 0, 0, 1, 1, 1.5);
    }
    
    function strop() {
        // kreiraj material za tla
        var groundMaterial = createMaterial(this.scene, 'assets/textures/rock1.jpg', 'tla', 2.0, 4.0, new BABYLON.Color3.Black());
        var ground = createBox(this.scene, groundMaterial, 5, 1, 40, 'ground');
        ground = properties(ground, -220, 7.0, -1, 0, 0, 0, 1, 1, 1);

        var prviKlanec = clone_and_properties(ground, 'prviKlanec', -17.5, 5.75, 20, 0, (Math.PI/2), -(Math.PI/10), 1, 1, 1);
        var ravno1 = clone_and_properties(ground, 'ravno1', -17.5, 11.89, 58.8, 0, (Math.PI/2), 0, 1, 1, 1);
        var drugiKlanec = clone_and_properties(ground, 'drugiKlanec', 0.8, 17, 76.3, 0, (Math.PI), -(Math.PI/10), 1, 1, 1);
        var ravno2 = clone_and_properties(ground, 'ravno2', 39.65, 23.155, 76.3, 0, 0, 0, 1, 1, 1);
        var tretjiKlanec = clone_and_properties(ground, 'tretjiKlanec', 57.15, 29.35, 97.8, 0, (Math.PI/2), -(Math.PI/10), 1, 1, 1);
        var ravno3 = clone_and_properties(ground, 'ravno3', 57.15, 35.5, 136.65, 0, (Math.PI/2), 0, 1, 1, 1);
        var cetrtiKlanec = clone_and_properties(ground, 'cetrtiKlanec', 40, 40.25, 154.2, 0, 0, -(Math.PI/11), 1, 1, 1);
        var ravno4 = clone_and_properties(ground, 'ravno4', 1.15, 46.4, 154.2, 0, 0, 0, 1, 1, 1);
        var ravno5 = clone_and_properties(ground, 'ravno5', -38.15, 40.0, 154.2, 0, 0, (Math.PI/10), 1, 1, 1);
        
    }
}
LastChamber = function (scene) {
    this.scene = scene;
};

LastChamber.prototype.create = function () {
    // naravnost
    tla_stene();

    function tla_stene() {
        // kreiraj material za tla
        var groundMaterial = createMaterial(this.scene, 'assets/textures/rock1.jpg', 'tla', 8.0, 16.0, new BABYLON.Color3.Black());
        var ground = createBox(this.scene, groundMaterial, 100, 1, 100, 'ground');
        ground = properties(ground, -250, -2.05, 150, 0, 0, 0, 1, 1, 1);

        var wallMaterial = createMaterial(this.scene, 'assets/textures/roof.jpg', 'stena', 1.0, 2.0, new BABYLON.Color3.Black());
        var groundWall1 = createWall(this.scene, wallMaterial, 20, 1, 150, 10, 'groundWall1');
        groundWall1 = properties(groundWall1, -240.5, 2.05, 200.5, 0, (Math.PI/2), 0, 1, 1, 1);

        var groundWall2 = clone_and_properties(groundWall1, 'groundWall2', 0, 0, -100, 0, 0, 0, 1, 1, 1);
        var groundWall3 = clone_and_properties(groundWall1, 'groundWall3', 40, 0, -40, 0, (Math.PI/2), 0, 1, 1, 1);
        var groundWall4 = clone_and_properties(groundWall1, 'groundWall4', -60, 0, -40, 0, (Math.PI/2), 0, 1, 1, 1);
        //var strop = clone_and_properties(ground, 'strop', 0, 14, 0, 0, 0, 0, 1, 1, 1);
    }
}
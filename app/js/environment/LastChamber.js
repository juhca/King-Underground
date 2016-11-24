LastChamber = function (scene) {
    this.scene = scene;
};

LastChamber.prototype.create = function () {
    // naravnost
    tla_stene();
    function tla_stene() {
        // kreiraj material za tla
        var groundMaterial = createMaterial(this.scene, 'assets/textures/rock1.jpg', 'tla', 2.0, 4.0, new BABYLON.Color3.Black());
        var ground = createBox(this.scene, groundMaterial, 100, 1, 100, 'ground');
        ground = properties(ground, -250, -2.05, 150, 0, 0, 0, 1, 1, 1);

    }

}
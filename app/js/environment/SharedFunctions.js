function lucke(name, position, direction, angle, exponent, intensity, diffuse, specular) {
    var luc = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3.Zero(), new BABYLON.Vector3.Zero(), 0, 0, scene);
    luc.name = name;
    luc.position = position;
    luc.direction = direction;
    luc.angle = angle;
    luc.exponent = exponent;
    luc.intensity = intensity;
    luc.diffuse = diffuse;
    luc.specular = specular;
    luc.setEnabled(1);
    return luc;
}

function partikli(ime, st_partiklov, lokacija_texture, objekt) {
    var particleSystem = new BABYLON.ParticleSystem(ime, st_partiklov, scene);
    // tektsturiraj sistem
    particleSystem.particleTexture = new BABYLON.Texture(lokacija_texture, scene);
    particleSystem.emitter = objekt;

    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.6;

    // Emission rate
    particleSystem.emitRate = 500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 4.71, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(1, 1, 1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();
}


/**
 * Created by tomas on 16. 11. 2016.
 */

function createMaterial(scene, lokacija, ime, uScale, vScale, color) {
    var material = new BABYLON.StandardMaterial(ime, scene);
    material.diffuseTexture = new BABYLON.Texture(lokacija,scene);
    material.specularColor = color;
    material.diffuseTexture.uScale = uScale;
    material.diffuseTexture.vScale = vScale;
    material.maxsimultaneousLights = 6;
    return material;
}

function createBox(scene, groundMaterial, boxlength, boxheight, boxwidth,ime) {
    var ground = BABYLON.MeshBuilder.CreateBox(ime, {
        size: boxlength,
        height: boxheight,
        width: boxwidth
    }, scene);
    groundMaterial.maxsimultaneousLights = 30;
    ground.material = groundMaterial;
    //ground.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
    ground.receiveShadows = true;
    return ground;
}

function createWall(scene, wallMaterial, wallHeight, wallWidth, roomLength, octagonE, ime) {
    var wall = BABYLON.MeshBuilder.CreateBox(ime, {
        height: wallHeight,
        width: wallWidth,
        depth: roomLength - 2 * octagonE
    }, scene);
    wall.material = wallMaterial;
    wall.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
    wall.receiveShadows = true;
    return wall;
}

function clone_and_properties(obj, ime, pos_x, pos_y, pos_z, rot_x, rot_y, rot_z, scal_x, scal_y, scal_z) {
    var obj_tmp = obj.clone(ime);
    obj_tmp = properties(obj_tmp, pos_x, pos_y, pos_z, rot_x, rot_y, rot_z, scal_x, scal_y, scal_z);
    return obj_tmp;
}

function properties(obj, pos_x, pos_y, pos_z, rot_x, rot_y, rot_z, scal_x, scal_y, scal_z) {
    obj.position.x += pos_x;
    obj.position.y += pos_y;
    obj.position.z += pos_z;
    obj.rotation.x += rot_x;
    obj.rotation.y += rot_y;
    obj.rotation.z += rot_z;
    obj.scaling.x = scal_x;
    obj.scaling.y = scal_y;
    obj.scaling.z = scal_z;
    obj.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});
    return obj;
}
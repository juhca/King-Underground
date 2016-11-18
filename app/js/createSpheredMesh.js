/**
 * Created by tomas on 16. 11. 2016.
 */

function createSphere(scene, ceilMaterial, sphereDiameter, wallHeight, ime, slice, orientation) {
    var ceilSphere = BABYLON.MeshBuilder.CreateSphere(ime, {
        diameter: sphereDiameter,
        slice: slice,
        sideOrientation: orientation
    }, scene);
    ceilSphere.position.y += wallHeight;
    ceilSphere.material = ceilMaterial;
    return ceilSphere;
}

function createCylinder(scene, pillarMaterial, pillarHeight, diameterTop, diameterBotton, ime) {
    var pillar = BABYLON.MeshBuilder.CreateCylinder(ime, {
        height: pillarHeight,
        diameterTop: diameterTop,
        diameterBottom: diameterBotton
    }, scene);
    pillar.material = pillarMaterial;
    pillar.checkCollisions = true;
    return pillar;
}

MainEnvironment = function (scene) {
    /** ============ GLAVNA DVORANO  ============= **/
    new MainChamber(scene).create();
    /** ========= HODNIK + 2. DVORANA  =========== **/
    new SideHallAndChamber(scene).create();
    /** ============ ZAVITI HODNIKI  ============= **/
    new ComplexHall(scene).create();
    // zgradi zadnjo dvorano
};
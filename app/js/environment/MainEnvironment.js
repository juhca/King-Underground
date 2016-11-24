
MainEnvironment = function (scene) {
    /** ============ GLAVNA DVORANO  ============= **/
    new MainChamber(scene).create();
    /** ========= HODNIK + 2. DVORANA  =========== **/
    new SideHallAndChamber(scene).create();
    /** ============ ZAVITI HODNIKI  ============= **/
    new ComplexHall(scene).create();
    /** ============ ZADNJA DVORANA  ============= **/
    new LastChamber(scene).create();
};
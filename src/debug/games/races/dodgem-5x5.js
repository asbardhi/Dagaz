ZRF = {
    JUMP:          0,
    IF:            1,
    FORK:          2,
    FUNCTION:      3,
    IN_ZONE:       4,
    FLAG:          5,
    SET_FLAG:      6,
    POS_FLAG:      7,
    SET_POS_FLAG:  8,
    ATTR:          9,
    SET_ATTR:      10,
    PROMOTE:       11,
    MODE:          12,
    ON_BOARD_DIR:  13,
    ON_BOARD_POS:  14,
    PARAM:         15,
    LITERAL:       16,
    VERIFY:        20
};

Dagaz.Model.BuildDesign = function(design) {
    design.checkVersion("z2j", "2");
    design.checkVersion("zrf", "3.0");
    design.checkVersion("animate-captures", "false");
    design.checkVersion("show-hints", "false");
    design.checkVersion("ko", "true");
    design.checkVersion("dodgem-extension", "true");

    design.addDirection("w");
    design.addDirection("e");
    design.addDirection("s");
    design.addDirection("n");

    design.addPlayer("Blue", [1, 0, 3, 2]);
    design.addPlayer("Red", [3, 2, 0, 1]);

    design.addPosition("a5", [0, 1, 5, 0]);
    design.addPosition("b5", [-1, 1, 5, 0]);
    design.addPosition("c5", [-1, 1, 5, 0]);
    design.addPosition("d5", [-1, 1, 5, 0]);
    design.addPosition("e5", [-1, 0, 5, 0]);
    design.addPosition("a4", [0, 1, 5, -5]);
    design.addPosition("b4", [-1, 1, 5, -5]);
    design.addPosition("c4", [-1, 1, 5, -5]);
    design.addPosition("d4", [-1, 1, 5, -5]);
    design.addPosition("e4", [-1, 0, 5, -5]);
    design.addPosition("a3", [0, 1, 5, -5]);
    design.addPosition("b3", [-1, 1, 5, -5]);
    design.addPosition("c3", [-1, 1, 5, -5]);
    design.addPosition("d3", [-1, 1, 5, -5]);
    design.addPosition("e3", [-1, 0, 5, -5]);
    design.addPosition("a2", [0, 1, 5, -5]);
    design.addPosition("b2", [-1, 1, 5, -5]);
    design.addPosition("c2", [-1, 1, 5, -5]);
    design.addPosition("d2", [-1, 1, 5, -5]);
    design.addPosition("e2", [-1, 0, 5, -5]);
    design.addPosition("a1", [0, 1, 0, -5]);
    design.addPosition("b1", [-1, 1, 0, -5]);
    design.addPosition("c1", [-1, 1, 0, -5]);
    design.addPosition("d1", [-1, 1, 0, -5]);
    design.addPosition("e1", [-1, 0, 0, -5]);

    design.addZone("goal", 1, [0, 1, 2, 3, 4]);
    design.addZone("goal", 2, [24, 19, 14, 9, 4]);

    design.addCommand(0, ZRF.FUNCTION,	24);	// from
    design.addCommand(0, ZRF.PARAM,	0);	// $1
    design.addCommand(0, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(0, ZRF.FUNCTION,	1);	// empty?
    design.addCommand(0, ZRF.FUNCTION,	20);	// verify
    design.addCommand(0, ZRF.FUNCTION,	25);	// to
    design.addCommand(0, ZRF.FUNCTION,	28);	// end

    design.addCommand(1, ZRF.FUNCTION,	24);	// from
    design.addCommand(1, ZRF.IN_ZONE,	0);	// goal
    design.addCommand(1, ZRF.FUNCTION,	20);	// verify
    design.addCommand(1, ZRF.FUNCTION,	26);	// capture
    design.addCommand(1, ZRF.FUNCTION,	25);	// to
    design.addCommand(1, ZRF.FUNCTION,	28);	// end

    design.addPiece("Car", 0);
    design.addMove(0, 0, [3], 0);
    design.addMove(0, 0, [0], 0);
    design.addMove(0, 0, [1], 0);
    design.addMove(0, 1, [], 0);

    design.setup("Blue", "Car", 21);
    design.setup("Blue", "Car", 22);
    design.setup("Blue", "Car", 23);
    design.setup("Blue", "Car", 24);
    design.setup("Red", "Car", 15);
    design.setup("Red", "Car", 10);
    design.setup("Red", "Car", 5);
    design.setup("Red", "Car", 0);
}

Dagaz.View.configure = function(view) {
    view.defBoard("Board");
    view.defPiece("BlueCar", "Blue Car");
    view.defPiece("RedCar", "Red Car");
 
    view.defPosition("a5", 2, 2, 60, 60);
    view.defPosition("b5", 64, 2, 60, 60);
    view.defPosition("c5", 126, 2, 60, 60);
    view.defPosition("d5", 188, 2, 60, 60);
    view.defPosition("e5", 250, 2, 60, 60);
    view.defPosition("a4", 2, 64, 60, 60);
    view.defPosition("b4", 64, 64, 60, 60);
    view.defPosition("c4", 126, 64, 60, 60);
    view.defPosition("d4", 188, 64, 60, 60);
    view.defPosition("e4", 250, 64, 60, 60);
    view.defPosition("a3", 2, 126, 60, 60);
    view.defPosition("b3", 64, 126, 60, 60);
    view.defPosition("c3", 126, 126, 60, 60);
    view.defPosition("d3", 188, 126, 60, 60);
    view.defPosition("e3", 250, 126, 60, 60);
    view.defPosition("a2", 2, 188, 60, 60);
    view.defPosition("b2", 64, 188, 60, 60);
    view.defPosition("c2", 126, 188, 60, 60);
    view.defPosition("d2", 188, 188, 60, 60);
    view.defPosition("e2", 250, 188, 60, 60);
    view.defPosition("a1", 2, 250, 60, 60);
    view.defPosition("b1", 64, 250, 60, 60);
    view.defPosition("c1", 126, 250, 60, 60);
    view.defPosition("d1", 188, 250, 60, 60);
    view.defPosition("e1", 250, 250, 60, 60);
}

(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "chess-promotion") {
     checkVersion(design, name, value);
  }
}

var promote = function(arr, name, player) {
  var design = Dagaz.Model.design;
  var t = design.getPieceType(name);
  if (t !== null) {
      arr.push(Dagaz.Model.createPiece(t, player));
  }
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;
  for (var i in board.moves) {
       var m = board.moves[i];
       for (var j in m.actions) {
            fp = m.actions[j][0];
            tp = m.actions[j][1];
            if ((fp !== null) && (tp !== null)) {
                var piece = board.getPiece(fp[0]);
                if ((piece !== null) && (piece.getType() == "Pawn")) {
                    var p = design.navigate(board.player, tp[0], design.getDirection("n"));
                    if (p === null) {
                        var promoted = [];
                        promote(promoted, "Queen",  board.player);
                        promote(promoted, "Rook",   board.player);
                        promote(promoted, "Knight", board.player);
                        promote(promoted, "Bishop", board.player);
                        if (promoted.length > 0) {
                            m.actions[j][2] = promoted;
                        }
                    }
                }
                break;
            }
       }
  }
  CheckInvariants(board);
}

})();

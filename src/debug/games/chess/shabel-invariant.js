(function() {

Dagaz.AI.AI_FRAME      = 2000;
Dagaz.AI.getForcedMove = Dagaz.AI.getChessForcedMove;

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "shabel-invariant") {
      checkVersion(design, name, value);
  }
}

var checkGoals = Dagaz.Model.checkGoals;

Dagaz.Model.checkGoals = function(design, board, player) {
  var design = Dagaz.Model.design;
  var king   = design.getPieceType("King");
  var kings  = _.chain(design.allPositions())
   .filter(function(pos) {
      var piece = board.getPiece(pos);
      if (piece === null) return false;
      return piece.type == king;
    })
   .map(function(pos) {
      var piece = board.getPiece(pos);
      return piece.player;
    })
   .value();
  if (_.indexOf(kings, player) < 0) return -1;
  if (kings.length < 2) return 1;
  return checkGoals(design, board, player);
}

var findPiece = function(design, board, player, type) {
  var positions = design.allPositions();
  for (var i = 0; i < positions.length; i++) {
       var piece = board.getPiece(positions[i]);
       if ((piece !== null) && (piece.type == type) && (piece.player == player)) {
           return positions[i];
       }
  }
  return null;
}

var notSafe = function(design, board, player, king) {
  var pos = findPiece(design, board, player, king);
  if (pos === null) return true;
  board.generateInternal(board, false);
  var r = false;
  _.chain(board.moves)
   .filter(function(move) {
       return move.actions.length > 0;
    })
   .each(function(move) {
       _.chain(move.actions)
        .filter(function(action) {
             return (action[0] !== null) && (action[1] !== null);
         })
        .each(function(action) {
             if (action[1][0] == pos) {
                 r = true;
             }
         });
    });
  return r;
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;
  var king   = design.getPieceType("King");
  _.chain(board.moves)
   .filter(function(move) {
       return move.actions.length > 0;
    })
   .each(function(move) {
       var b = board.apply(move);
       if (notSafe(design, b, board.player, king)) {
           move.failed = true;
       }
    });
  CheckInvariants(board);
}

})();

(function() {

var Z2J_VERSION = 2;

Dagaz.Model.deferredStrike  = false;
Dagaz.Model.discardCascades = false;
Dagaz.Model.forkMode        = false;
Dagaz.Model.passPartial     = false;
Dagaz.Model.passTurn        = 0;
Dagaz.Model.sharedPieces    = false;
Dagaz.Model.recycleCaptures = false;
Dagaz.Model.smartFrom       = false;
Dagaz.Model.smartTo         = false;
Dagaz.Model.showGoals       = true;
Dagaz.Model.showCaptures    = true;
Dagaz.Model.showMoves       = true;
Dagaz.Model.showHints       = true;
Dagaz.Model.stalemateDraw   = false;
Dagaz.Model.showBlink       = true;

Dagaz.Model.checkVersion = function(design, name, value) {  
  if (name == "z2j") {
     if (value > Z2J_VERSION) {
         design.failed = true;
     }
  } else {
     if ((name != "zrf")                && 
         (name != "pass-turn")          &&
         (name != "pass-partial")       &&
         (name != "moves-limit")        &&
         (name != "discard-cascades")   &&
         (name != "animate-captures")   &&
         (name != "animate-drops")      &&
         (name != "highlight-goals")    &&
         (name != "prevent-flipping")   &&
         (name != "progressive-levels") &&
         (name != "selection-screen")   &&
         (name != "show-moves-list")    &&
         (name != "show-captures")      &&
         (name != "smart-moves")        &&
         (name != "show-hints")         &&
         (name != "stalemate-draw")     &&
         (name != "recycle-captures")   &&
         (name != "shared-pieces")      &&
         (name != "show-blink")         &&
         (name != "silent-?-moves")) {
         design.failed = true;
     }
     if (name == "show-blink") {
         Dagaz.Model.showBlink = (value == "true");
     }
     if (name == "show-captures") {
         Dagaz.Model.showCaptures = (value == "true");
     }
     if (name == "shared-pieces") {
         Dagaz.Model.sharedPieces = (value == "true");
     }
     if (name == "show-moves-list") {
         Dagaz.Model.showMoves = (value == "true");
     }
     if (name == "highlight-goals") {
         Dagaz.Model.showGoals = (value == "true");
     }
     if (name == "smart-moves") {
         if ((value == "from") || (value == "true")) {
            Dagaz.Model.smartFrom = true;
         }
         if ((value == "to") || (value == "true")) {
            Dagaz.Model.smartTo = true;
         }
     }
     if ((name == "recycle-captures") && (value == "true")) {
         Dagaz.Model.recycleCaptures = true;
     }
     if ((name == "discard-cascades") && (value == "true")) {
         Dagaz.Model.discardCascades = true;
     }
     if ((name == "pass-partial") && (value == "true")) {
         Dagaz.Model.passPartial = true;
     }
     if ((name == "pass-turn") && (value == "true")) {
         Dagaz.Model.passTurn = 1;
     }
     if ((name == "pass-turn") && (value == "forced")) {
         Dagaz.Model.passTurn = 2;
     }
     if (name == "moves-limit") {
         Dagaz.Model.movesLimit = value;
     }
     if ((name == "show-hints") && (value == "false")) {
         Dagaz.Model.showHints = false;
     }
     if ((name == "stalemate-draw") && (value == "true")) {
         Dagaz.Model.stalemateDraw = true;
     }
  }
}

Dagaz.Model.checkOption = function(design, name, value) {
  if (design.options[name] == value) {
      return true;
  }
}

Dagaz.Model.ZRF_JUMP      = 0;
Dagaz.Model.ZRF_IF        = 1;
Dagaz.Model.ZRF_FORK      = 2;
Dagaz.Model.ZRF_FUNCTION  = 3;
Dagaz.Model.ZRF_IN_ZONE   = 4;
Dagaz.Model.ZRF_GET_FLAG  = 5;
Dagaz.Model.ZRF_SET_FLAG  = 6;
Dagaz.Model.ZRF_GET_PFLAG = 7;
Dagaz.Model.ZRF_SET_PFLAG = 8;
Dagaz.Model.ZRF_GET_ATTR  = 9;
Dagaz.Model.ZRF_SET_ATTR  = 10;
Dagaz.Model.ZRF_PROMOTE   = 11;
Dagaz.Model.ZRF_MODE      = 12;
Dagaz.Model.ZRF_ON_BOARDD = 13;
Dagaz.Model.ZRF_ON_BOARDP = 14;
Dagaz.Model.ZRF_PARAM     = 15;
Dagaz.Model.ZRF_LITERAL   = 16;
Dagaz.Model.ZRF_VERIFY    = 20;
Dagaz.Model.ZRF_SET_POS   = 21;
Dagaz.Model.ZRF_NAVIGATE  = 22;
Dagaz.Model.ZRF_OPPOSITE  = 23;
Dagaz.Model.ZRF_FROM      = 24;
Dagaz.Model.ZRF_TO        = 25;
Dagaz.Model.ZRF_CAPTURE   = 26;
Dagaz.Model.ZRF_FLIP      = 27;
Dagaz.Model.ZRF_END       = 28;

Dagaz.Model.ZRF_NOT       = 0;
Dagaz.Model.ZRF_IS_EMPTY  = 1;
Dagaz.Model.ZRF_IS_ENEMY  = 2;
Dagaz.Model.ZRF_IS_FRIEND = 3;
Dagaz.Model.ZRF_IS_LASTF  = 4;
Dagaz.Model.ZRF_IS_LASTT  = 5;
Dagaz.Model.ZRF_MARK      = 6;
Dagaz.Model.ZRF_BACK      = 7;
Dagaz.Model.ZRF_PUSH      = 8;
Dagaz.Model.ZRF_POP       = 9;
Dagaz.Model.ZRF_IS_PIECE  = 10;
Dagaz.Model.ZRF_CREATE    = 11;

Dagaz.Model.commands = {};

Dagaz.Model.commands[Dagaz.Model.ZRF_JUMP] = function(gen, param) {
   return param - 1;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_IF] = function(gen, param) {
   if (gen.stack.length == 0) {
       return null;
   }
   var f = gen.stack.pop();
   if (f) {
      return param - 1;
   } else {
      return 0;
   }
}

Dagaz.Model.commands[Dagaz.Model.ZRF_FORK] = function(gen, param) {
   var g = gen.clone();
   g.cmd += param - 1;
   gen.board.addFork(g);
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_FUNCTION] = function(gen, param) {
  var game = gen.board.game;
  if (!_.isUndefined(game.functions[param])) {
     return (game.functions[param])(gen);
  }
  return null;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_IN_ZONE] = function(gen, param) {
   var player = gen.board.player;
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(gen.design.inZone(param, player, gen.pos));
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_GET_FLAG] = function(gen, param) {
   gen.stack.push(gen.getValue(param, -1));
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_SET_FLAG] = function(gen, param) {
   if (gen.stack.length == 0) {
       return null;
   }
   value = gen.stack.pop();
   gen.setValue(param, -1, value);
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_GET_PFLAG] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(gen.getValue(param, gen.pos));
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_SET_PFLAG] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.stack.length == 0) {
       return null;
   }
   value = gen.stack.pop();
   gen.setValue(param, gen.pos, value);
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_GET_ATTR] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   var value = gen.getAttr(param, gen.pos);
   if (value === null) {
       return null;
   }
   gen.stack.push(value);
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_SET_ATTR] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.stack.length == 0) {
       return null;
   }
   var value = gen.stack.pop();
   gen.setAttr(param, gen.pos, value);
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_PROMOTE] = function(gen, param) {
   if (_.isUndefined(gen.piece)) {
       return null;
   }
   gen.piece = gen.piece.promote(param);
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_MODE] = function(gen, param) {
   gen.mode = param;
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_ON_BOARDD] = function(gen, param) {
   var player = gen.board.player;
   var pos = gen.pos;
   if (pos === null) {
       return null;
   }
   pos = gen.design.navigate(player, pos, param);
   if (pos !== null) {
       gen.stack.push(true);
   } else {
       gen.stack.push(false);
   }
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_ON_BOARDP] = function(gen, param) {
   if ((param >= 0) && (param < gen.design.positions.length)) {
       gen.stack.push(true);
   } else {
       gen.stack.push(false);
   }
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_PARAM] = function(gen, param) {
   var value = gen.params[param];
   gen.stack.push(value);
   return 0;
}

Dagaz.Model.commands[Dagaz.Model.ZRF_LITERAL] = function(gen, param) {
   gen.stack.push(param);
   return 0;
}

Dagaz.Model.functions = {};

Dagaz.Model.functions[Dagaz.Model.ZRF_VERIFY] = function(gen) {
   if (gen.stack.length == 0) {
       return null;
   }
   var f = gen.stack.pop();
   if (f) {
       return 0;
   } else {
       return null;
   }
}

Dagaz.Model.functions[Dagaz.Model.ZRF_SET_POS] = function(gen) {
   if (gen.stack.length == 0) {
       return null;
   }
   var pos = gen.stack.pop();
   if (pos < gen.design.positions.length) {
      gen.pos = pos;
      return 0;
   } else {
      return null;
   }
}

Dagaz.Model.functions[Dagaz.Model.ZRF_NAVIGATE] = function(gen) {
   if (gen.stack.length == 0) {
       return null;
   }
   var dir = gen.stack.pop();
   var player = gen.board.player;
   var pos = gen.pos;
   if (pos === null) {
       return null;
   }
   pos = gen.design.navigate(player, pos, dir);
   if (pos === null) {
       return null;
   }
   if (pos < gen.design.positions.length) {
      gen.pos = pos;
      return 0;
   } else {
      return null;
   }
}

Dagaz.Model.functions[Dagaz.Model.ZRF_OPPOSITE] = function(gen) {
   if (gen.stack.length == 0) {
       return null;
   }
   var dir = gen.stack.pop();
   if (_.isUndefined(gen.design.players[0])) {
       return null;
   }
   if (_.isUndefined(gen.design.players[0][dir])) {
       return null;
   }
   dir = gen.design.players[0][dir];
   gen.stack.push(dir);
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_FROM] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.getPiece(gen.pos) === null) {
       return null;
   }
   gen.from  = gen.pos;
   gen.piece = gen.getPiece(gen.pos);
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_TO] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (_.isUndefined(gen.piece)) {
       return null;
   }
   gen.movePiece(gen.from, gen.pos, gen.piece);
   delete gen.from;
   delete gen.piece;
   gen.generated = true;
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_CAPTURE] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.getPiece(gen.pos) === null) {
       return 0;
   }
   if (!gen.capturePiece(gen.pos)) {
       return null;
   }
   gen.generated = true;
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_FLIP] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.getPiece(gen.pos) === null) {
       return null;
   }
   var piece = gen.getPiece(gen.pos).flip();
   gen.movePiece(gen.pos, gen.pos, piece);
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_END] = function(gen) {
   var board = gen.board;
   if (gen.generated) {
       if (gen.moveType == 2) {
           board.changeMove(gen.move);
       }
       if (gen.moveType == 1) {
           board.addMove(gen.move);
       }
   }
   gen.moveType = 0;
   gen.completed = true;
   return null;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_NOT] = function(gen) {
   if (gen.stack.length == 0) {
       return null;
   }
   var f = gen.stack.pop();
   gen.stack.push(!f);
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_EMPTY] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   var piece = gen.getPiece(gen.pos);
   gen.stack.push(piece === null);
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_PIECE] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.stack.length == 0) {
       return null;
   }
   var type = gen.stack.pop();
   var piece = gen.getPiece(gen.pos);
   if (piece === null) {
       gen.stack.push(false);
   } else {
       gen.stack.push(piece.type == type);
   }
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_CREATE] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.stack.length == 0) {
       return null;
   }
   var type = gen.stack.pop();
   var piece = new ZrfPiece(type, gen.board.player);
   gen.dropPiece(gen.pos, piece);
   return 0;
}

Dagaz.Model.isFriend = function(piece, player) {
   if (piece === null) return false;
   return (piece.player == player);
}

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_ENEMY] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   var piece  = gen.getPiece(gen.pos);
   if (piece === null) {
       gen.stack.push(false);
       return 0;
   }
   var player = gen.board.player;
   gen.stack.push(!Dagaz.Model.isFriend(piece, player));
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_FRIEND] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   var piece  = gen.getPiece(gen.pos);
   if (piece === null) {
       gen.stack.push(false);
       return 0;
   }
   var player = gen.board.player;
   gen.stack.push(Dagaz.Model.isFriend(piece, player));
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_LASTF] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(gen.isLastFrom(gen.pos));
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_IS_LASTT] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(gen.isLastTo(gen.pos));
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_MARK] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   gen.setMark();
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_BACK] = function(gen) {
   var pos = gen.getMark();
   if (pos !== null) {
      gen.pos = pos;
   } else {
      return null;
   }
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_PUSH] = function(gen) {
   gen.marks.push(gen.pos);
   return 0;
}

Dagaz.Model.functions[Dagaz.Model.ZRF_POP] = function(gen) {
   if (gen.marks.length == 0) {
       return null;
   }
   gen.pos = gen.marks.pop();
   return 0;
}

if (!_.isUndefined(Array.indexOf)) {
   Dagaz.find = function(array, value) {
      return Array.prototype.indexOf.call(array, value);
   }
} else {
   Dagaz.find = function(array, value) {
      return _.indexOf(array, value);
   }
}

if (!_.isUndefined(Int32Array)) {
   Dagaz.int32Array = function(array) {
      var a = new Int32Array(array.length);
      a.set(array);
      return a;
   }
} else {
   Dagaz.int32Array = function(array) {
      return array;
   }
}

Dagaz.Model.posToString = function(pos, design) {
   if (_.isUndefined(design)) {
       design = Dagaz.Model.getDesign();
   }
   if (pos < design.positionNames.length) {
       return design.positionNames[pos];
   } else {
       return "?";
   }
}

Dagaz.Model.stringToPos = function(name, design) {
   if (_.isUndefined(design)) {
       design = Dagaz.Model.getDesign();
   }
   var pos = Dagaz.find(design.positionNames, name);
   if (pos >= 0) {
       return pos;
   } else {
       return null;
   }
}

Dagaz.Model.zupdate = function(value, piece, pos) {
  return 0;
}

function ZrfDesign() {
  this.playerNames    = [];
  this.players        = [];
  this.positionNames  = [];
  this.positions      = [];
  this.zoneNames      = [];
  this.zones          = [];
  this.pieceNames     = [];
  this.pieces         = [];
  this.attrs          = [];
  this.dirs           = [];
  this.templates      = [];
  this.options        = [];
  this.modes          = [];
  this.price          = [];
  this.goals          = [];
  this.failed         = false;
}

Dagaz.Model.getDesign = function() {
  if (_.isUndefined(Dagaz.Model.design)) {
      Dagaz.Model.design = new ZrfDesign();
  }
  return Dagaz.Model.design;
}

ZrfDesign.prototype.allPositions = function() {
  return _.range(this.positions.length);
}

ZrfDesign.prototype.allDirections = function() {
  return _.range(this.dirs.length);
}

ZrfDesign.prototype.reserve = function(player, piece, cnt) {
  var o = Dagaz.find(this.playerNames, player);
  var t = Dagaz.find(this.pieceNames, piece);
  if ((o < 0) || (t < 0)) {
      this.failed = true;
  } else {
      if (_.isUndefined(this.reserve[t])) {
          this.reserve[t] = [];
      }
      this.reserve[t][o] = cnt;
  }
}

ZrfDesign.prototype.setup = function(player, piece, pos) {
  var o = Dagaz.find(this.playerNames, player);
  var t = Dagaz.find(this.pieceNames, piece);
  if ((o < 0) || (t < 0)) {
      this.failed = true;
  } else {
      var board = Dagaz.Model.getInitBoard();
      board.setPiece(pos, Dagaz.Model.createPiece(t, o));
  }
}

ZrfDesign.prototype.goal = function(n, player, piece, pos) {
  var o = Dagaz.find(this.playerNames, player);
  if (_.isUndefined(this.goals[o])) {
      this.goals[o] = [];
  }
  this.goals[o].push({
      num: n,
      piece: Dagaz.find(this.pieceNames, piece),
      positions: pos
  });
}

Dagaz.Model.getPieceTypes = function(piece) {
  return [ piece.type ];
}

ZrfDesign.prototype.getGoalPositions = function(player, pieces) {
  if (!_.isUndefined(this.goals[player])) {
      return _.chain(this.goals[player])
       .filter(function(goal) {
            return goal.num == 0;
        })
       .filter(function(goal) {
            return _.indexOf(pieces, goal.piece) >= 0;
        })
       .map(function(goal) {
            return goal.positions;
        })
       .flatten()
       .uniq()
       .value();
  } else {
       return [];
  }
}

ZrfDesign.prototype.getTemplate = function(ix) {
  if (_.isUndefined(this.templates[ix])) {
      this.templates[ix] = Dagaz.Model.createTemplate();
  }
  return this.templates[ix];
}

ZrfDesign.prototype.addCommand = function(ix, name, param) {
  var template = this.getTemplate(ix);
  template.addCommand(name, param);
}

ZrfDesign.prototype.addPriority = function(mode) {
  this.modes.push(mode);
}

ZrfDesign.prototype.addAttribute = function(type, name, val) {
  if (_.isUndefined(this.attrs[name])) {
      this.attrs[name] = [];
  }
  this.attrs[name][type] = val;
}

ZrfDesign.prototype.getAttribute = function(type, name) {
  if (_.isUndefined(this.attrs[name])) {
      return null;
  }
  if (_.isUndefined(this.attrs[name][type])) {
      return null;
  }
  return this.attrs[name][type];
}

ZrfDesign.prototype.addPiece = function(name, type, price) {
  this.pieceNames[type] = name;
  this.price[type] = price ? price : 1;
}

ZrfDesign.prototype.addMove = function(type, template, params, mode) {
  if (_.isUndefined(this.pieces[type])) {
      this.pieces[type] = [];
  }
  if (!_.isUndefined(this.templates[template])) {
      this.pieces[type].push({
         type: 0,
         template: this.templates[template],
         params: params,
         mode: mode
      });
  }
}

ZrfDesign.prototype.addDrop = function(type, template, params, mode) {
  if (_.isUndefined(this.pieces[type])) {
      this.pieces[type] = [];
  }
  if (!_.isUndefined(this.templates[template])) {
      this.pieces[type].push({
         type: 1,
         template: this.templates[template],
         params: params,
         mode: mode
      });
  }
}

ZrfDesign.prototype.checkVersion = function(name, value) {
  this.options[name] = value;
  Dagaz.Model.checkVersion(this, name, value);
}

ZrfDesign.prototype.checkOption = function(name, value) {
  return Dagaz.Model.checkOption(this, name, value);
}

ZrfDesign.prototype.getPieceType = function(name) {
  var r = Dagaz.find(this.pieceNames, name);
  if (r < 0) {
      return null;
  }
  return r;
}

ZrfDesign.prototype.getDirection = function(name) {
  var r = Dagaz.find(this.dirs, name);
  if (r < 0) {
      return null;
  }
  return r;
}

ZrfDesign.prototype.addDirection = function(name) {
  this.dirs.push(name);
}

ZrfDesign.prototype.addPlayer = function(player, symmetries) {
  var ix = this.playerNames.length;
  if (this.playerNames.length == 0) {
      ix = 0;
      this.playerNames.push("opposite");
  }
  this.players[ix] = Dagaz.int32Array(symmetries);
  this.playerNames.push(player);
}

ZrfDesign.prototype.getPlayersCount = function() {
  return this.playerNames.length - 1;
}

ZrfDesign.prototype.addTurn = function(player, mode) {
  if (!mode) {
      mode = null;
  }
  if (_.isUndefined(this.turns)) {
      this.turns = [];
  }
  this.turns.push({
      player: player,
      mode:   mode
  });
}

ZrfDesign.prototype.repeatMark = function() {
  if (_.isUndefined(this.turns)) {
      this.turns = [];
  }
  this.repeat = this.turns.length;
}

ZrfDesign.prototype.isPuzzle = function() {
  return _.chain(_.keys(this.playerNames)).max().value() == 1;
}

ZrfDesign.prototype.nextPlayer = function(player) {
  if (player + 1 >= this.playerNames.length) {
      return 1;
  } else {
      return player + 1;
  }
}

ZrfDesign.prototype.nextTurn = function(board) {
  var turn = board.turn + 1;
  if (_.isUndefined(this.turns)) {
      if (turn >= this.playerNames.length - 1) {
          turn = 0;
          if (this.repeat) {
              turn += this.repeat;
          }
      }
  } else {
      if (turn >= this.turns.length) {
          turn = 0;
          if (this.repeat) {
              turn += this.repeat;
          }
      }
  }
  return turn;
}

ZrfDesign.prototype.currPlayer = function(turn) {
  if (_.isUndefined(this.turns)) {
      return turn + 1;
  } else {
      return this.turns[turn].player;
  }
}

ZrfDesign.prototype.currMode = function(turn) {
  if (_.isUndefined(this.turns)) {
      return null;
  } else {
      return this.turns[turn].mode;
  }
}

ZrfDesign.prototype.prevPlayer = function(player) {
  if (player == 1) {
      return this.playerNames.length;
  } else {
      return player - 1;
  }
}

ZrfDesign.prototype.prevTurn = function(board) {
  if (_.isUndefined(this.turns)) {
      if (board.turn == 0) {
          return this.playerNames.length - 2;
      }
  } else {
      if ((board.turn == 0) || (board.turn == this.repeat)) {
          return this.turns.length - 1;
      }
  }
  return board.turn - 1;
}

ZrfDesign.prototype.addPosition = function(name, links) {
  this.positionNames.push(name);
  this.positions.push(Dagaz.int32Array(links));
}

ZrfDesign.prototype.findDirection = function(from, to) {
  if (from >= this.positions.length) return null;
  var dir = Dagaz.find(this.positions[from], to - from);
  if (dir < 0) return null;
  return dir;
}

ZrfDesign.prototype.navigate = function(player, pos, dir) {
  if (!_.isUndefined(this.players[player])) {
      dir = this.players[player][dir];
  }
  if (this.positions[pos][dir] != 0) {
      return + pos + this.positions[pos][dir];
  } else {
      return null;
  }
}

ZrfDesign.prototype.getZone = function(name) {
  var zone = Dagaz.find(this.zoneNames, name);
  if (zone < 0) return null;
  return zone;
}

ZrfDesign.prototype.addZone = function(name, player, positions) {
  var zone = Dagaz.find(this.zoneNames, name);
  if (zone < 0) {
      zone = this.zoneNames.length;
      this.zoneNames.push(name);
  }
  if (_.isUndefined(this.zones[zone])) {
      this.zones[zone] = [];
  }
  this.zones[zone][player] = Dagaz.int32Array(positions);
}

ZrfDesign.prototype.zonePositions = function(zone, player) {
  if (!_.isUndefined(this.zones[zone])) {
      if (!_.isUndefined(this.zones[zone][player])) {
          return this.zones[zone][player];
      }
  }
  return [];
}

ZrfDesign.prototype.inZone = function(zone, player, pos) {
  if (!_.isUndefined(this.zones[zone])) {
      if (!_.isUndefined(this.zones[zone][player])) {
          return Dagaz.find(this.zones[zone][player], pos) >= 0;
      }
  }
  return false;
}

function ZrfMoveTemplate() {
  this.commands = [];
}

Dagaz.Model.createTemplate = function() {
  return new ZrfMoveTemplate();
}

ZrfMoveTemplate.prototype.addCommand = function(name, param) {
  if (!_.isUndefined(Dagaz.Model.commands[name])) {
      if (_.isUndefined(Dagaz.Model.cache)) {
          Dagaz.Model.cache = [];
      }
      if (_.isUndefined(Dagaz.Model.cache[name])) {
          Dagaz.Model.cache[name] = [];
      }
      var offset = param;
      if (_.isUndefined(Dagaz.Model.cache[name][offset])) {
          Dagaz.Model.cache[name][offset] = function(x) {
              return (Dagaz.Model.commands[name])(x, offset);
          }
      }
      this.commands.push(Dagaz.Model.cache[name][offset]);
  }
}

function ZrfMoveGenerator(design, mode) {
  this.move     = new ZrfMove(mode);
  this.start    = mode;
  this.moveType = 1;
  this.template = null;
  this.params   = null;
  this.mode     = null;
  this.board    = null;
  this.pos      = null;
  this.parent   = null;
  this.pieces   = [];
  this.values   = [];
  this.attrs    = [];
  this.stack    = [];
  this.marks	= [];
  this.cmd      = 0;
  this.level    = 1;
  this.design   = design;
}

Dagaz.Model.createGen = function(template, params, design, mode) {
  if (_.isUndefined(design)) {
      design = Dagaz.Model.getDesign();
  }
  var r = new ZrfMoveGenerator(design, mode);
  r.template = template;
  r.params   = Dagaz.int32Array(params);
  return r;
}

ZrfMoveGenerator.prototype.init = function(board, pos) {
  this.board    = board;
  this.pos      = +pos;
}

ZrfMoveGenerator.prototype.clone = function() {
  var r = new ZrfMoveGenerator(this.design, this.start);
  r.template = this.template;
  r.params   = this.params;  
  r.level    = this.level;
  r.parent   = this.parent;
  r.cmd      = this.cmd;
  r.mode     = this.mode;
  r.board    = this.board;
  r.pos      = this.pos;
  _.each(this.marks, function(it) { r.marks.push(it); });
  _.each(this.stack, function(it) { r.stack.push(it); });
  _.each(_.keys(this.pieces), function(pos) {
      r.pieces[pos] = this.pieces[pos];
  }, this);
  _.each(_.keys(this.values), function(name) {
      r.values[name] = [];
      _.each(_.keys(this.values[name]), function(pos) {
           r.values[name][pos] = this.values[name][pos];
      }, this);
  }, this);
  _.each(_.keys(this.attrs), function(pos) {
      r.attrs[pos] = [];
      _.each(_.keys(this.attrs[pos]), function(name) {
           r.attrs[pos][name] = this.attrs[pos][name];
      }, this);
  }, this);
  if (!_.isUndefined(this.from)) {
      r.from = this.from;
  }
  if (!_.isUndefined(this.piece)) {
      r.piece = this.piece;
  }
  r.move = this.move.clone(r.level);
  return r;
}

ZrfMoveGenerator.prototype.copy = function(template, params) {
  var r = Dagaz.Model.createGen(template, params, this.design, this.move.mode);
  r.level    = this.level + 1;
  r.parent   = this;
  r.board    = this.board;
  r.pos      = this.pos;
  r.move     = this.move.copy();
  return r;
}

ZrfMoveGenerator.prototype.getPos = function() {
  return this.pos;
}

ZrfMoveGenerator.prototype.movePiece = function(from, to, piece) {
  if (_.isUndefined(this.attrs[to])) {
      for (var name in this.attrs[to]) {
           piece = piece.setValue(name, this.attrs[to][name]);
      }
  }
  this.move.movePiece(from, to, piece, this.level);
  this.lastf = from;
  this.lastt = to;
  if (from != to) {
      this.setPiece(from, null);
  }
  this.setPiece(to, piece);
}

ZrfMoveGenerator.prototype.dropPiece = function(pos, piece) {
  this.move.dropPiece(pos, piece, this.level);
  this.setPiece(pos, piece);
}

ZrfMoveGenerator.prototype.isCaptured = function(pos, level) {
  if (this.parent) {
      return this.parent.isCaptured(pos, level);
  }
  if (_.isUndefined(this.captured)) {
      this.captured = [];
  }
  if (this.captured[pos] && (this.captured[pos] < level)) return true;
  _.each(Dagaz.Model.getDesign().allPositions(), function(p) {
      if (this.captured[p] && (this.captured[p] >= level)) {
          delete this.captured[p];
      }
  }, this);
  this.captured[pos] = level;
  return false;
}

ZrfMoveGenerator.prototype.capturePiece = function(pos) {
  if (Dagaz.Model.deferredStrike) {
      if (this.isCaptured(pos, this.level)) return false;
  }
  this.move.capturePiece(pos, this.level);
  if (!Dagaz.Model.deferredStrike) {
      this.setPiece(pos, null);
  }
  return true;
}

Dagaz.Model.getMark = function(gen) {
  if (gen.marks.length == 0) {
      return null;
  } else {
      var pos = gen.marks.pop();
      gen.marks.push(pos);
      return pos;
  }
}

ZrfMoveGenerator.prototype.getMark = function() {
  return Dagaz.Model.getMark(this);
}

Dagaz.Model.setMark = function(gen) {
  if (gen.marks.length > 0) {
      gen.marks.pop();
  }
  if (gen.pos !== null) {
      gen.marks.push(gen.pos);
  }
}

ZrfMoveGenerator.prototype.setMark = function() {
  Dagaz.Model.setMark(this);
}

ZrfMoveGenerator.prototype.getPieceInternal = function(pos) {
  if (!_.isUndefined(this.pieces[pos])) {
      return this.pieces[pos];
  }
  if (this.parent !== null) {
      return this.parent.getPieceInternal(pos);
  }
  return this.board.getPiece(pos);
}

Dagaz.Model.getPiece = function(gen, pos) {
  if (gen.parent !== null) {
      return gen.parent.getPieceInternal(pos);
  }
  return gen.board.getPiece(pos);
}

ZrfMoveGenerator.prototype.getPiece = function(pos) {
  return Dagaz.Model.getPiece(this, pos);
}

ZrfMoveGenerator.prototype.setPiece = function(pos, piece) {
  this.pieces[pos] = piece;
}

Dagaz.Model.isLastFrom = function(pos, board) {
  if (!_.isUndefined(board.lastf)) {
      return (board.lastf == pos)
  } else {
      return false;
  }
}

ZrfMoveGenerator.prototype.isLastFrom = function(pos) {
  if (this.parent !== null) {
      if (!_.isUndefined(this.parent.lastf)) {
          return (this.parent.lastf == pos);
      } else {
          return false;
      }
  }
  return Dagaz.Model.isLastFrom(pos, this.board);
}

Dagaz.Model.isLastTo = function(pos, board) {
  if (!_.isUndefined(board.lastt)) {
      return (board.lastt == pos)
  } else {
      return false;
  }
}

ZrfMoveGenerator.prototype.isLastTo = function(pos) {
  if (this.parent !== null) {
      if (!_.isUndefined(this.parent.lastt)) {
          return (this.parent.lastt == pos);
      } else {
          return false;
      }
  }
  return Dagaz.Model.isLastTo(pos, this.board);
}

Dagaz.Model.getValueInternal = function(aThis, name, pos) {
  return null;
}

ZrfMoveGenerator.prototype.getValue = function(name, pos) {
  if (!_.isUndefined(this.values[name])) {
      if (!_.isUndefined(this.values[name][pos])) {
          return this.values[name][pos];
      }
  }
  return Dagaz.Model.getValueInternal(this, name, pos);
}

ZrfMoveGenerator.prototype.setValue = function(name, pos, value) {
  if (_.isUndefined(this.values[name])) {
      this.values[name] = [];
  }
  this.values[name][pos] = value;
}

Dagaz.Model.getAttrInternal = function(gen, name, pos) {
  return null;
}

ZrfMoveGenerator.prototype.getAttr = function(name, pos) {
  var piece = this.getPiece(pos);
  if (piece !== null) {
      return piece.getValue(name);
  }
  return Dagaz.Model.getAttrInternal(this, name, pos);
}

ZrfMoveGenerator.prototype.setAttr = function(name, pos, value) {
  if (_.isUndefined(this.attrs[pos])) {
      this.attrs[pos] = [];
  }
  this.attrs[pos][name] = value;
  var piece = this.getPieceInternal(pos);
  if (piece !== null) {
      piece = piece.setValue(name, value);
      this.move.movePiece(pos, pos, piece, this.level);
      this.setPiece(pos, piece);
  }
}

ZrfMoveGenerator.prototype.generate = function() {
//Dagaz.KPI.open("generate", "succeed");
  var succeed = true;
  while (this.cmd < this.template.commands.length) {
     var r = (this.template.commands[this.cmd++])(this);
     if (r === null) {
         succeed = false;
         break;
     }
     this.cmd += r;
     if (this.cmd < 0) {
         succeed = false;
         break;
     }
  }
  this.cmd = 0;
  if (succeed) {
// ? Dagaz.KPI.set("actions", this.move.actions.length, "generate", "succeed");
//   Dagaz.KPI.close("generate");
     this.completed = true;
/*} else {
     Dagaz.KPI.close("generate", "failed"); */
  }
}

function ZrfPiece(type, player) {
  this.type   = type;
  this.player = player;
}

Dagaz.Model.createPiece = function(type, player) {
  if (_.isUndefined(Dagaz.Model.cachePiece)) {
      Dagaz.Model.cachePiece = [];
  }
  if (_.isUndefined(Dagaz.Model.cachePiece[player])) {
      Dagaz.Model.cachePiece[player] = [];
  }
  if (_.isUndefined(Dagaz.Model.cachePiece[player][type])) {
      Dagaz.Model.cachePiece[player][type] = new ZrfPiece(type, player);
  }
  return Dagaz.Model.cachePiece[player][type];
}

Dagaz.Model.pieceToString = function(piece) {
  return piece.getOwner() + " " + piece.getType();
}

ZrfPiece.prototype.toString = function() {
  return Dagaz.Model.pieceToString(this);
}

ZrfPiece.prototype.getType = function() {
  var design = Dagaz.Model.getDesign();
  return design.pieceNames[this.type];
}

ZrfPiece.prototype.getOwner = function() {
  var design = Dagaz.Model.getDesign();
  return design.playerNames[this.player];
}

ZrfPiece.prototype.getValue = function(name) {
  if (!_.isUndefined(this.values)) {
     if (!_.isUndefined(this.values[name])) {
         return this.values[name];
     }
  }
  var design = Dagaz.Model.getDesign();
  return design.getAttribute(this.type, name);
}

ZrfPiece.prototype.setValue = function(name, value) {
  if (this.getValue(name) == value) {
      return this;
  }
  var piece = new ZrfPiece(this.type, this.player);
  if (_.isUndefined(piece.values)) {
     piece.values = [];
  }
  piece.values[name] = value;
  return piece;
}

ZrfPiece.prototype.promote = function(type) {
  return Dagaz.Model.createPiece(type, this.player);
}

ZrfPiece.prototype.changeOwner = function(player) {
  if (this.player == player) {
      return this;
  } else {
      return Dagaz.Model.createPiece(this.type, player);
  }
}

ZrfPiece.prototype.flip = function() {
  var design = Dagaz.Model.getDesign();
  return Dagaz.Model.createPiece(this.type, design.nextPlayer(this.player));
}

Dagaz.Model.BuildDesign = function(design) {}

Dagaz.Model.InitGame = function() {
  var design = Dagaz.Model.getDesign();
  this.BuildDesign(design);
}

function ZrfBoard(game) {
  this.game     = game;
  this.zSign    = 0;
  this.pieces   = [];
  this.forks    = [];
  this.turn     = 0;
  this.player   = Dagaz.Model.getDesign().currPlayer(this.turn);
  this.changed  = [];
  this.parent   = null;
  this.values   = [];
}

ZrfBoard.prototype.getValue = function(name) {
  if (_.isUndefined(this.values[name])) {
      return null;
  } else {
      return this.values[name];
  }
}

ZrfBoard.prototype.setValue = function(name, value) {
  if (value === null) {
      delete this.values[name];
  } else {
      this.values[name] = value;
  }
}

ZrfBoard.prototype.traceMoves = function() {
  var signs = [];
  var moves = [];
  var board = this;
  while (board.parent) {
      if (board.zSign != 0) {
          if (_.indexOf(signs, board.zSign) >= 0) {
              var f = true;
              while (f) {
                 moves.pop();
                 f = signs.pop() != board.zSign;
              }
          }
      }
      if (board.move) {
          signs.push(board.zSign);
          moves.push(board.move);
      }
      board = board.parent;
  }
  return moves.reverse();
}

Dagaz.Model.checkGoals = function(design, board, player) {
  var r = null;
  _.each(_.keys(design.goals), function(p) {
      var groups = _.groupBy(design.goals[p], function(goal) {
          return goal.num;
      });
      var goals  = _.map(_.keys(groups), function(num) {
          return groups[num];
      });
      var s = _.reduce(goals, function(acc, goal) {
          if (_.reduce(goal, function(acc, g) {
                   var type = g.piece;
                   if (!_.reduce(g.positions, function(acc, pos) {
                             var piece = board.getPiece(pos);
                             if ((piece !== null) && 
                                 (piece.player == p) &&
                                 (piece.type == type)) return true;
                             return acc;
                          }, false)) return false;
                   return acc;
                }, true)) return true;
          return acc;
      }, false); 
      if (s) {
          r = (p == player) ? 1: -1; 
      }
  });
  return r;
}

ZrfBoard.prototype.checkGoals = function(design, player) {
  if (!player) {
      player = this.player;
  }
  return Dagaz.Model.checkGoals(design, this, player);
}

Dagaz.Model.setup = function(board) {}

ZrfBoard.prototype.setup = function(view) {
  Dagaz.Model.setup(this);
  view.clear();
  _.each(_.keys(this.pieces), function(pos) {
     var piece = this.pieces[pos];
     if (piece !== null) {
         view.addPiece(piece.toString(), pos, piece);
     }
  }, this);
}

ZrfBoard.prototype.copy = function() {
  var r = new ZrfBoard(this.game);
  r.parent  = this;
  r.player  = this.player;
  r.zSign   = this.zSign;
  r.reserve = this.reserve;
  r.lastf   = this.lastf;
  r.lastt   = this.lastt;
  _.each(_.keys(this.pieces), function(pos) {
      r.pieces[pos] = this.pieces[pos];
  }, this);
  return r;
}

Dagaz.Model.getInitBoard = function() {
  if (_.isUndefined(Dagaz.Model.board)) {
      var design = Dagaz.Model.getDesign();
      Dagaz.Model.board = new ZrfBoard(Dagaz.Model);
      Dagaz.Model.board.reserve = design.reserve;
  }
  return Dagaz.Model.board;
}

ZrfBoard.prototype.clear = function() {
  this.zSign    = 0;
  this.pieces   = [];
}

ZrfBoard.prototype.addFork = function(gen) {
  if (!_.isUndefined(Dagaz.Model.movesLimit)) {
      if (this.forks.length >= Dagaz.Model.movesLimit) {
          this.failed = true;
          return;
      }
  }
  this.forks.push(gen);
}

ZrfBoard.prototype.getPiece = function(pos) {
  if (_.isUndefined(this.pieces[pos])) {
      return null;
  } else {
      return this.pieces[pos];
  }
}

ZrfBoard.prototype.setPiece = function(pos, piece) {
  if (!_.isUndefined(this.pieces[pos])) {
      var op = this.pieces[pos];
      this.zSign = Dagaz.Model.zupdate(this.zSign, op, pos);
  }
  if (piece === null) {
     delete this.pieces[pos];
  } else {
     this.pieces[pos] = piece;
     this.zSign = Dagaz.Model.zupdate(this.zSign, piece, pos);
  }
}

ZrfBoard.prototype.addMove = function(move) {
  this.moves.push(move);
}

ZrfBoard.prototype.changeMove = function(move) {
  if (this.moves.length > 0) {
      this.moves.pop();
  }
  this.moves.push(move);
}

ZrfBoard.prototype.getSignature = function() {
  return this.zSign;
}

Dagaz.Model.PostActions = function(board) {
  board.moves = _.filter(board.moves, function(m) { 
       return (_.isUndefined(m.failed));
  });
}

Dagaz.Model.CheckInvariants = function(board) {}
Dagaz.Model.Extension = function(board) {}

Dagaz.Model.getPartList = function(board, gen) {
  return [ gen.lastt ];
}

var addPrior = function(priors, mode, gen) {
  var ix = 0;
  if (gen.design.modes.length > 0) {
      ix = Dagaz.find(gen.design.modes, mode);
  }
  if (ix >= 0) {
      if (_.isUndefined(priors[ix])) {
          priors[ix] = [];
      }
      priors[ix].push(gen);
  }
}

var CompleteMove = function(board, gen) {
  var positions = Dagaz.Model.getPartList(board, gen);
  if (!Dagaz.Model.passPartial) { var t = 2; } 
      else { var t = 1; }
  while (positions.length > 0) {
       pos = positions.pop();
       var piece = gen.getPieceInternal(pos);
       if ((piece !== null) && (Dagaz.Model.isFriend(piece, board.player) || Dagaz.Model.sharedPieces)) {
           _.each(board.game.design.pieces[piece.type], function(move) {
                if ((move.type == 0) && (move.mode == gen.mode)) {
                    var g = gen.copy(move.template, move.params);
                    g.moveType = t;
                    g.generate();
                    if (g.completed && (g.moveType == 0)) {
                        CompleteMove(board, g);
                        t = 1;
                    }
                }
           }, this);
       }
  }
}

ZrfBoard.prototype.generateInternal = function(callback, cont) {
  var design = this.game.design;
  if (_.isUndefined(this.moves)) {
      this.moves = [];
  } else {
      return;
  }
  Dagaz.KPI.stage("init");
  if ((this.moves.length == 0) && !design.failed && (this.player > 0)) {
      var priors = [];
      _.chain(_.keys(this.pieces))
       .filter(function(pos)  
          { return Dagaz.Model.sharedPieces || 
                   Dagaz.Model.isFriend(this.pieces[pos], this.player); 
          }, this)
       .each(function(pos) {
           var piece = this.pieces[pos];
           _.chain(design.pieces[piece.type])
            .filter(function(move) { return (move.type == 0); })
            .each(function(move) {
                var g = Dagaz.Model.createGen(move.template, move.params, this.game.design, move.mode);
                g.init(this, pos);
                addPrior(priors, move.mode, g);
            }, this);
        }, this);
      _.each(design.positions, function(pos) {
        _.chain(design.pieces)
         .filter(function(tp) { return !Dagaz.Model.noReserve(this, tp); }, this)
         .each(function(tp) {
               _.chain(design.pieces[tp])
                .filter(function(move) { return (move.type == 1); })
                .each(function(move) {
                    var g = Dagaz.Model.createGen(move.template, move.params, this.game.design, move.mode);
                    g.init(this, pos);
                    g.piece = new ZrfPiece(tp, this.player);
                    addPrior(priors, move.mode, g);
                }, this);
           }, this);
      }, this);
      Dagaz.KPI.set("modes", priors.length);
      var high = null;
      var low  = 0;
      for (var i = 0; i <= design.modes.length; i++) {
          if (!_.isUndefined(priors[i])) {
              if (high === null) {
                  high = priors[i].length;
              } else {
                  low += priors[i].length;
             }
          }
      }
      if (high !== null) {
          Dagaz.KPI.set("moves", high + low);
          Dagaz.KPI.set("high", high);
          Dagaz.KPI.set("low", low);
      }
      Dagaz.KPI.stage("generate");
      this.forks = [];
      if (callback.checkContinue()) {
          for (var i = 0; i <= design.modes.length; i++) {
               var f = false;
               if (!_.isUndefined(priors[i])) {
                   while (priors[i].length > 0) {
                      var g = priors[i].pop();
                      g.generate();
                      if (g.completed && !g.move.isPass()) {
                          if (cont && (g.moveType == 0)) {
                              CompleteMove(this, g);
                          }
                          f = true;
                      }
                   }
               }
               if (f) break;
               if (i >= design.modes.length) break;
          }
          while (this.forks.length > 0) {
               var g = this.forks.pop();
               g.generate();
               if (g.completed) {
                     if (cont && (g.moveType == 0)) {
                        CompleteMove(this, g);
                     }
               }
          }
      }
      Dagaz.KPI.set("moves", this.moves.length);
      Dagaz.KPI.stage("extension");
      Dagaz.Model.Extension(this);
      Dagaz.KPI.set("moves", this.moves.length);
      if (cont) {
          Dagaz.KPI.stage("invariant");
          Dagaz.Model.CheckInvariants(this);
          Dagaz.Model.PostActions(this);
          if (Dagaz.Model.passTurn == 1) {
              this.moves.push(new ZrfMove());
          }
          if (Dagaz.Model.passTurn == 2) {
              if (this.moves.length == 0) {
                  this.moves.push(new ZrfMove());
              }
          }
          Dagaz.KPI.set("moves", this.moves.length);
      }
  }
}

ZrfBoard.prototype.generate = function(design) {
  this.generateInternal(this, true);
}

ZrfBoard.prototype.checkContinue = function() {
  return true;
}

Dagaz.Model.decReserve = function(board, piece) {
  if (!_.isUndefined(board.reserve[piece.type])) {
      if (!_.isUndefined(board.reserve[piece.type][piece.player])) {
          board.reserve[piece.type][piece.player]--;
      }
  }
}

Dagaz.Model.incReserve = function(board, piece) {
  if (!_.isUndefined(board.reserve[piece.type])) {
      if (!_.isUndefined(board.reserve[piece.type][piece.player])) {
          board.reserve[piece.type][piece.player]++;
      }
  }
}

Dagaz.Model.noReserve = function(board, piece) {
  if (!_.isUndefined(board.reserve[piece])) {
      if (!_.isUndefined(board.reserve[piece][board.player])) {
          return (board.reserve[piece][board.player] <= 0);
      }
  }
  return false;
}

ZrfBoard.prototype.movePiece = function(move, from, to, piece) {
  this.lastf = from;
  this.lastt = to;
  this.lastc = to;
  if ((piece === null) && this.parent) {
      piece = this.parent.getPiece(from);
  }
  if (piece === null) {
      piece = this.getPiece(from);
  }
  if (Dagaz.find(this.changed, from) < 0) {
      this.setPiece(from, null);
  }
  this.setPiece(to, piece);
  this.changed.push(to);
}

ZrfBoard.prototype.dropPiece = function(move, pos, piece) {
  this.lastt = pos;
  Dagaz.Model.decReserve(this, piece);
  this.setPiece(pos, piece);
  this.changed.push(pos);
}

ZrfBoard.prototype.capturePiece = function(move, pos) {
  if (Dagaz.Model.recycleCaptures) {
      var piece = this.getPiece(pos);
          if (piece != null) {
              Dagaz.Model.incReserve(this, piece);
          }
  }
  this.setPiece(pos, null);
  this.changed = _.filter(this.changed, function(p) {
     return p != pos; 
  });
}

ZrfBoard.prototype.commit = function(move) {
  this.changed = [];
}

ZrfBoard.prototype.apply = function(move) {
  if (!_.isUndefined(move.result)) return move.result;
  var design = Dagaz.Model.design;
  var r = this.copy();
  move.applyAll(r);
  r.turn = design.nextTurn(this);
  r.player = design.currPlayer(r.turn);
  r.move = move;
  return r;
}

function ZrfMove(mode) {
  this.actions  = [];
  if (_.isUndefined(mode)) {
      this.mode = 0;
  } else {
      this.mode = mode;
  }
}

Dagaz.Model.createMove = function(mode) {
  return new ZrfMove(mode);
}

Dagaz.Model.compareMove = function(move, notation) {
  return (move.toString() == notation);
}

var cartesian = function(r, prefix, arr) {
   if (arr.length > 0) {
       _.each(_.first(arr), function (n) {
          var x = _.clone(prefix);
          x.push(n);
          cartesian(r, x, _.rest(arr));
       });
   } else {
       r.push(prefix);
   }
}

_.mixin({
  cartesian: function(x) {
     var r = [];
     cartesian(r, [], x);
     return r;
  }
});

ZrfMove.prototype.getControlList = function() {
  return _.chain(this.actions)
   .map(function (action) {
        return _.chain(_.range(3))
         .map(function (ix) {
              if (action[ix] === null) {
                  return 0;
              } else {
                  return action[ix].length;
              }
          })
         .filter(function (n) { return n > 1; })
         .value();
    })
   .flatten()
   .map(function (n) { return _.range(n); })
   .cartesian()
   .value();
}

var pushItem = function(r, list, control, ix) {
   if ((list === null) || (list.length < 1) || 
       (list.length == 1) || (ix >= control.length)) {
       r.push(list);
       return ix;
   }
   if (list[control[ix]] === null) {
       r.push(null);
   } else {
       r.push([list[control[ix]]]);
   }
   return ix + 1;
}

var isValidAction = function(action) {
   return (action[0] !== null) || (action[1] !== null);
}

var isValidMove = function(move) {
   return 1 >= _.chain(move.actions)
    .filter(function (action) {
        return (action[1] === null);
     })
    .map(function (action) {
        return action[0][0];
     })
    .countBy()
    .values()
    .max()
    .value();
}

ZrfMove.prototype.determinate = function() {
  var c = this.getControlList();
  if (c.length > 1) {
      return _.chain(c)
       .map(function (l) {
           var r = new ZrfMove(this.mode);
           var pos = 0;
           _.each(this.actions, function (action) {
              var x = [];
              _.each(_.range(3), function (ix) {
                 pos = pushItem(this, action[ix], l, pos);
              }, x);
              x.push(action[3]);
              if (isValidAction(x)) {
                  this.actions.push(x);
              }
           }, r);
           return r;
        }, this)
       .filter(isValidMove)
       .value();
  } else {
      return [ this ];
  }
}

ZrfMove.prototype.copy = function() {
  var r = new ZrfMove(this.mode);
  r.actions = _.filter(this.actions);
  return r;
}

ZrfMove.prototype.clone = function(level) {
  var r = new ZrfMove(this.mode);
  var o = true;
  r.actions = _.chain(this.actions)
   .filter(function(action) {
        if ((action[0] !== null) && (action[1] !== null) && o) {
            if (Dagaz.Model.discardCascades) {
                o = false;
            }
            return true;
        }
        if (Dagaz.Model.forkMode || (Math.abs(action[3]) < level)) {
            return true;
        }
        return false;
    })
   .value();
  return r;
}

Dagaz.Model.moveToString = function(move, part) {
  if (move.actions.length == 0) {
      return "Pass";
  }
  var r = "";
  var l = "";
  var n = function(action) {
        var p = action[3];
        if (p < 0) {
            p = -p;
        }
        if (part == 0) {
            p = 0;
        }
        return (p == part);
  };
  _.chain(move.actions)
   .filter(n)
   .filter(function(action) {
       return (action[0] !== null) && (action[1] !== null) && 
              (action[0] != action[1]) && (action[0][0] != action[1][0]);
    })
   .each(function(action) {
       if (l !== action[0][0]) {
           if (r.length > 0) {
               r = r + " ";
           }
           r = r + Dagaz.Model.posToString(action[0][0]);
       }
       r = r + " - ";
       r = r + Dagaz.Model.posToString(action[1][0]);
       l = action[1][0];
    });
  _.chain(move.actions)
   .filter(n)
   .filter(function(action) {
       return (action[0] !== null) && (action[1] === null);
    })
   .each(function(action) {
       if (r.length > 0) {
           r = r + " ";
       }
       r = r + "x ";
       r = r + Dagaz.Model.posToString(action[0][0]);
       l = action[0][0];
    });
  return r;
}

ZrfMove.prototype.toString = function(part) {
  return Dagaz.Model.moveToString(this, part ? part : 0 );
}

ZrfMove.prototype.isAttacked = function(pos) {
  return _.chain(this.actions)
   .filter(function(action) {
       var fp = action[0];
       var tp = action[1];
       if ((fp !== null) && (fp[0] == pos) && (tp === null)) {
          return true;
       }
       if ((tp !== null) && (tp[0] == pos) && (fp !== null) && (fp[0] != tp[0])) {
          return true;
       }
       return false;
    })
   .size()
   .value() > 0;
}

ZrfMove.prototype.applyTo = function(obj, part) {
  if (!part) part = 1;
  var r = false;
  var n = function (action) {
      return (action[3] == part);
    };
  _.chain(this.actions)
   .filter(n)
   .filter(function (action) {
      return (action[0] !== null) && (action[1] !== null);
    })
   .each(function (action) {
      obj.movePiece(this, action[0][0], action[1][0], (action[2] === null) ? null : action[2][0], action[3]);
      r = true;
    }, this);
  _.chain(this.actions)
   .filter(n)
   .filter(function (action) {
      return (action[0] === null) && (action[1] !== null) && (action[2] !== null);
    })
   .each(function (action) {
      obj.dropPiece(this, action[1][0], action[2][0], action[3]);
      r = true;
    }, this);
  _.chain(this.actions)
   .filter(n)
   .filter(function (action) {
      return (action[0] !== null) && (action[1] === null);
    })
   .each(function (action) {
      obj.capturePiece(this, action[0][0], action[3]);
      r = true;
    }, this);
  _.chain(this.actions)
   .filter(n)
   .filter(function (action) {
      return (action[0] === null) && (action[1] === null) && (action[2] !== null);
    })
   .each(function (action) {
      action[2][0].exec(obj);
    });
  if (r) {
      obj.commit(this);
  }
  return r;
}

ZrfMove.prototype.applyAll = function(obj) {
  var mx = _.chain(this.actions)
   .map(function(action) {
      return action[3];
    })
   .push(0)
   .max()
   .value();
  if (mx > 0) {
      _.chain(_.range(1, mx + 1))
       .each(function (part) {
          this.applyTo(obj, part);
       }, this);
  }
}

ZrfMove.prototype.movePiece = function(from, to, piece, part) {
  if (!part) part = 1;
  if (piece === null) {
      this.actions.push([ [from], [to], null, part]);
  } else {
      this.actions.push([ [from], [to], [piece], part]);
  }
}

ZrfMove.prototype.dropPiece = function(pos, piece, part) {
  if (!part) part = 1;
  this.actions.push([null, [pos], [piece], part]);
}

ZrfMove.prototype.capturePiece = function(pos, part) {
  if (!part) part = 1;
  this.actions.push([ [pos], null, null, part]);
}

ZrfMove.prototype.getTarget = function() {
  for (var i = 0; i < this.actions.length; i++) {
       var a = this.actions[i];
       if ((a[0] !== null) && (a[1] !== null)) {
           return a[1][0];
       }
  }
  return null;
}

ZrfMove.prototype.setValue = function(name, value, part) {
  if (!part) part = 1;
  this.actions.push([ null, null, [{
      exec: function(obj) {
          if (obj.setValue) {
              obj.setValue(name, value);
          }
      }
  }], part]);
}

ZrfMove.prototype.addValue = function(name, value, part) {
  if (!part) part = 1;
  this.actions.push([ null, null, [{
      exec: function(obj) {
          if (obj.getValue && obj.setValue) {
              var acc = obj.getValue(name);
              if (!acc) acc = 0;
              acc += value;
              obj.setValue(name, acc);
          }
      }
  }], part]);
}

ZrfMove.prototype.isPass = function() {
  return this.actions.length == 0;
}

ZrfMove.prototype.clarify = function(move) {
  if ((move.actions.length == 1) && (move.actions[0][0] !== null) && (move.actions[0][1] !== null)) {
      _.each(this.actions, function(a) {
          if ((a[0] !== null) && (a[1] !== null) && (a[0][0] == move.actions[0][0][0]) && (a[1][0] == move.actions[0][1][0])) {
              a[2] = move.actions[0][2];
          }
      });
  }
}

})();

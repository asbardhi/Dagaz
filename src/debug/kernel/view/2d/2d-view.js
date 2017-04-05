(function() {

Dagaz.View.markType = {
   TARGET:    0,
   ATTACKING: 1
};

var STEP_CNT     = 5;

var self         = null;
var isConfigured = false;
var isValid      = false;
var mouseX       = 0;
var mouseY       = 0;
var mousePressed = false;
var hintedPiece  = null;
var fromPos      = null;

Dagaz.View.configure = function(view) {}

function View2D() {
  this.pos     = [];
  this.res     = [];
  this.piece   = [];
  this.board   = [];
  this.setup   = [];
  this.target  = [];
  this.strike  = [];
  this.changes = [];
}

Dagaz.View.getView = function() {
  if (_.isUndefined(Dagaz.View.view)) {
      Dagaz.View.view = new View2D();
  }
  return Dagaz.View.view;
}

Dagaz.View.inRect = function(view, pos, x, y) {
  return (x > view.pos[pos].x) &&
         (y > view.pos[pos].y) &&
         (x < view.pos[pos].x + view.pos[pos].dx) &&
         (y < view.pos[pos].y + view.pos[pos].dy);
}

Dagaz.View.pointToPositions = function(view, x, y) {
  var list = _.chain(view.setup)
   .map(function(piece) {
       return piece.pos;
    })
   .filter(function(pos) {
      return Dagaz.View.inRect(view, pos, x, y);
    })
   .sortBy(function(pos) {
       return -pos;
    })
   .value();
  if (list.length > 0) {
      return list.slice(0, 1);
  }
  return _.chain(_.range(view.pos.length))
   .filter(function(pos) {
      return Dagaz.View.inRect(view, pos, x, y);
    })
   .value();
}

View2D.prototype.pointToPositions = function(x, y) {
  return Dagaz.View.pointToPositions(this, x, y);
}

var posToIx = function(view, pos) {
  for (var i = 0; i < view.setup.length; i++) {
       if (view.setup[i].pos == pos) {
           return i;
       }
  }
  return null;
}

View2D.prototype.defPosition = function(name, x, y, dx, dy) {
  this.pos.push({
      name: name,
      x:    x,
      y:    y,
      dx:   dx,
      dy:   dy
  });
}

View2D.prototype.defBoard = function(img, x, y) {
  var board = {
     h: document.getElementById(img),
     x: x ? x : 0,
     y: y ? y : 0
  };
  this.res.push(board);
  this.board.push(board);
}

View2D.prototype.defPiece = function(img, name, help, glyph) {
  var piece = {
     h:    document.getElementById(img),
     name: name
  };
  if (glyph) {
     piece.glyph = document.getElementById(glyph);
  }
  if (help) {
     piece.help = help;
  }
  this.res.push(piece);
  this.piece[name] = piece;
}

View2D.prototype.allResLoaded = function() {
  if (this.allDone) return true;
  for (var i = 0; i < this.res.length; i++) {
       var image = this.res[i].h;
       if (!image.complete || (image.naturalWidth == 0)) return false;
       this.res[i].dx = image.naturalWidth;
       this.res[i].dy = image.naturalHeight;
  }
  this.allDone = true;
  return true;
}

View2D.prototype.clear = function() {
  this.setup = [];
}

View2D.prototype.addPiece = function(piece, pos) {
  this.setup.push({
       pos:  +pos,
       name: piece,
       x:    this.pos[pos].x,
       y:    this.pos[pos].y
  });
}

View2D.prototype.markPositions = function(type, positions) {
  if (type == Dagaz.View.markType.TARGET) {
      this.target = positions;
  } else {
      this.strike = positions;
  }
  this.invalidate();
}

View2D.prototype.capturePiece = function(pos) {
  var ix = posToIx(this, from);
  if (ix === null) return;
  this.changes.push({
      from:  from,
      op:    ix
  });
}

View2D.prototype.dropPiece = function(pos, piece) {
  this.changes.push({
      to:    to,
      np:    piece.toString()
  });
}

View2D.prototype.movePiece = function(from, to, piece) {
  var ix = posToIx(this, from);
  if (ix === null) return;
  this.changes.push({
      from:  from,
      to:    to,
      op:    ix,
      np:    (piece === null) ? null : piece.toString(),
      dx:    ((this.pos[to].x - this.pos[from].x) / STEP_CNT) | 0,
      dy:    ((this.pos[to].y - this.pos[from].y) / STEP_CNT) | 0
  });
}

View2D.prototype.commit = function() {
   var steps = STEP_CNT;
   var moves = _.filter(this.changes, function(frame) {
       return !_.isUndefined(frame.from) && !_.isUndefined(frame.to);
   });
   if (moves.length == 0) {
       steps = 1;
   }
   _.each(this.changes, function(frame) {
       frame.cnt = steps;
   });
   this.invalidate();
}

var drawMarks = function(ctx, view, list, color) {
   _.each(list, function(p) {
        var pos = this.pos[p];
        var x = pos.x; var y = pos.y;
        if (pos.dx > 0) {
            x += pos.dx / 2 | 0;
        }
        if (pos.dy > 0) {
            y += pos.dy / 2 | 0;
        }
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, pos.dx / 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
   }, view);
}

View2D.prototype.invalidate = function() {
   isValid = false;
}

var isCommitted = function(frame) {
  return !_.isUndefined(frame.cnt);
}

var isDone = function(frame) {
  return frame.cnt <= 0;
}

View2D.prototype.animate = function() {
    this.changes = _.filter(this.changes, function(frame) {
        return _.isUndefined(frame.done);
    });
  _.chain(this.changes)
   .filter(isCommitted)
   .each(function(frame) {
        if (!_.isUndefined(frame.op)) {
            var piece = this.setup[frame.op];
            if (!_.isUndefined(frame.dx)) {
                piece.x += frame.dx;
            }
            if (!_.isUndefined(frame.dy)) {
                piece.y += frame.dy;
            }
            piece.z = 1;
        }
        frame.cnt--;
    }, this);
  var captured = _.chain(this.changes)
   .filter(isCommitted)
   .filter(isDone)
   .map(function(frame) {
       if (_.isUndefined(frame.to)) {
           return frame.from;
       } else {
           return frame.to;
       }
    })
   .map(function(pos) {
       return posToIx(this, pos);
    }, this)
   .compact()
   .value();
  _.chain(this.changes)
   .filter(isCommitted)
   .filter(isDone)
   .each(function(frame) {
        if (!_.isUndefined(frame.op) && !_.isUndefined(frame.to)) {
            var piece = this.setup[frame.op];
            if (frame.np) {
                piece.name = frame.np;
            }
            piece.pos = +frame.to;
            piece.x = this.pos[frame.to].x;
            piece.y = this.pos[frame.to].y;
            delete piece.z;
        }
        if (_.isUndefined(frame.op) && !_.isUndefined(frame.to)) {
            this.setup.push({
                pos:  frame.to,
                name: frame.np,
                x:    this.pos[frame.to].x,
                y:    this.pos[frame.to].y
            });
        }
        frame.done = true;
    }, this);
    this.setup = _.chain(_.range(this.setup.length))
    .filter(function(ix) {
        return _.indexOf(captured, ix) < 0;
     })
    .map(function(ix) {
        return this.setup[ix];
     }, this)
    .value();
    if (this.changes.length == 0) {
        isValid = true;
    }
}

Dagaz.View.showMarks = function(view, ctx) {
  drawMarks(ctx, view, view.target, "#00AA00");
  drawMarks(ctx, view, view.strike, "#FF0000");
}

View2D.prototype.draw = function(canvas) {
  if (!isConfigured) {
      Dagaz.View.configure(this);
      var board = Dagaz.Model.getInitBoard();
      board.setup(this);
      isConfigured = true;
  }
  if (this.allResLoaded() && !isValid) {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      _.each(this.board, function(b) {
           ctx.drawImage(b.h, b.x, b.y);
      });
      _.chain(_.range(this.setup.length))
       .sortBy(function(ix) {
           var piece = this.setup[ix];
           var order = piece.pos;
           if (!_.isUndefined(piece.z)) {
               order += this.pos.length;
           }
           return order;
        }, this)
       .map(function(ix) {
           return this.setup[ix];
        }, this)
       .each(function(p) {
           var x = p.x; var y = p.y;
           var pos = this.pos[p.pos];
           var piece = this.piece[p.name];
           x += (pos.dx - piece.dx) / 2 | 0;
           y += (pos.dy - piece.dy) / 2 | 0;
           ctx.drawImage(piece.h, x, y);
        }, this);
      Dagaz.View.showMarks(this, ctx);
      this.animate();
  }
}

var debug = function(text) {
  PieceInfoText.innerHTML = text;
  PieceInfo.style.display = "inline";
}

View2D.prototype.debugClick = function() {
  var pos = this.pointToPositions(mouseX, mouseY);
  if ((fromPos !== null) && (_.indexOf(pos, fromPos) < 0)) {
      this.movePiece(fromPos, pos, null);
      this.commit();
      this.markPositions(0, []);
      fromPos = null;
  } else {
      this.markPositions(0, pos);
      fromPos = pos[0];
  }
}

View2D.prototype.debugDrag = function() {
  var pos = this.pointToPositions(mouseX, mouseY);
  if (_.indexOf(pos, fromPos) < 0) {
      this.movePiece(fromPos, pos, null);
      this.commit();
      fromPos = null;
  }
}

Dagaz.View.showHint = function(view) {
  var pos = view.pointToPositions(mouseX, mouseY);
  var ix  = posToIx(view, pos);
  if (ix !== null) {
      var piece = view.piece[view.setup[ix].name];
      if (hintedPiece !== piece) {
          var text = piece.name;
          if (piece.help) {
              text = piece.help;
          }
          PieceInfoImage.src = piece.h.src;
          PieceInfoText.innerHTML = text;
          PieceInfo.style.display = "inline";
          hintedPiece = piece;
      }
  } else {
      PieceInfo.style.display = "none";
      hintedPiece = null;
  }
}

var mouseUpdate = function(event) {
  mouseX = (event.clientX + document.body.scrollLeft) - (Table.offsetLeft + CanvasCell.offsetLeft + Board.offsetLeft);
  mouseY = (event.clientY + document.body.scrollTop) - (Table.offsetTop + CanvasCell.offsetTop + Board.offsetTop);
}

var mouseMove = function(event) {
  mouseUpdate(event);
  Dagaz.View.showHint(self);
}

var mouseUp = function() { 
  self.debugDrag();
  mousePressed = false; 
  self.markPositions(0, []);
}

var mouseDown = function(event) { 
  mousePressed = true; 
  self.debugClick();
  event.preventDefault(); 
}

View2D.prototype.init = function(canvas) {
  self = this;
  canvas.onmousemove = mouseMove;
  canvas.onmouseup   = mouseUp;
  canvas.onmousedown = mouseDown;
}

})();

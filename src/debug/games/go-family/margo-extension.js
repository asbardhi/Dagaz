(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "margo-extension") {
      checkVersion(design, name, value);
  }
}

Dagaz.View.pointToPositions = function(view, x, y) {
  var list = _.chain(_.range(view.pos.length))
   .filter(function(pos) {
      return Dagaz.View.inRect(view, pos, x, y);
    })
   .filter(function(pos) {
      return view.posToIx(pos) === null;
    })
   .value();
  if (list.length != 0) {
      return list.slice(0, 1);
  } else {
      return null;
  }
}

})();

/**
 * Factory to manage the creation of player-states.
 */
app.factory('playerStateFactory', function(CONDITIONS_OPS) {

  var Variable = function(name, type, initial) {
    this.name = name || null;
    this.type = type || null;
    this.initial = initial || null;
  };

  var Modification = function(lhs, op, rhs) {
    this.lhs = lhs || null;
    this.op = op || null;
    this.rhs = rhs || null;
  };

  var createModification = function(lhs, op, rhs) {
    return new Modification(lhs, op, rhs);
  };

  var createVariable = function(name, type, initial) {
    
    var show = {
      name: name,
      type: type,
      initial: initial
    };

    return new Variable(name, type, initial);
  };

  var cleanup = function(data) {
    var result = [];

    for (var i = 0; i < data.length; i++)
    {
      if (data[i].name && data[i].name.length !== 0) {
        result.push(data[i]);
      }
    }
    return result;
  };

  return {
    createVariable: createVariable,
    cleanup: cleanup,
    createModification: createModification

  };
});
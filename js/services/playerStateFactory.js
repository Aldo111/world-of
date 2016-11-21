/**
 * Factory to manage the creation of player-states.
 */
app.factory('playerStateFactory', function(CONDITIONS_OPS) {

  var Variable = function(name, type, initial) {
    this.name = name || null;
    this.type = type || null;
    this.initial = initial || null;
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
    cleanup: cleanup

  };
});
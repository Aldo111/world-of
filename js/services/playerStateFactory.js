/**
 * Factory to manage the creation of player-states.
 */
app.factory('playerStateFactory', function(MOD_OPS) {

  var Variable = function(name, type, initial) {
    this.name = name || null;
    this.type = type || null;
    this.initial = initial || null;
    this.show = true;
  };

  var Modification = function(lhs, op, rhs) {
    this.lhs = lhs || null;
    this.op = op || null;
    this.rhs = rhs || null;
  };

  var evaluateModification = function(modification, data) {
    if (!data || !data.hasOwnProperty(modification.lhs)) {
      return false;
    }

    var [lhs, op, rhs] = [data[modification.lhs], modification.op,
      modification.rhs || null];

    if (typeof lhs === 'undefined') {
      return false;
    }

    switch (op) {
      case MOD_OPS.text.SET:
        lhs = rhs;
        break;
      case MOD_OPS.number.SET:
        lhs = parseFloat(rhs);
        break;
      case MOD_OPS.number.ADD:
        lhs = parseFloat(lhs) + parseFloat(rhs);
        break;
      case MOD_OPS.number.SUB:
        lhs = parseFloat(lhs) - parseFloat(rhs);
        break;
      case MOD_OPS.number.MULT:
        lhs = parseFloat(lhs) * parseFloat(rhs);
        break;
      case MOD_OPS.number.DIV:
        lhs = parseFloat(lhs) / parseFloat(rhs);
        break;
    }

    data[modification.lhs] = lhs;
  };

  var evaluateModifications = function(modifications, data) {
    for (var i = 0; i < modifications.length; i++) {
      evaluateModification(modifications[i], data);
    }
  };

  var createModification = function(lhs, op, rhs) {
    return new Modification(lhs, op, rhs);
  };

  var createVariable = function(name, type, initial) {
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
    createModification: createModification,
    evaluateModifications: evaluateModifications
  };
});
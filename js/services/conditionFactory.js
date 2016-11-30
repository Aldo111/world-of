/**
 * Factory to manage the creation of conditions.
 */
app.factory('ConditionFactory', function(CONDITIONS_OPS) {

  var Condition = function(lhs, op, rhs) {
    this.lhs = lhs || null;
    this.op = op || null;
    this.rhs = rhs || null;
  };

  var evaluateCondition = function(condition, data) {
    if (!data) {
      return false;
    }

    var [lhs, op, rhs] = [data[condition.lhs] || null, condition.op,
      condition.rhs];

    if (!lhs) {
      return false;
    }

    switch (op) {
      case CONDITIONS_OPS.links.CHOSEN:
        return lhs.indexOf(rhs) >= 0;
      case CONDITIONS_OPS.text.EQ:
        return lhs == rhs;
      case CONDITIONS_OPS.text.NEQ:
        return lhs != rhs;
      case CONDITIONS_OPS.number.GT:
        return lhs > parseFloat(rhs);
      case CONDITIONS_OPS.number.LT:
        return lhs < parseFloat(rhs);
      case CONDITIONS_OPS.number.GTE:
        return lhs >= parseFloat(rhs);
      case CONDITIONS_OPS.number.LTE:
        return lhs <= parseFloat(rhs);
      default:
        return false;
    }
  };

  var ConditionSet = function(conditions, op) {
    this.op = op || CONDITIONS_OPS.logical.AND;
    this.conditions = conditions || [];
  };

  var evaluateConditionSet = function(conditionSet, data) {
    var obj, evaluation, op = conditionSet.op;
    // Top level only - children will have been cleaned up by now
    if (conditionSet.conditions.length === 0) {
      return true;
    }
    for (var i = 0; i < conditionSet.conditions.length; i++) {
      obj = conditionSet.conditions[i];
      if (obj.conditions) {
        evaluation = evaluateConditionSet(obj, data);
      } else {
        evaluation = evaluateCondition(obj, data);
      }


      if (op == CONDITIONS_OPS.logical.OR) {
        if (evaluation) {
          return evaluation;
        } else {
          // We've reached the last OR without a true resolution
          if (i === conditionSet.conditions.length -1) {
            return false;
          }
          continue;
        }
      } else if (op == CONDITIONS_OPS.logical.AND) {
        if (!evaluation) {
          return false;
        }
      }
    }
    return evaluation;
  }

  var cleanup = function(conditionSet) {

    if (!conditionSet.op) {
      return null;
    }
    var cleanupChildren = function(conditionSet) {
      if (!conditionSet || !conditionSet.op) {
        return false;
      }
      // Remove any 0 length condition sets
      for (var i = 0; i < conditionSet.conditions.length; i++) {
        var obj = conditionSet.conditions[i];
        if (obj.conditions) {
          if (obj.conditions.length === 0) {
            conditionSet.conditions.splice(i, 1);
            i--;
          } else {
            var isNotNull = cleanupChildren(obj);
            if (!isNotNull) {
              conditionSet.conditions.splice(i, 1);
              i--;
            }
          }
        }
      }
      return true;
    }

    if (conditionSet.conditions.length === 0) {
      return null;
    } else {
      var isNotNull = cleanupChildren(conditionSet);
      if (!isNotNull) {
        return null;
      }
    }



    return conditionSet;
  }

  var createCondition = function(lhs, op, rhs) {
    return new Condition(lhs, op, rhs);
  };

  var createConditionSet = function(conditions, op) {
    return new ConditionSet(conditions, op || CONDITIONS_OPS.logical.AND);
  };

  return {
    createCondition: createCondition,
    createConditionSet: createConditionSet,
    evaluateConditionSet: evaluateConditionSet,
    cleanup: cleanup
  };
});

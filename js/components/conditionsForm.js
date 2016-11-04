/**
 * Form that enables the creation and editing of player-state driven conditions.
 */
app.component('conditionsForm', {
  templateUrl: 'templates/components/conditionsForm.html',
  bindings: {
    conditionSet: '='
  },
  controller: function($scope, CONDITIONS_OPS, ConditionFactory, _) {
    this.ops = CONDITIONS_OPS;

    this.logical = _.invert(CONDITIONS_OPS.logical);

    this.createCondition = function() {
      var condition = ConditionFactory.createCondition('',
        this.ops.string.EQ, '');
      this.conditionSet.conditions.push(condition);
    }.bind(this);

    this.createConditionSet = function() {
      var condition = ConditionFactory.createConditionSet();
      this.conditionSet.conditions.push(condition);
    }.bind(this);

    this.delete = function(obj) {
      delete this.conditionSet;
      console.log(this.conditionSet);
    };

    this.deleteCondition = function(id) {
      this.conditionSet.conditions.splice(id, 1);
    }.bind(this);

  },
  controllerAs: 'ctrl',
});

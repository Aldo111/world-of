/**
 * Form that enables the creation and editing of player-state driven conditions.
 */
app.component('conditionsForm', {
  templateUrl: 'templates/components/conditionsForm.html',
  bindings: {
    conditionSet: '=',
    parentSet: '=?',
    parentPosition: '<?',
    worldId: '<?',
    world: '<?',
    worldLinks: '<?'
  },
  controller: function($scope, CONDITIONS_OPS, ConditionFactory, _, API) {
    this.ops = CONDITIONS_OPS;
    console.log(this.ops);
    this.worldLinks = [];
    this.logical = _.invert(CONDITIONS_OPS.logical);
    var stateVariables = JSON.parse(this.world.stateVariables || "[]");

    this.stateValues = [{
      name: '*links', type: 'links'}
      ].concat(stateVariables);

    this.getType = function(name) {
      for (var i = 0; i < this.stateValues.length; i++) {
        if (this.stateValues[i].name == name) {
          return this.stateValues[i].type;
        }
      }
      return 'text';
    }.bind(this);

    this.createCondition = function() {
      var condition = ConditionFactory.createCondition('',
        null, '');
      this.conditionSet.conditions.push(condition);
    }.bind(this);

    this.createConditionSet = function() {
      var condition = ConditionFactory.createConditionSet();
      this.conditionSet.conditions.push(condition);
    }.bind(this);

    this.delete = function(obj) {
      obj.conditions = [];
      if (this.parentSet && this.hasOwnProperty('parentPosition')) {
        this.parentSet.conditions.splice(this.parentPosition, 1);
      }
    }.bind(this);

    this.deleteCondition = function(id) {
      this.conditionSet.conditions.splice(id, 1);
    }.bind(this);

    // init stuff
    if (this.world) {
      API.getWorldLinks(this.world.id).then(function(response) {
        this.worldLinks = response.result;
      }.bind(this));
    }

  },
  controllerAs: 'ctrl',
});

/**
 * Form that enables the creation and editing of player-states.
 */
app.component('stateModificationForm', {
  templateUrl: 'templates/components/stateModificationForm.html',
  bindings: {
    stateVariables: '=',
    stateModifications: '=',
    isLinkedHub: '=?'
  },
  controller: function($scope, MOD_OPS, playerStateFactory, _, API) {

    console.log(this.stateVariables);

    this.modTypes = MOD_OPS;

    this.variableTypes = {};

    _.each(this.stateVariables, function(obj) {
      this.variableTypes[obj.name] = obj.type;
    }.bind(this));

    this.getModTypes = function(variable) {

    };

    this.createModification = function() {
      console.log(this.stateModifications);

      /*if(!this.stateModifications)
      {
        this.stateModifications = [];
      }*/

      var modification = playerStateFactory.createModification('', MOD_OPS.SET,'');
      this.stateModifications.push(modification);
    }.bind(this);

    this.deleteModification = function(id) {
      this.stateModifications.splice(id,1);
    }.bind(this);
  },
  controllerAs: 'ctrl',
});

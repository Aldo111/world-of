/**
 * Form that enables the creation and editing of player-states.
 */
app.component('playerStateForm', {
  templateUrl: 'templates/components/playerStateForm.html',
  bindings: {
    stateVariables: '=',
  },
  controller: function($scope, STATE_OPS, playerStateFactory, _, API) {

    this.stateTypes = STATE_OPS;

    console.log(this.stateVariables);

    this.updateInitialValue = function(id) {
      var type = this.stateVariables[id].type;
      this.stateVariables[id].initial = this.stateTypes[type];
    }.bind(this);

    this.createVariable = function() {
      this.stateVariables.push(playerStateFactory.createVariable('',
       'string', STATE_OPS.string));
    }.bind(this);

    this.deleteVariable = function(id) {
      this.stateVariables.splice(id, 1);
    }.bind(this);
  },
  controllerAs: 'ctrl',
});

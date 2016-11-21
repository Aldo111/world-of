app.controller('PlayerStateEditorCtrl', function($scope, $state, API, User,
  Loader, $mdDialog, playerStateFactory) {

  this.variables = [];

  if (this.stateVariables) {
    this.variables = angular.copy(this.stateVariables);
  }

  console.log(this.variables);

  this.save = function() {
    var variables = playerStateFactory.cleanup(this.variables);
    $mdDialog.hide(variables);
  }.bind(this);

  this.cancel = function() {
    $mdDialog.cancel();
  };
});
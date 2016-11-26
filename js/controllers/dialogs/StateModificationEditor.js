app.controller('StateModificationCtrl', function($scope, $state, API, User,
  Loader, $mdDialog, playerStateFactory) {

  this.modifications = [];

  if (this.stateModifications) {
    this.modifications = angular.copy(this.stateModifications);
  }

  console.log(this.modifications);

  this.save = function() {
    //var modifications = playerStateFactory.cleanup(this.modifications);
    if (this.modifications && this.modifications.length === 0) {
      this.modifications = null;
    }
    $mdDialog.hide(this.modifications);
  }.bind(this);

  this.cancel = function() {
    $mdDialog.cancel();
  };
});
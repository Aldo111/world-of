app.controller('LinkHubCtrl', function($scope, $state, API, User, Loader,
  $mdDialog) {

  this.save = function() {
    $mdDialog.hide(this.section);
  }.bind(this);

  this.cancel = function(data) {
    $mdDialog.hide(data);
  };
});

app.controller('WorldDetailsCtrl', function($scope, $state, API, User, Loader,
  $mdDialog) {
  this.formData = {};
  this.user = User.getUser();
  this.error = null;
  this.success = null;

  this.createWorld = function() {
    this.formData.userId = User.getId();
    API.createWorld(this.formData).then(function(response) {
      this.cancel(response);
    }.bind(this), function(response) {
      this.error = response.error;
    });
  }.bind(this);

  this.cancel = function(data) {
    $mdDialog.hide(data);
  };
});

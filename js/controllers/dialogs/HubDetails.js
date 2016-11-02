app.controller('HubDetailsCtrl', function($scope, $state, API, User, Loader,
  $mdDialog) {
  this.formData = {worldId: this.worldId};
  this.user = User.getUser();
  this.error = null;
  this.success = null;

  this.createHub = function() {
    API.createHub(this.formData).then(function(response) {
      this.cancel(response);
    }.bind(this), function(response) {
      this.error = response.error;
    });
  }.bind(this);

  this.cancel = function(data) {
    $mdDialog.hide(data);
  };
});

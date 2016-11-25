app.controller('WorldDetailsCtrl', function($scope, $state, API, User, Loader,
  $mdDialog) {
  this.formData = {};
  this.user = User.getUser();
  this.error = null;
  this.success = null;

  this.createWorld = function() {
    this.formData.userId = User.getId();

    if (this.formData.linkedWorld) {
      var stateVariables = JSON.parse(
        this.worlds[this.formData.linkedWorld - 1].stateVariables || '[]');

      for (var i = 0; i < stateVariables.length; i++) {
        stateVariables[i].inherited = true;
      }

      this.formData.stateVariables = JSON.stringify(stateVariables);
      this.formData.linkedWorld =
        this.worlds[this.formData.linkedWorld - 1].id;
    }

    console.log(this.formData);
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

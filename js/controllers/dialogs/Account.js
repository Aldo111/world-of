app.controller('AccountCtrl', function($scope, $state, API, User, Loader,
  $mdDialog) {
  this.formData = {};
  this.user = User.getUser();
  this.error = null;
  this.success = null;

  this.setupUser = function(user) {
    // Set the user data as the current logged in user
    User.setUser(user);

    // Hide the dialog
    $mdDialog.hide();

    // Transition to user dashboard
    $state.go('main.dash');

    // Hide loader
    Loader.hide();
  }.bind(this);

  this.register = function() {
    // Reset error
    this.error = null;

    // Show loader
    Loader.show();

    // Invoke API Registration endpoint
    API.register(this.formData)
    .then(function(response) {
      this.setupUser(response);
    }.bind(this), function(response) {
      // Error message
      this.error = response.error;

      // Handle errors
      Loader.hide();
    }.bind(this));
  };

  this.login = function() {
    // Reset error
    this.error = null;

    // Show loader
    Loader.show();

    // Invoke API Login endpoint
    API.login(this.formData)
    .then(function(response) {
      this.setupUser(response);
    }.bind(this), function(response) {
      // Error message
      this.error = response.error;

      // Handle errors
      Loader.hide();
    }.bind(this));
  };

  this.logout = function() {
    Loader.show();
    User.logout();
    $mdDialog.hide();
    $state.go('main.home');
    Loader.hide();
  };

  this.cancel = function() {
    $mdDialog.hide();
  };
});

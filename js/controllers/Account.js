app.controller('AccountCtrl', function($scope, $state, API, User, Loader,
  $mdDialog) {
  this.formData = {};
  this.user = User.getUser();

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
    Loader.show();
    API.register(this.formData)
    .then(function(response) {
      this.setupUser(response);
    }.bind(this), function(response) {
      // Handle errors
      Loader.hide();
    });
  };

  this.login = function() {
    Loader.show();
    API.login(this.formData)
    .then(function(response) {
      this.setupUser(response);
    }.bind(this), function(response) {
      // Handle errors
      Loader.hide();
    });
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

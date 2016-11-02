app.controller("HomeCtrl", function($scope, $state, API, User, Loader) {

});

app.controller("DashCtrl", function($scope, User, API, Loader) {
  // Stores worlds for dashboard
  this.worlds = [];

  API.getWorlds({'user_id': User.getId()}).then(function(response) {
    this.worlds = response.result;
  }.bind(this));
});

app.controller("editorCtrl", function($scope, $state, User) {

});

app.controller("HomeCtrl", function($scope, $state, API, User, Loader) {

});

app.controller("DashCtrl", function($scope, $state, User, API, Loader) {
  // Stores worlds for dashboard
  this.worlds = [];

  API.getWorlds({'user_id': User.getId()}).then(function(response) {
  this.worlds = response.result;
  }.bind(this));

  this.goToEditor = function() {
    $state.go('main.hub-editor');
  };
});

app.controller('EditorCtrl', function($scope, $state, User) {

  this.user = {
    hub: ''
  };

  this.sections = [];

  this.createSection = function() {
    console.log('hello');

    this.sections.push({
      text: '',
      conditions: null
    });
  }.bind(this);

  this.deleteSection = function(id) {
    this.sections.splice(id, 1);
  }.bind(this);
});

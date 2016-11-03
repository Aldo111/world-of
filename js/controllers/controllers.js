app.controller("HomeCtrl", function($scope, $state, API, User, Loader) {

});

app.controller("DashCtrl", function($scope, $state, $mdDialog, User, API, Loader) {
  // Stores worlds for dashboard
  this.worlds = [];

  API.getWorlds({'user_id': User.getId()}).then(function(response) {
    this.worlds = response.result;
  }.bind(this));

  this.createWorld = function() {
    $mdDialog.show({
      templateUrl: 'templates/dialogs/world-details.html',
      clickOutsideToClose: true,
      controller: 'WorldDetailsCtrl',
      controllerAs: 'ctrl'
    }).then(function(data) {
      if (data) {
        API.getWorlds({'user_id': User.getId()}).then(function(response) {
          this.worlds = response.result;
        }.bind(this));
      }
    }.bind(this));
  }.bind(this);

  this.editWorld = function(id) {
    $state.go('main.world-edit', {id: id});
  };
});

app.controller('WorldEditCtrl', function($scope, $stateParams, API,
  $mdDialog) {
  this.worldId = parseInt($stateParams.id) || null;

  this.hubs = [];
  this.hub = null;

  this.world = {};
  // API get hubs request
  // maybe this endpoint should also return world data instead of separately
  API.getWorldHubs(this.worldId).then(function(response) {
    this.hubs = response.result;
  }.bind(this));

  API.getWorlds({id: this.worldId}).then(function(response) {
    this.world = response.result[0];
  }.bind(this));

  this.editHub = function(hub) {
    this.hub = hub;
  }.bind(this);

  this.createHub = function() {
    $mdDialog.show({
      templateUrl: 'templates/dialogs/hub-details.html',
      clickOutsideToClose: true,
      controller: 'HubDetailsCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      locals: {
        worldId: this.worldId
      }
    }).then(function(data) {
      if (data) {
        API.getWorldHubs(this.worldId).then(function(response) {
          this.hubs = [];
          this.hubs = response.result;
        }.bind(this));
      }
    }.bind(this));
  }.bind(this);

});

app.controller('PlayCtrl', function($scope, $state, User) {

  this.sections = [];

  this.sections.push({
      text: 'this is a story example\n your content will go here',
      conditions: null
    });

});

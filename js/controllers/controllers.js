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

app.controller('WorldEditCtrl', function($scope, $stateParams, API, $mdDialog) {
  this.worldId = $stateParams.id || null;

  this.hubs = [];
  this.hub = null;

  // API get hubs request
  API.getWorldHubs(this.worldId).then(function(response) {
    this.hubs = response.result;
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

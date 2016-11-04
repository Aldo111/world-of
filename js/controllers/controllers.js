app.controller("HomeCtrl", function($scope, $state, API, User, Loader) {

});

app.controller("DashCtrl", function($scope, $state, $mdDialog, User, API,
  Player, Loader) {
  // Stores worlds for dashboard
  this.worlds = [];
  this.worldFilter = '';

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

  this.playWorld = function(worldId) {
    Player.setCurrentWorld(worldId);
    $state.go('main.play-world', {id: worldId});
  };
});

app.controller('WorldEditCtrl', function($scope, $stateParams, API,
  $mdDialog, Loader, Player, $state, EventManager) {
  this.worldId = parseInt($stateParams.id) || null;

  this.hubs = [];
  this.hub = null;

  this.world = {};

  // API get hubs request
  // maybe this endpoint should also return world data instead of separately
  this.fetchHubs = function() {
    this.hub = null;
    this.hubs = [];
    Loader.show();


    API.getWorldHubs(this.worldId).then(function(response) {
      this.hubs = response.result;
      Loader.hide();
    }.bind(this), function(response) {
      Loader.hide();
    });
  }.bind(this);


  this.init = function() {
    API.getWorlds({id: this.worldId}).then(function(response) {
      if (response.count === 0) {
        $state.go('main.dash');
      } else {
        this.world = response.result[0];
      }
    }.bind(this));

    this.fetchHubs();

    EventManager.onHubDeleted(this.fetchHubs);
  }.bind(this);


  this.editHub = function(hub) {
    // Only change if the newly clicked hub is same hub as currently viewing
    if (!this.hub || hub.id !== this.hub.id) {
      this.hub = hub;
    }
  }.bind(this);

  this.createHub = function() {
    $mdDialog.show({
      templateUrl: 'templates/dialogs/hub-details.html',
      clickOutsideToClose: true,
      controller: 'HubDetailsCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      locals: {
        worldId: this.worldId,
        isFirstHub: this.hubs.length === 0
      }
    }).then(function(data) {
      if (data) {
        API.getWorldHubs(this.worldId).then(function(response) {
          var numberOfHubs = this.hubs.length;
          this.hubs = [];
          this.hubs = response.result;
          // Set this as hub start if previously there were no hubs
          // TODO - maybe instead we should check response.count === 1
          // for race conditions/collaboration issues
          if (numberOfHubs < 1) {
            this.setHubAsStart(data.id);
          }
        }.bind(this));
      }
    }.bind(this));
  }.bind(this);

  this.setHubAsStart = function(id) {
    Loader.show();
    API.updateWorld(this.worldId, {
      startHub: id
    }).then(function(response) {
      Loader.hide();
      this.world.startHub = id;
    }.bind(this), function(response) {
      Loader.hide();
    });
  }.bind(this);

  this.playWorld = function() {
    Player.setCurrentWorld(this.worldId);
    $state.go('main.play-world', {id: this.worldId});
  }.bind(this);

  this.deleteWorld = function() {
    Loader.show();
    API.deleteWorld(this.worldId).then(function(response) {
      $state.go('main.dash');
      Loader.hide();
    }.bind(this), function(response) {
      Loader.hide();
    });
  };

  this.init();
});

app.controller('PlayCtrl', function($scope, $state, $stateParams, User, Loader,
  API, ConditionFactory) {

  this.sections = [];
  this.worldId = parseInt($stateParams.id) || null;
  this.world = null;
  /**
   * Function to fetch hub data
   */
  this.fetchWorldData = function() {
    Loader.show();

    API.getWorlds({id: this.worldId}).then(function(response) {
      this.world = response.result[0];
      this.fetchSectionData(this.world.startHub);
    }.bind(this), function(response) {
      Loader.hide();
      // Show error
    });

  }.bind(this);

  /**
   * Function to fetch section data
   */
  this.fetchSectionData = function(hubId) {
    API.getWorldHubSections({
      worldId: this.worldId,
      hubId: hubId
    }).then(function(response) {
      this.filterSections(response.result);
      Loader.hide();
    }.bind(this), function(response) {
      Loader.hide();
    });
  }.bind(this);

  /**
   * Function to filter sections based on conditions
   */
  this.filterSections = function(sections) {
    var data = {
      'armor': 99,
      'test': 'adarsh'
    };
    var results = [];
    // Evaluate sections to be displayed based on any conditions
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].conditions) {
        var conditions = JSON.parse(sections[i].conditions);
        var valid = ConditionFactory.evaluateConditionSet(conditions, data);
        if (valid) {
          results.push(sections[i]);
        }
      } else {
        results.push(sections[i]);
      }
    }

    this.sections = results;
  }.bind(this);

  this.fetchWorldData();
});

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
  this.stateVariables = [];

  this.world = {};

  this.openPlayerStateEditor = function() {
     $mdDialog.show({
      templateUrl: 'templates/dialogs/player-state-editor.html',
      clickOutsideToClose: true,
      controller: 'PlayerStateEditorCtrl',
      controllerAs: 'ctrl',
      locals: {
        stateVariables: JSON.parse(this.world.stateVariables || null),
      },
      bindToController: true
    }).then(function(data) {
      Loader.show();
      console.log(this.world);
      API.updateWorld(this.worldId, {
        stateVariables: JSON.stringify(data)
      }).then(function() {
        this.world.stateVariables = JSON.stringify(data);
        Loader.hide();
      }.bind(this), function() {
        Loader.hide();
      });
    }.bind(this));
}.bind(this);

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
  API, ConditionFactory, Player, _, playerStateFactory) {

  this.sections = [];
  this.worldId = parseInt($stateParams.id) || null;
  this.world = null;
  this.playerState = {};
  this.publicStats = [];
  /**
   * Function to fetch hub data
   */
  this.fetchWorldData = function() {
    Loader.show();

    Player.reset();

    API.getWorlds({id: this.worldId}).then(function(response) {
      this.world = response.result[0];
      this.initializePlayerState();
      this.fetchSectionData(this.world.startHub);
    }.bind(this), function(response) {
      Loader.hide();
      // Show error
    });

  }.bind(this);

  /**
   * Function to initialize player state
   */
  this.initializePlayerState = function() {
    var stateVariables = JSON.parse(this.world.stateVariables) || [];
    var state = {};

    _.each(stateVariables, function(variable) {

      if (variable.type == 'number') {
        variable.initial = parseFloat(variable.initial);
      }

      state[variable.name] = variable.initial;

      if (variable.show) {
        this.publicStats.push(variable.name);
      }

    }.bind(this));

    Player.init(state);

    console.log(Player.getState());

  }.bind(this);

  /**
   * Function to fetch section data
   */
  this.fetchSectionData = function(hubId) {
    Loader.show();
    this.sections = [];
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
   * Function to evaulate modifiers
   *
   */
  this.evaluateSectionModifier = function(section) {
    var modifications = JSON.parse(section.stateModifiers) || [];
    playerStateFactory.evaluateModifications(modifications, Player.getState());
  };

  /**
   * Function to filter sections based on conditions
   * and execute modifiers
   */
  this.filterSections = function(sections) {
    var data = Player.getState();
    var results = [];
    // Evaluate sections to be displayed based on any conditions
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].conditions) {
        var conditions = JSON.parse(sections[i].conditions);
        var valid = ConditionFactory.evaluateConditionSet(conditions,
        Player.getState());
        if (valid) {
          results.push(sections[i]);
          if (!sections[i].linkedHub) {
            this.evaluateSectionModifier(sections[i]);
          }
        }
      } else {
        results.push(sections[i]);
        if (!sections[i].linkedHub) {
          this.evaluateSectionModifier(sections[i]);
        }
      }
    }

    this.sections = results;
  }.bind(this);

  /**
   * Function to switch hubs.
   */
  this.gotoHub = function(section) {
    console.log(section);
    this.evaluateSectionModifier(section);
    Player.visitLink(section.id);
    this.fetchSectionData(section.linkedHub);
  }.bind(this);

  $scope.$watch(function() {
    return Player.getState();
  }, function(newState) {
    this.playerState = newState;
  }.bind(this));

  this.fetchWorldData();
});

app.controller('WorldProfileCtrl', function($scope, $state, $stateParams, User,
 Loader, API, ConditionFactory, Player) {
  this.worldId = parseInt($stateParams.id) || null;
  this.world = null;
  this.loadAttempted = false;
  this.creator = {};

  /**
   * Function to fetch creator data
   */
  this.getCreatorData = function(userId) {
    API.userName(userId).then(function(response) {
      this.creator = response;
    }.bind(this));
  }.bind(this);

   /**
    * Function to fetch creator data
    */
  this.fetchWorldData = function() {
      Loader.show();
      Loader.hide();
      Player.reset();

    API.getWorlds({id: this.worldId}).then(function(response) {
      this.getCreatorData(response.result[0].userId);
      this.world = response.result[0];
      this.loadAttempted = true;
      //this.fetchSectionData(this.world.startHub);
    }.bind(this), function(response) {
      this.loadAttempted = true;
    });

  }.bind(this);

  this.playWorld = function() {
    Player.setCurrentWorld(this.world.id);
    $state.go('main.play-world', {id: this.world.id});
  }.bind(this);

  this.fetchWorldData();
});
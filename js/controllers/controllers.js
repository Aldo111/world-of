app.controller("HomeCtrl", function($scope, $state, API, User, Loader) {

});

app.controller("DashCtrl", function($scope, $state, $mdDialog, User, API,
  Player, Loader) {
  // Stores worlds for dashboard
  this.worlds = [];
  this.collabs = [];
  this.worldFilter = '';

  API.getWorlds({'user_id': User.getId()}).then(function(response) {
    this.worlds = response.result;
  }.bind(this));

  API.getUserCollaborations(User.getId()).then(function(response) {
    this.collabs = response.result;
    console.log(response);
  }.bind(this));

  this.createWorld = function() {
    $mdDialog.show({
      templateUrl: 'templates/dialogs/world-details.html',
      clickOutsideToClose: true,
      controller: 'WorldDetailsCtrl',
      controllerAs: 'ctrl',
      locals: {
        worlds: this.worlds
      },
      bindToController: true
    }).then(function(data) {
      if (data) {
        API.getWorlds({'user_id': User.getId()}).then(function(response) {
          this.worlds = response.result;
        }.bind(this));
      }
    }.bind(this));
  }.bind(this);
});

app.controller('WorldEditCtrl', function($scope, $stateParams, API,
  $mdDialog, Loader, Player, $state, EventManager, User) {
  this.worldId = parseInt($stateParams.id) || null;

  this.hubs = [];
  this.hub = null;
  this.stateVariables = [];

  this.world = {};

  this.gotoProfile = function() {
    $state.go('main.world-profile', {id: this.world.id});
  }.bind(this);

  this.openCollaboratorsForm = function() {
     $mdDialog.show({
      templateUrl: 'templates/dialogs/collaborators-form.html',
      clickOutsideToClose: true,
      controller: 'CollaboratorsFormCtrl',
      controllerAs: 'ctrl',
      locals: {
        world: this.world,
      },
      bindToController: true
    });
  }.bind(this);

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


    API.getWorldHubs(this.world.id).then(function(response) {
      this.hubs = response.result;
      if (this.hubs.length > 0) {
        this.editHub(this.hubs[0]);
      }
      Loader.hide();
    }.bind(this), function(response) {
      Loader.hide();
    });
  }.bind(this);


  this.init = function() {
    API.getWorlds({id: this.worldId, userId: User.getId()}).then(
      function(response) {
      if (response.count === 0) {
        // Check collaboration
        API.getUserCollaborations(User.getId(), {worldId: this.worldId}).then(
          function(response) {
            this.initializeWorld(response.result[0]);
          }.bind(this));
      } else {
        this.initializeWorld(response.result[0]);
      }
    }.bind(this));
    // Setup an event to reload anytime hubs are deleted
    EventManager.onHubDeleted(this.fetchHubs);
  }.bind(this);

  this.initializeWorld = function(world) {
    if (!world) {
      $state.go('main.dash');
      return null;
    }
    this.world = world;
    this.fetchHubs();
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
    $state.go('play-world', {id: this.worldId});
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
  this.hubId = null;
  this.doNotEvaluate = false;
  this.showMenu = false;

  this.toggleMenu = function() {
    console.log('toggled');
    this.showMenu = !this.showMenu;
  }.bind(this);

  /**
   * Function to fetch hub data
   */
  this.fetchWorldData = function() {
    Loader.show();

    Player.reset();

    API.getWorlds({id: this.worldId}).then(function(response) {
      this.world = response.result[0];
      this.worldId = this.world.id;
      document.title = this.world.name;
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
    Player.setCurrentWorld(this.worldId);
    var stateVariables = JSON.parse(this.world.stateVariables || '[]');
    var state = {};
    this.publicStats = [];

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
      this.hubId = hubId;
      Player.setCurrentHub(hubId);
      this.filterSections(response.result);
      this.doNotEvaluate = false;
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
    if (this.doNotEvaluate) {
      return;
    }
    var modifications = JSON.parse(section.stateModifiers) || [];
    playerStateFactory.evaluateModifications(modifications, Player.getState());
  };

  this.save = function() {
    Player.saveData(this.playerState);
  }.bind(this);

  this.load = function() {
    // Check if there's a save file for this first
    // Then check for linked world data
    if (!Player.loadData()) {
      if (this.world.linkedWorld) {
        var origHubId = Player.getCurrentHub();
        Player.loadData(this.world.linkedWorld, true);
        Player.reset(); //Don't want links, hubId from other save
        Player.setCurrentHub(origHubId);
        this.hubId = origHubId;
        this.fetchSectionData(this.hubId);
      }
    } else {
      this.hubId = Player.getCurrentHub();
      // Do not evaluate on a loaded state
      this.doNotEvaluate = true;
      this.fetchSectionData(this.hubId);
    }
  }.bind(this);

  this.deleteSave = function() {
    Player.deleteSave(this.world.id);
  }.bind(this);

  /**
   * Function to filter sections based on conditions
   * and execute modifiers
   */
  this.filterSections = function(sections) {
    var data = Player.getState();
    var results = [];
    // Evaluate sections to be displayed based on any conditions
    for (var i = 0; i < sections.length; i++) {
      var sectionToPush = null;
      if (sections[i].conditions) {
        var conditions = JSON.parse(sections[i].conditions);
        var valid = ConditionFactory.evaluateConditionSet(conditions,
        Player.getState());
        if (valid) {
          sectionToPush = sections[i];
        }
      } else {
        sectionToPush = sections[i];
      }
      // Add valid section to filtered/final list
      if (sectionToPush) {
        if (!sectionToPush.linkedHub) {
          this.evaluateSectionModifier(sectionToPush);
        }
        // Wrapping section text inside a random element
        var rootElement = $('<root>'+sectionToPush.text+'</root>');
        // Fetching variables that need to be displayed within sections
        var editorVariables = rootElement.find('.editorVariable');
        console.log(editorVariables.length);
        editorVariables.each(function(i) {
          var value = editorVariables[i].innerText.replace(/\[|\]/g,'');
          editorVariables[i].innerText = data.hasOwnProperty(value) ?
            data[value] : '';
          editorVariables[i].className = '';
        });
        // Substituting it back in the original section's text
        sectionToPush.text = rootElement.html();
        results.push(sectionToPush);
      }
    }

    this.sections = results;
  }.bind(this);

  /**
   * Function to switch hubs.
   */
  this.gotoHub = function(section) {
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
 Loader, API, ConditionFactory, Player, _) {
  this.worldId = parseInt($stateParams.id) || null;
  this.world = null;
  this.loadAttempted = false;
  this.creator = {};

  /**
   * Function to fetch creator data
   */
  this.getCreatorData = function(userId) {
    API.getUser(userId).then(function(response) {
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
    $state.go('play-world', {id: this.world.id});
  }.bind(this);

  this.fetchWorldData();

  /* Community Box - TODO: convert to component */
  this.userId = User.getId();
  this.reviews = null;
  this.isReviewing = false;
  this.userHasReview = false;
  this.userReview = {
    rating: 1,
    text: ''
  };
  this.origUserRating = 1;
  this.reviewAverage = 0;
  this.ratingLabels = [
    '',
    '1 - I did not have a good experience at all.',
    '2 - It could\'ve been better.',
    '3 - It was alright.',
    '4 - It was good.',
    '5 - It was pretty awesome.'
  ];
  this.tabs = ['Reviews', 'Statistics'];
  this.selectedTab = this.tabs[0];

  this.setTab = function(tab) {
    this.selectedTab = tab;
  }.bind(this);

  this.getReviews = function() {
    API.getWorldReviews(this.worldId).then(function(response) {
      this.reviews = response.result;
      // Get average
      if (response.count > 0) {
        _.each(this.reviews, function(review) {
          this.reviewAverage += review.rating;

          // Get this user's review
          if (review.userId === this.userId) {
            this.userReview = angular.copy(review);
            this.origUserRating = review.rating;
            this.userHasReview = true;
          }
        }.bind(this));
        this.reviewAverage /= response.count;
        this.reviewAverage = this.reviewAverage.toPrecision(3);
      }
    }.bind(this));
  }.bind(this);

  this.updateUserRating = function(value) {
    this.userReview.rating = value;
    this.origUserRating = value;
  }.bind(this);

  this.toggleReview = function() {
    this.isReviewing = !this.isReviewing;
  }.bind(this);

  this.submitReview = function() {
    Loader.show();
    var reviewFunc = this.userHasReview ? API.updateWorldReview :
      API.createWorldReview;

    reviewFunc(this.world.id, this.userReview).then(
      function(response) {
        Loader.hide();
        this.getReviews();
    }.bind(this), function() {
      Loader.hide();
    });

  }.bind(this);


  this.getReviews();

});
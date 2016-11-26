app.component('hubEditor', {
  templateUrl: 'templates/components/hub-editor.html',
  controllerAs: 'ctrl',
  bindings: {
    hub: '=',
    world: '<',
    hubs: '<?'
  },
  controller: function($scope, $state, User, API, $mdDialog, EventManager,
    Loader, ConditionFactory) {

  this.sections = [];
  this.worldId = this.world ? this.world.id || null : null;

  // Create a section textarea
  this.createSection = function() {
    this.sections.push({
      id: 0,
      text: '',
      conditions: null,
      linkedHub: null,
      stateModifiers: null,
    });
  }.bind(this);

  /**
   * Delete a section from the sections array
   */
  this.deleteSection = function(id) {
    this.sections.splice(id, 1);
  }.bind(this);

  /**
   * Save sections array to the API
   */
  this.saveSections = function() {
    var data = {
      worldId: this.worldId,
      hubId: this.hub.id,
      sections: this.sections
    };

    Loader.show();

    API.saveSections(data).then(function(response) {
      Loader.hide();
    }, function(response) {
      Loader.hide();
    });
  }.bind(this);

  /**
   * If the section being deleted has no text, delete without confirmation.
   * Else, confirm.
   */
  this.confirmDeleteSection = function(id) {
    // Delete without confirmation if a section is empty
    if (this.sections[id].text.length === 0) {
      this.deleteSection(id);
      return;
    }
    // Confirmation Dialog
    var confirm = $mdDialog.confirm()
      .title('Delete Section ' + id)
      .textContent('Are you sure you would like to delete this section?')
      .ariaLabel('Delete Section ' +id)
      .ok('Yes')
      .cancel('Cancel');

    // Confirm the deletion of a section
    $mdDialog.show(confirm).then(function() {
      this.deleteSection(id);
    }.bind(this));
  }.bind(this);

  this.deleteHub = function() {
    Loader.show();
    API.deleteHub({
      worldId: this.world.id,
      hubId: this.hub.id
    }).then(function(response) {
      EventManager.hubDeleted();
      this.hub = null;
      Loader.hide();
    }.bind(this), function(response) {
      Loader.hide();
    });
  };

  /**
   * Function to fetch hub data
   */
  this.fetchSectionData = function() {
    Loader.show();

    API.getWorldHubSections({
      worldId: this.world.id,
      hubId: this.hub.id
    }).then(function(response) {
      Loader.hide();
      this.sections = response.result;
    }.bind(this), function(response) {
      Loader.hide();
    });
  }.bind(this);

  this.openConditionsEditor = function(section) {
    var conditionSet = JSON.parse(section.conditions || null);

    if (!conditionSet) {
      conditionSet = ConditionFactory.createConditionSet();
    }

    $mdDialog.show({
      templateUrl: 'templates/dialogs/conditions-editor.html',
      clickOutsideToClose: true,
      controller: 'ConditionsEditorCtrl',
      controllerAs: 'ctrl',
      locals: {
        conditionSet: angular.copy(conditionSet),
        worldId: this.worldId,
        world: this.world
      },
      bindToController: true
    }).then(function(data) {
      console.log(data);
      if (!data) {
        section.conditions = null;
      } else {
        section.conditions = JSON.stringify(data);
      }
    });
  }.bind(this);

  this.openModificationEditor = function(section) {
     $mdDialog.show({
      templateUrl: 'templates/dialogs/state-modification-editor.html',
      clickOutsideToClose: true,
      controller: 'StateModificationCtrl',
      controllerAs: 'ctrl',
      locals: {
        stateVariables: JSON.parse(this.world.stateVariables) || [],
        stateModifications: JSON.parse(section.stateModifiers) || [],
        isLinkedHub: section.linkedHub || false
      },
      bindToController: true
    }).then(function(data) {
        section.stateModifiers = JSON.stringify(data);
        if (!data) {
          section.stateModifiers = null;
        }
    }.bind(this));
}.bind(this);

  this.openHubLinker = function(section) {
    console.log(section);
    $mdDialog.show({
      templateUrl: 'templates/dialogs/link-hub.html',
      clickOutsideToClose: true,
      controller: 'LinkHubCtrl',
      controllerAs: 'ctrl',
      locals: {
        section: section,
        hubs: this.hubs
      },
      bindToController: true
    });
  }.bind(this);

  // Watch for any updates to the hub passed to this component
  $scope.$watch('ctrl.hub', function(newHub) {
    if (newHub) {
      this.fetchSectionData();
      this.sections = [];
    }
  }.bind(this));

  // Watch for any updates to the world ID passed to this component
  $scope.$watch('ctrl.world', function(newWorld) {
    if (newWorld) {
      this.fetchSectionData();
      this.worldId = newWorld.id;
    }
  }.bind(this));

}});
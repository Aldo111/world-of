app.component('hubEditor', {
  templateUrl: 'templates/components/hub-editor.html',
  controllerAs: 'ctrl',
  bindings: {
    hub: '<',
    worldId: '<'
  },
  controller: function($scope, $state, User, API, $mdDialog, Loader) {

  this.sections = [];

  // Create a section textarea
  this.createSection = function() {
    this.sections.push({
      text: '',
      conditions: null
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

  /**
   * Function to fetch hub data
   */
  this.fetchSectionData = function() {
    Loader.show();

    API.getWorldHubSections({
      worldId: this.worldId,
      hubId: this.hub.id
    }).then(function(response) {
      Loader.hide();
      this.sections = response.result;
    }.bind(this), function(response) {
      Loader.hide();
    });
  }.bind(this);

  // Watch for any updates to the hub passed to this component
  $scope.$watch('ctrl.hub', function(newHub) {
    if (newHub) {
      this.fetchSectionData();
    }
  }.bind(this));

  // Watch for any updates to the world ID passed to this component
  $scope.$watch('ctrl.worldId', function(newHub) {
    if (newHub) {
      this.fetchSectionData();
    }
  }.bind(this));

}});
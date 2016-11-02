app.component('hubEditor', {
  templateUrl: 'templates/components/hub-editor.html',
  controllerAs: 'ctrl',
  bindings: {
    hub : '<'
  },
  controller: function($scope, $state, User, API, $mdDialog) {

  this.sections = [];

  this.createSection = function() {
    this.sections.push({
      text: '',
      conditions: null
    });
  }.bind(this);

  this.deleteSection = function(id) {
    this.sections.splice(id, 1);
  }.bind(this);

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
}});
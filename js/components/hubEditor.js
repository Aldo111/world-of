app.component('hubEditor', {
  templateUrl: 'templates/components/hub-editor.html',
  controllerAs: 'ctrl',
  bindings: {
    worldId : '<'
  },
  controller: function($scope, $state, User, API) {

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
}});
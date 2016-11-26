app.controller('CollaboratorsFormCtrl', function($mdDialog, $state, API, $q) {

  this.collaborators = this.world.collaborators || [];
  this.selectedItem = null;
  this.searchText = null;
  this.collabError = false;

  this.querySearch = function(query) {
    return API.getUsers({
      '*likeUsername': query
    }).then(function(response) {
      return $q.resolve(response.result);
    });
  };

  this.collabExists = function(username) {
    this.collabError = false;
    var collaborators = this.world.collaborators || [];
    for (var i = 0; i < collaborators.length; i++) {
      if (collaborators[i].username == username) {
        return true;
      }
    }

    return false;
  }.bind(this);

  this.addCollab = function() {
    if (this.selectedItem) {

      if (this.collabExists(this.selectedItem.username)) {
        this.collabError = true;
        return false;
      }
      API.addCollaborator(this.world.id, this.selectedItem.id).then(
        function(response) {
          this.world.collaborators.push({
            id: this.selectedItem.id,
            username: this.selectedItem.username
          });
      }.bind(this), function(response) {

      });
    }

  }.bind(this);

  this.removeCollab = function(index) {
    var collaborators = this.world.collaborators || [];
    if (collaborators.length > index) {
      var collab = collaborators[index];
      API.removeCollaborator(this.world.id, collab.collaboratorId).then(
        function(response) {
          this.world.collaborators.splice(index, 1);
      }.bind(this), function(response) {

      });
    }
  }.bind(this);



  this.save = function() {
    console.log(this.selectedItem);
    $mdDialog.hide();
  }.bind(this);

  this.cancel = function(data) {
    $mdDialog.hide(data);
  };
});
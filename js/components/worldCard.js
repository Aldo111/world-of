app.component('worldCard', {
  templateUrl: 'templates/components/worldCard.html',
  bindings: {
    'world': '<'
  },
  controllerAs: 'ctrl',
  controller: function(API, $state, Player, $mdDialog) {
    this.editWorld = function(id) {
      $state.go('main.world-edit', {id: id});
    };

    this.playWorld = function(worldId) {
      Player.setCurrentWorld(worldId);
      $state.go('play-world', {id: worldId});
    };
    this.openShare = function(worldId){
        $mdDialog.show({
        templateUrl: 'templates/dialogs/share-button.html',
        clickOutsideToClose: true,
        controller: 'ShareButton',
        controllerAs: 'ctrl',
        locals: {
          worldId: worldId
        },
        bindToController: true
      });
    };
  }
});
/**
 * Website header component.
 */
app.component('mainHeader', {
  templateUrl: 'templates/components/mainHeader.html',
  controller: function($scope, User, $mdDialog, EventManager) {
    this.username = User.getName();

    var loginListener = EventManager.onUserLoggedIn(function(user) {
      this.username = user.username;
    }.bind(this));

    var logoutListener = EventManager.onUserLoggedOut(function() {
      this.username = '';
    }.bind(this));

    this.openAccountOptions = function() {
      $mdDialog.show({
        templateUrl: 'templates/dialogs/account.html',
        clickOutsideToClose: true,
        controller: 'AccountCtrl',
        controllerAs: 'ctrl'
      });
    };

    // Clear listeners on destroy
    $scope.$on('$destroy', function() {
      loginListener();
      logoutListener();
    });
  },
  controllerAs: 'ctrl',
});

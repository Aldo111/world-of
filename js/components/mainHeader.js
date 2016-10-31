/**
 * Website header component.
 */
app.component('mainHeader', {
  templateUrl: 'templates/components/mainHeader.html',
  controller: function($scope, User, $mdDialog, EventManager) {
    this.username = '';

    EventManager.onUserLoggedIn(function(user) {
      console.log(user);
      this.username = user.username;
    }.bind(this));

    EventManager.onUserLoggedOut(function() {
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
  },
  controllerAs: 'ctrl',
});

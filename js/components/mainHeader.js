/**
 * Website header component.
 */
app.component('mainHeader', {
  templateUrl: 'templates/components/mainHeader.html',
  controller: function($scope, User, $mdDialog) {
    this.username = '';
    $scope.$watch(function() {
      return User.getUser();
    }, function(newVal) {
      if (newVal) {
        this.username = newVal.username;
      } else {
        this.username = '';
      }
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

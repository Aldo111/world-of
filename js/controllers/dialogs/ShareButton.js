app.controller('ShareCtrl', function($scope, $state, API, User, Loader,
  $mdDialog) {
  
  this.cancel = function(data) {
    $mdDialog.hide(data);
  };
});

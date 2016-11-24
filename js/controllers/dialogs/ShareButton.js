app.controller('ShareButton', function($scope, $state, API, User, Loader,
  $mdDialog) {
  this.worldUrl = document.URL.replace('dash', 'worlds/' + this.worldId);
  this.sites = [
    {"name":"twitter","img":"img/twitter-128.png"},
    {"name":"facebook","img":"img/facebook.png"},
    {"name":"reddit","img":"img/reddit.png"}];
  this.cancel = function(data) {
    $mdDialog.hide(data);
  };
});

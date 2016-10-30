app.component('navBar', {
  templateUrl: 'templates/components/navBar.html',
  controller: function($state, User, $scope) {
    this.currentState = '';

    // Convenience function for creating objects for the tabs.
    var Tab = function(name, icon, page) {
      return {
        name: name,
        icon: icon,
        page: page
      }
    };

    this.tabs = [];
    this.tabs.push(new Tab('Home', 'home', 'main.dash'));

    if (User.loggedIn()) {
      // Authorized tabs only
      this.tabs.push(new Tab('Player Templates', 'accessibility',
        'main.player-templates'));
    }

    // Watch state changes and accordingly switch tab class
    $scope.$watch(function(){
      return $state.$current.name
    }, function(newVal, oldVal){
      this.currentState = newVal;
    }.bind(this));

    // State transition function
    this.goto = function(page) {
      $state.go(page);
    };
  },
  controllerAs: 'ctrl',
});
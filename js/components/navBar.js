app.component('navBar', {
  templateUrl: 'templates/components/navBar.html',
  controller: function($state, User) {

    // Convenience function for creating objects for the tabs.
    var Tab = function(name, icon, page) {
      return {
        name: name,
        icon: icon,
        page: page
      }
    };

    this.tabs = [];
    this.tabs.push(new Tab('Home', 'home', 'login'));

    if (User.loggedIn()) {
      // Authorized tabs only
      this.tabs.push(new Tab('Player Templates', 'accessibility',
        'main.player-templates'));
    }

    this.goto = function(page) {
      $state.go(page);
    };
  },
  controllerAs: 'ctrl',
});
var app = angular.module("worldof", ['ui.router', 'ngMaterial']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state("main", {
      abstract: true,
      templateUrl: "templates/main.html"
    })
    .state("main.home", {
      url: "/",
      templateUrl: "templates/home.html",
      controller: "homeCtrl",
      data: {
        stateIfAuthorized: "main.dash"
      }
    })
    .state("main.dash", {
      url: "/dash",
      templateUrl: "templates/dash.html",
      controller: "dashCtrl",
      data: {
        authorization: true
      }
    })
});

app.run(function($rootScope, $state, User) {
  User.init();
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      if (!User.loggedIn() && toState.data && toState.data.authorization) {
        $state.go("main.home");
      }
      if (User.loggedIn() && toState.data && toState.data.stateIfAuthorized) {
        $state.go(toState.data.stateIfAuthorized);
      }
  });
});

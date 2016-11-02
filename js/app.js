var app = angular.module('worldof', ['ui.router', 'ngMaterial']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  $urlRouterProvider.otherwise('/');

  // Define angular routes
  $stateProvider
    .state('main', {
      abstract: true,
      templateUrl: 'templates/main.html'
    })
    .state('main.home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'ctrl',
      data: {
        stateIfAuthorized: 'main.dash'
      }
    })
    .state('main.dash', {
      url: '/dash',
      templateUrl: 'templates/dash.html',
      controller: 'DashCtrl as ctrl',
      data: {
        authorization: true
      }
    })
    .state('main.player-templates', {
      url: '/templates',
      templateUrl: 'templates/player-templates.html',
      controller: 'DashCtrl',
      data: {
        authorization: true
      }
    })
    .state('main.world-edit', {
      url: '/world/:id/edit',
      templateUrl: 'templates/world-edit.html',
      controller: 'WorldEditCtrl',
      controllerAs: 'ctrl',
      data: {
        authorization: true
      }
    })
    .state('main.hub-editor', {
      url: '/editor',
      templateUrl: 'templates/hub-editor.html',
      controller: 'EditorCtrl',
      controllerAs: 'ctrl',
      data: {
        authorization: true
      }
    });

  // Define theme
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
});

app.run(function($rootScope, $state, User, $http, Config, $templateCache) {
  // Initialize a logged in user, if any
  User.init();

  // Setup state change event listener
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {


      if (!User.loggedIn() && toState.data && toState.data.authorization) {
        $state.go('main.home');
      }
      if (User.loggedIn() && toState.data && toState.data.stateIfAuthorized) {
        $state.go(toState.data.stateIfAuthorized);
      }
  });

  $templateCache.removeAll();
});

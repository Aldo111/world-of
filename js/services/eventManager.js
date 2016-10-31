/**
 * Event manager in an isolated scope to avoid polluting rootscope.
 */
app.factory('EventManager', function($rootScope) {
  var eventScope = $rootScope.$new();

  var broadcast = function(name, data) {
    eventScope.$broadcast(name, data || {});
  };

  var on = function(name, callback) {
    eventScope.$on(name, function(event, data) {
      callback(data);
    });
  };

  return {
    userLoggedIn: function(user) {
      broadcast('user-logged-in', user);
    },
    onUserLoggedIn: function(callback) {
      on('user-logged-in', callback);
    },

    userLoggedOut: function(user) {
      broadcast('user-logged-out', user);
    },
    onUserLoggedOut: function(callback) {
      on('user-logged-out', callback);
    }
  }
});

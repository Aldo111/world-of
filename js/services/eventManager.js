/**
 * Event manager in an isolated scope to avoid polluting rootscope.
 */
app.factory('EventManager', function($rootScope) {
  var eventScope = $rootScope.$new();

  var broadcast = function(name, data) {
    eventScope.$broadcast(name, data || {});
  };

  var on = function(name, callback) {
    return eventScope.$on(name, function(event, data) {
      callback(data);
    });
  };

  return {
    userLoggedIn: function(user) {
      broadcast('user-logged-in', user);
    },
    onUserLoggedIn: function(callback) {
      return on('user-logged-in', callback);
    },

    userLoggedOut: function(user) {
      broadcast('user-logged-out', user);
    },
    onUserLoggedOut: function(callback) {
      return on('user-logged-out', callback);
    },

    hubDeleted: function() {
      broadcast('hub-deleted');
    },
    onHubDeleted: function(callback) {
      return on('hub-deleted', callback);
    }

  }
});

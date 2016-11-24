//User
app.factory("User", function(Storage, EventManager, $window) {

  var user = null;
  var storageName = "worldOfUserData";

  var init = function() {
    var u = Storage.getObject(storageName);
    if (u) {
      setUser(u);
    }
    return u != null;
  };

  var setUser = function(u) {
    // Announce that the user's logged in
    EventManager.userLoggedIn(u);

    // Set user
    user = u;

    // Update document title
    $window.document.title = 'World of ' + u.username;

    // Save in local storage
    Storage.setObject(storageName, u);
  };

  var getUser = function() {
    return user;
  };

  var getName = function() {
    if (!user) {
      return '';
    }
    return user.username;
  }

  var getId = function() {
    return user ? user.id || null : null;
  };

  var loggedIn = function() {
    return user != null;
  };

  var logout = function() {
    // If no user is logged in, there's no one to logout :O
    if (!user) {
      return false;
    }

    // Announce that the user's logged out
    EventManager.userLoggedOut();

    // Update document title
    $window.document.title = 'World of ';

    // Remove from storage
    Storage.remove(storageName);

    // Update local
    user = null;

    return true;
  };

  return {
    init: init,
    setUser: setUser,
    getUser: getUser,
    getId: getId,
    getName: getName,
    loggedIn: loggedIn,
    logout: logout
  };

});

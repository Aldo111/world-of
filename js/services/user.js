//User
app.factory("User", function(API, Storage, EventManager) {

  var user = null;
  var storageName = "worldOfUserData";

  var init = function() {
    var u = Storage.getObject(storageName);
    if (u) {
      user = u;
    }
    return u != null;
  };

  var setUser = function(u) {
    // Announce that the user's logged in
    EventManager.userLoggedIn(u);

    // Set user
    user = u;

    // Save in local storage
    Storage.setObject(storageName, u);
  };

  var getUser = function() {
    return user;
  };

  var getID = function() {
    return user.id || false;
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
    getID: getID,
    loggedIn: loggedIn,
    logout: logout
  };

});

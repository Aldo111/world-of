//User
app.factory("User", function(API, Storage) {

  var user = null;
  var storageName = "worldOfData";

  var init = function() {
    var u = Storage.getObject(storageName);
    if (u) {
      user = u;
    }
    return u != null;
  };

  var setUser = function(u) {
    user = u;
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
    if (!user) {
      return false;
    }

    Storage.remove(storageName);
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

//Local Storage service
app.service("Storage", function($window) {

  this.set = function(key, val) {
    $window.localStorage[key] = val;
  };

  this.has = function(key) {
    return  $window.localStorage[key];
  };

  this.get = function(key) {
    return !this.has(key) ? null : $window.localStorage[key];
  };

  this.remove = function(key) {
    $window.localStorage.removeItem(key);
  }

  //Additionally, set objects and get objects
  this.setObject = function(key,value) {
    $window.localStorage[key] = JSON.stringify(value);
  };

  this.getObject = function(key) {
    console.log(key);
    if (!this.has(key)) {
      return null;
    } else {
      return JSON.parse($window.localStorage[key]);
    }
  };
});

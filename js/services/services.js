// Helps indicate OS platform
app.factory('PlatformDetect', function() {

  var ua = navigator.userAgent;
  var isAndroid = /Android/i.test(ua);

  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isMac = /Macintosh/i.test(ua);
  var isWindows = /Windows/i.test(ua);

  var isDevice = isIOS || isAndroid;

  return {
    isAndroid : function() { return isAndroid; },
    isIOS : function() { return isIOS;},
    isWindows: function() { return isWindows;},
    isDevice: function() { return isDevice; }
  };
});

// Loader overlay
app.factory('Loader', function($timeout) {
  var l = $('#loaderOverlay');
  var show = function() {
    l.show();
  };

  //hide the loader, after a delay if specified
  var hide = function(delay) {
    if (!delay) {
      delay = 0;
    }
    $timeout(function() {
      l.fadeOut('fast')
    }, delay);
  };

  return {
    show: show,
    hide: hide
  };
});

// Factory of helper functions.
app.service('Helper', function() {
  //generate a random id -
  this.guid = function() {
      var S4 = function() {
         return (((1+Math.random())*0x100000)|0).toString(16);
      };
      return (S4()+S4());
  }
});

app.factory('Config', function() {
  // Globally available config from config.js
  var config = configJson;

  var setConfig = function(c) {
    config = c;
  };

  var get = function(val) {
    return config[val] || null;
  };

  return {
    setConfig: setConfig,
    get: get
  };
});

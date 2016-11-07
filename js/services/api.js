//API access
app.factory('API', function($http, $q, Config, RequestFactory, User) {

  var baseURL = Config.get('baseURL');

  /**
   * Converts a string to camel case - this function was taken from
   * AngularJS's internal codebase.
   */
  var camelCase = function(name) {
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    return name.replace(SPECIAL_CHARS_REGEXP,
      function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
  };

  /**
   * Converts string to dash case - taken from Angular's internals.
   */
  var snakeCase = function snake_case(name, separator) {
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  };

  /**
   * Convert from dash case (returned by backend) to camelCase or vice versa
   * TODO: consider maybe just having the backend return camelCase
   * instead of doing this here
   */
  var formatKeys = function(response, type) {
    if (!angular.isObject(response)) {
      return response;
    }

    var conversionFn;
    if (type === 'snake') {
      conversionFn = snakeCase;
    } else {
      conversionFn = camelCase;
      type = 'camel';
    }

    var returnObject = {};

    for (var key in response) {
      if (response.hasOwnProperty(key)) {
        var convertedKey = conversionFn(key);
        if (angular.isArray(response[key])) {
          returnObject[convertedKey] = [];
          for (var i = 0; i < response[key].length; i++) {
            returnObject[convertedKey][i] = formatKeys(response[key][i], type);
          }
        } else if (angular.isObject(response[key])) {
          returnObject[convertedKey] = formatKeys(response[key], type);
        }  else {
          returnObject[convertedKey] = angular.copy(response[key]);
        }
      }
    }

    return returnObject;
  };

  var setOptions = function(data, type) {
    return {
      data: formatKeys(data, 'snake'),
      type: type || 'get'
    }
  };

  var invokeEndpoint = function(endpoint, options) {
    var url = baseURL + '/' + endpoint;
    var promise = RequestFactory.create(url, options);

    return promise.then(function(response) {
      if (response.data.error) {
        return $q.reject(formatKeys(response.data));
      } else {
        return $q.when(formatKeys(response.data));
      }
    }, function(response) {
      return $q.reject(formatKeys(response));
    });
  };

  var login = function(data) {
    return invokeEndpoint('login', setOptions(data, 'post'));
  };

  var register = function(data) {
    return invokeEndpoint('register', setOptions(data, 'post'));
  };

  var getWorlds = function(data) {
    return invokeEndpoint('worlds', setOptions(data));
  };

  var getWorldHubs = function(id) {
    return invokeEndpoint('worlds/' + id + '/hubs');
  };

  var getWorldLinks = function(id) {
    return invokeEndpoint('worlds/' + id +'/links');
  };

  var createWorld = function(data) {
    data.user_id = User.getId();
    return invokeEndpoint('worlds/create', setOptions(data, 'post'));
  };

  var createHub = function(data) {
    data.user_id = User.getId();
    return invokeEndpoint('worlds/' + data.worldId + '/hubs/create',
      setOptions(data, 'post'));
  };

  var saveSections = function(data) {
    data.user_id = User.getId();
    return invokeEndpoint('worlds/' + data.worldId +
      '/hubs/' + data.hubId + '/sections/save', setOptions(data, 'post'));
  };

  var getWorldHubSections = function(data) {
    return invokeEndpoint('worlds/' + data.worldId +
      '/hubs/' + data.hubId + '/sections');
  };

  var updateWorld = function(id, data) {
    return invokeEndpoint('worlds/' + id, setOptions(data, 'put'));
  };

  var deleteWorld = function(id) {
    return invokeEndpoint('worlds/' + id, setOptions(null, 'delete'));
  };

  var deleteHub = function(data) {
    return invokeEndpoint('worlds/' + data.worldId + '/hubs/' + data.hubId,
      setOptions(null, 'delete'));
  };

  return {
    url: baseURL,
    login: login,
    register: register,
    getWorlds: getWorlds,
    getWorldHubs: getWorldHubs,
    createWorld: createWorld,
    createHub: createHub,
    saveSections: saveSections,
    getWorldHubSections: getWorldHubSections,
    updateWorld: updateWorld,
    deleteWorld: deleteWorld,
    deleteHub: deleteHub,
    getWorldLinks: getWorldLinks
  };

});


app.service('RequestFactory', function($http, $httpParamSerializer) {
  this.create = function(url, options) {
    var type;

    // Create empty options object if none exist
    if (!options) {
      options = {};
    }

    // Default is a get request
    if (!options.type) {
      type = 'get';
    } else {
      type = options.type.toLowerCase();
    }


    var returnRequest = null;
    if (type === 'get') {
      var serializedData = '';
      if (options.data) {
        serializedData = '?' + $httpParamSerializer(options.data);
      }
      returnRequest = $http.get(url + serializedData);
    } else if (type === 'post') {
      returnRequest = $http.post(url, options.data || {});
    } else if (type === 'put') {
      returnRequest = $http.put(url, options.data || {});
    } else if (type === 'delete') {
      returnRequest = $http.delete(url, options.data || {});
    }
    return returnRequest;
  };
});

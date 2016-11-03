//API access
app.factory('API', function($http, $q, Config, RequestFactory, User) {

  var baseURL = Config.get('baseURL');

  var setOptions = function(data, type) {
    return {
      data: data,
      type: type || 'get'
    }
  };

  var invokeEndpoint = function(endpoint, options) {
    var url = baseURL + '/' + endpoint;
    var promise = RequestFactory.create(url, options);

    return promise.then(function(response) {
      if (response.data.error) {
        return $q.reject(response.data);
      } else {
        return $q.when(response.data);
      }
    }, function(response) {
      return $q.reject(response);
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

  return {
    url: baseURL,
    login: login,
    register: register,
    getWorlds: getWorlds,
    getWorldHubs: getWorldHubs,
    createWorld: createWorld,
    createHub: createHub,
    saveSections: saveSections,
    getWorldHubSections: getWorldHubSections
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
    }
    return returnRequest;
  };
});

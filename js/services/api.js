//API access
app.factory("API", function($http, $q, Config) {

  var baseURL = Config.get('baseURL');

  var login = function(data) {
    return $http.post(baseURL + '/login', data).then(function(response) {
      if (response.data.error) {
        return $q.reject(response.data);
      } else {
        return $q.when(response.data);
      }
    }, function(response) {
      return $q.reject(response);
    });
  };

  var register = function(data) {
    return $http.post(baseURL + '/register', data).then(function(response) {
      if (response.data.error) {
        return $q.reject(response.data);
      } else {
        return $q.when(response.data);
      }
    }, function(response) {
      return $q.reject(response);
    });
  };

  return {
    url: baseURL,
    login: login,
    register: register
  };

});

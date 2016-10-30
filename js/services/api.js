//API access
app.factory("API", function($http) {

  var baseURL = "http://localhost:8888/world-of/main/api";

  var login = function(obj, callback) {
    var data = obj.data || {};

    $http.post(baseURL+"/login", data)
    .success(function(res) {
      callback(res);
    });
  };

  return {
    url: baseURL,
    login: login,
  };

});

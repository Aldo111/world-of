app.factory('Player', function(Storage, EventManager) {
	var player = null;
	var storageName = 'worldOfPlayerData';

	var worldId;
	var hubId;
  var links = [];
  var state = {};

	var init = function(initialState) {
    state = angular.copy(initialState);
	};

	var getCurrentWorld = function() {
		return worldId;
	};

	var getCurrentHub = function() {
		return hubId;
	};

	var setCurrentWorld = function(id) {
		worldId = id;
	};

	var setCurrentHub = function(id) {
		hubId = id;
	};

  var visitLink = function(id) {
    if (links.indexOf(id) < 0) {
      links.push(id);
    }
  };

  var reset = function() {
    links = [];
  };

  var getState = function() {
    return state;
  };

	return {
		init: init,
		getCurrentWorld: getCurrentWorld,
		getCurrentHub: getCurrentHub,
		setCurrentWorld: setCurrentWorld,
		setCurrentHub: setCurrentHub,
    getState: getState,
    visitLink: visitLink,
    reset: reset
	};
});
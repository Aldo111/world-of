app.factory('Player', function(Storage, EventManager, _) {
	var player = null;
	var storageName = 'worldOfPlayerData';

	var worldId;
	var hubId = null;
  var links = [];
  var state = {};

	var init = function(initialState, extend) {
    if (extend) {
      _.extend(state, angular.copy(initialState));
    } else {
      state = angular.copy(initialState);
    }
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

  var saveData = function(st) {
    Storage.setObject(storageName + '_' + worldId, {
      links: links,
      hubId: hubId,
      state: st || state
    });
  };

  var loadData = function(wId, extend) {
    var data = Storage.getObject(storageName + '_' + (wId || worldId));

    if (!data) {
      return false;
    } else {
      links = data.links;
      setCurrentHub(data.hubId);
      init(data.state, extend);
      return true;
    }
  };

  var deleteSave = function(wId) {
    Storage.remove(storageName + '_' + (wId || worldId));
  };

	return {
		init: init,
		getCurrentWorld: getCurrentWorld,
		getCurrentHub: getCurrentHub,
		setCurrentWorld: setCurrentWorld,
		setCurrentHub: setCurrentHub,
    getState: getState,
    visitLink: visitLink,
    reset: reset,
    saveData: saveData,
    loadData: loadData,
    deleteSave: deleteSave
	};
});
app.factory('Player', function(Storage, EventManager) {
	var player = null;
	var storageName = 'worldOfPlayerData';

	var worldId;
	var hubId;

	var init = function() {
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

	return {
		init: init,
		getCurrentWorld: getCurrentWorld,
		getCurrentHub: getCurrentHub,
		setCurrentWorld: setCurrentWorld,
		setCurrentHub: setCurrentHub
	};
});
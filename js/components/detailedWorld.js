app.component('detailedWorldInfo', {
  templateUrl: 'templates/components/detailedWorldInfo.html',
  controllerAs: 'ctrl',
  bindings: {
    worldId: '='
  },
  controller: function($scope, API) {
   this.world = {};
   this.init = function() {
     API.getWorlds({id: this.worldId}).then(function(response) {
	 console.log(response);
     this.world = response.result[1];
      });
   };  
   
  }
});
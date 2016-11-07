app.controller('ConditionsEditorCtrl', function($scope, $state, API, User,
  Loader, $mdDialog, ConditionFactory) {

  this.save = function() {
    var returnData = ConditionFactory.cleanup(this.conditionSet);
    $mdDialog.hide(returnData);
  }.bind(this);

  this.cancel = function(data) {
    $mdDialog.cancel(data);
  };
});

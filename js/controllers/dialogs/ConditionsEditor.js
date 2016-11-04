app.controller('ConditionsEditorCtrl', function($scope, $state, API, User,
  Loader, $mdDialog, ConditionFactory) {

  this.save = function() {
    $mdDialog.hide(ConditionFactory.cleanup(this.conditionSet));
    /*
    this.formData.userId = User.getId();
    API.createWorld(this.formData).then(function(response) {
      this.cancel(response);
    }.bind(this), function(response) {
      this.error = response.error;
    });
    */
  }.bind(this);

  this.cancel = function(data) {
    $mdDialog.hide(data);
  };
});

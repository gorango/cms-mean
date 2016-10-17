(function () {
  'use strict';

  angular
    .module('info.admin')
    .controller('InfoAdminController', InfoAdminController);

  InfoAdminController.$inject = ['$scope', '$state', '$window', 'infoResolve', 'Authentication', 'Notification'];

  function InfoAdminController($scope, $state, $window, info, Authentication, Notification) {
    var vm = this;

    vm.info = info;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Info
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.info.$remove(function() {
          $state.go('admin.info.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Info deleted successfully!' });
        });
      }
    }

    // Save Info
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.infoForm');
        return false;
      }

      // Create a new info, or update the current instance
      vm.info.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.info.list'); // should we send the User to the list or the updated Info's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Info saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Info save error!' });
      }
    }
  }
}());

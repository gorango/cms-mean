(function () {
  'use strict';

  angular
    .module('quotes.admin')
    .controller('QuotesAdminController', QuotesAdminController);

  QuotesAdminController.$inject = ['$scope', '$state', '$window', 'quoteResolve', 'Authentication', 'Notification'];

  function QuotesAdminController($scope, $state, $window, quote, Authentication, Notification) {
    var vm = this;

    vm.quote = quote;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Quote
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.quote.$remove(function() {
          $state.go('admin.quotes.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Quote deleted successfully!' });
        });
      }
    }

    // Save Quote
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.quoteForm');
        return false;
      }

      // Create a new quote, or update the current instance
      vm.quote.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.quotes.list'); // should we send the User to the list or the updated Quote's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Quote saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Quote save error!' });
      }
    }
  }
}());

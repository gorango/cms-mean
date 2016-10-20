(function() {
  'use strict';

  angular
    .module('checkout')
    .controller('CheckoutController', CheckoutController);

  CheckoutController.$inject = ['$scope', '$http', '$location', 'localStorageService', 'EmailService'];

  function CheckoutController($scope, $http, $location, localStorage, EmailService) {
    var vm = this;
    var params = $location.search();
    var payment = localStorage.get('payment');
    vm.quote = localStorage.get('quote');

    $scope.$on('$stateChangeSuccess', function() {
      if (!payment) { return $location.path('/').replace(); }
      var execute = {
        paymentId: params.paymentId,
        executePayment: {
          payer_id: params.PayerID,
          transactions: [{
            amount: {
              currency: 'CAD',
              total: payment.total
            }
          }]
        }
      };

      $http.post('/api/checkout/execute', execute)
        .then(function(response) {
          if (typeof(response) === 'string') {
            response = JSON.parse(response);
          }
          if (response.state === 'approved') {
            sendEmail(angular.copy(vm.quote));
            vm.approved = true;
            localStorage.clearAll();
          } else {
            vm.declined = true;
            vm.response = response;
          }
        });
    });

    function sendEmail(quote) {
      EmailService.send('PURCHASE', quote);
    }
  }
}());

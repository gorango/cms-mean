(function() {
  'use strict';

  angular
    .module('checkout')
    .controller('CheckoutController', CheckoutController);

  CheckoutController.$inject = ['$timeout', '$state', '$http', '$location', '$analytics', 'localStorageService', 'EmailService'];

  function CheckoutController($timeout, $state, $http, $location, $analytics, localStorage, EmailService) {
    var vm = this;
    var params = $location.search();
    var payment = localStorage.get('payment');
    vm.quote = localStorage.get('quote');

    _enforceConfirmationPolicy();

    function _processPayment() {
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
            _sendEmail(angular.copy(vm.quote));
            vm.approved = true;
            $analytics.eventTrack('Registration confirmed', { category: 'sales', label: angular.copy(vm.quote.total) });
            localStorage.clearAll();
          } else {
            vm.declined = true;
            vm.response = response;
            $analytics.eventTrack('Registration declined', { category: 'sales', label: response.message });
          }
        });
    }

    function _sendEmail(quote) {
      EmailService.send('PURCHASE', quote);
    }

    function _enforceConfirmationPolicy() {
      if (!Object.keys(params).length) {
        if (vm.quote) {
          $state.go('service.quote');
        } else {
          $state.go('home');
        }
      } else {
        _processPayment();
      }
    }
  }
}());

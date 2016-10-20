(function() {
  'use strict';

  angular
    .module('quotes')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['$state', '$http', '$filter', '$mdDialog', 'localStorageService', 'QuoteFactory', 'PREVIEW_IMAGES', 'ACTIONS', 'PAYPAL_CHECKOUT_DEFAULTS'];

  function RegistrationController($state, $http, $filter, $mdDialog, localStorage, QuoteFactory, PREVIEW_IMAGES, ACTIONS, PAYPAL_CHECKOUT_DEFAULTS) {
    var vm = this;
    vm.registrationForm = {};
    vm.quote = localStorage.get('quote');
    vm.searchAddress = QuoteFactory.searchAddress;
    vm.dates = _configDates();
    vm.updateBillingAddress = updateBillingAddress;
    vm.reset = reset;
    vm.checkout = checkout;

    angular.element(document).ready(_checkQuoteValidity);

    function reset() {
      localStorage.remove('quote');
      vm.quote = {};
      _checkQuoteValidity();
    }

    function checkout() {
      var payment = {
        total: $filter('number')(vm.quote.total * 1.13, 2),
        subtotal: $filter('number')(vm.quote.total, 2),
        tax: $filter('number')(vm.quote.total * 0.13, 2)
      };
      var paymentOpts = PAYPAL_CHECKOUT_DEFAULTS;
      paymentOpts.transactions[0].amount.total = payment.total;
      paymentOpts.transactions[0].description = vm.dates.serviceYear + '-' + (vm.dates.serviceYear + 1) + ' Season Snow Clearing Service';

      localStorage.set('quote', vm.quote);
      localStorage.set('payment', payment);

      $http.post('/api/checkout/create', paymentOpts)
        .then(function(response) {
          window.location.href = response.data;
        });
    }

    function _checkQuoteValidity() {
      if (!vm.quote || !vm.quote.verified || !vm.quote.total > 0) {
        $state.go('service.quote');
      }
    }

    function updateBillingAddress(address) {
      if (address) {
        vm.quote.billingAddress = address.description;
        localStorage.set('quote', vm.quote);
      }
    }

    function _configDates() {
      return {
        today: new Date(),
        serviceYear: QuoteFactory.getDate('SERVICE_YEAR'),
        minDate: QuoteFactory.getDate('SERVICE_START_DATE'),
        maxDate: QuoteFactory.getDate('SERVICE_END_DATE')
      };
    }

    function _getSelectedAddress() {
      if (vm.quote) {
        if (vm.quote.serviceAddress) {
          return vm.quote.serviceAddress;
        }
      }
    }
  }
}());

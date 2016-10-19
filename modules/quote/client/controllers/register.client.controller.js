(function() {
  'use strict';

  angular
    .module('quotes')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['$state', 'localStorageService', 'QuoteFactory', '$mdDialog', 'PREVIEW_IMAGES', 'ACTIONS'];

  function RegistrationController($state, localStorage, QuoteFactory, $mdDialog, PREVIEW_IMAGES, ACTIONS) {
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
      $mdDialog.show(
        $mdDialog.confirm()
          .clickOutsideToClose(true)
          .title('Can\'t do that...')
          .textContent('PayPal is not configured due to lack of access')
          .ok('I Understand')
          .cancel('Nevermind')
      ).then(function() {
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Give me access!!!')
            .textContent('Do it already...')
            .ok('Alright...')
        );
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

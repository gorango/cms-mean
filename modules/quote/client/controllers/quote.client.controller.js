(function() {
  'use strict';

  angular
    .module('quotes')
    .controller('QuoteController', QuoteController);

  QuoteController.$inject = ['$scope', '$timeout', '$mdDialog', 'localStorageService', 'QuoteFactory', 'QUOTE_INITIAL_STATE', 'PREVIEW_IMAGES', 'ACTIONS'];

  function QuoteController($scope, $timeout, $mdDialog, localStorage, QuoteFactory, QUOTE_INITIAL_STATE, PREVIEW_IMAGES, ACTIONS) {
    var vm = this;
    vm.quoteForm = {};
    vm.quote = localStorage.get('quote') || angular.copy(QUOTE_INITIAL_STATE);
    vm.previewImages = PREVIEW_IMAGES;
    vm.actions = ACTIONS;
    vm.dates = configDates();
    vm.select = select;
    vm.reset = reset;
    vm.step = step;
    vm.confirm = confirm;
    vm.saltSwitch = saltSwitch;
    vm.sidewalkSwitch = sidewalkSwitch;
    vm.privateQuote = privateQuote;

    angular.element(document).ready(function() {
      vm.select();
    });

    function select() {
      var quote = angular.copy(vm.quote);
      QuoteFactory.calc(quote).then(function(result) {
        vm.quote = result;
      });
    }

    function reset() {
      localStorage.remove('quote');
      $timeout(function() {
        vm.quote = angular.copy(QUOTE_INITIAL_STATE);
      });
    }

    function step(direction) {
      switch (direction) {
        case 'next':
          vm.quote.step++;
          localStorage.set('quote', vm.quote);
          break;
        case 'prev':
          vm.quote.step--;
          localStorage.set('quote', vm.quote);
          break;
      }
    }

    function confirm() {
      if (vm.quote._senior) {
        vm.quote.senior = ACTIONS.CLIENT_REGULAR;
        vm.quote._senior = false;
        vm.select();
      } else {
        $mdDialog.show(
          $mdDialog.confirm()
          .clickOutsideToClose(true)
          .title('Please Confirm')
          .textContent('You must confirm that the primary resident is over the age of 65.')
          .ariaLabel('Please confirm that the primary resident is over the age of 65.')
          .ok('I Understand')
          .cancel('Nevermind')
        ).then(function() {
          vm.quote._senior = true;
          vm.quote.senior = ACTIONS.CLIENT_SENIOR;
          vm.select();
        }, function() {
          vm.quote._senior = false;
          vm.quote.senior = ACTIONS.CLIENT_REGULAR;
          vm.select();
        });
      }
    }

    function saltSwitch(action) {
      vm.quote[action] = !vm.quote[action];
      if (vm.quote[action] === false) {
        vm.quote[action.slice(1)] = null;
        vm.select();
      }
    }

    function sidewalkSwitch() {
      if (vm.quote.sidewalk === ACTIONS.SIDEWALK_NO) {
        vm.quote.corner = undefined;
      }
      vm.select();
    }

    function configDates() {
      return {
        serviceYear: QuoteFactory.getDate('SERVICE_YEAR'),
        minDate: QuoteFactory.getDate('SERVICE_START_DATE'),
        maxDate: QuoteFactory.getDate('SERVICE_END_DATE')
      };
    }

    function privateQuote(value) {
      if (vm.quoteForm.clientNo.$modelValue) {
        vm.quoteForm.$valid = true;
        vm.quote.bipassInfo = true;
        vm.step('next');
      }
    }
  }
}());

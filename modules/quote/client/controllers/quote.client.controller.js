(function() {
  'use strict';

  angular
    .module('quotes')
    .controller('QuoteController', QuoteController);

  QuoteController.$inject = ['$scope', '$state', '$mdDialog', 'localStorageService', 'QuoteFactory', 'QUOTE_INITIAL_STATE', 'PREVIEW_IMAGES', 'ACTIONS', 'SERVICE_AREA_BOUNDS'];

  function QuoteController($scope, $state, $mdDialog, localStorage, QuoteFactory, QUOTE_INITIAL_STATE, PREVIEW_IMAGES, ACTIONS, SERVICE_AREA_BOUNDS) {
    var vm = this;
    vm.quoteForm = {};
    vm.quote = localStorage.get('quote') || angular.copy(QUOTE_INITIAL_STATE);
    vm.selectedItem = vm.quote.serviceAddress ? vm.quote.serviceAddress : ''; // for Autocomplete
    vm.searchAddress = QuoteFactory.searchAddress;
    vm.checkAddress = checkAddress;
    vm.previewImages = PREVIEW_IMAGES;
    vm.actions = ACTIONS;
    vm.dates = _configDates();
    vm.select = select;
    vm.reset = reset;
    vm.step = step;
    vm.confirm = confirm;
    vm.sidewalkSwitch = sidewalkSwitch;
    vm.saltSwitch = saltSwitch;

    angular.element(document).ready(select);

    $scope.$on('$stateChangeSuccess', _startOverPrompt);

    function select() {
      var quote = angular.copy(vm.quote);
      QuoteFactory.calc(quote).then(function(result) {
        vm.quote = result;
      });
    }

    function reset() {
      localStorage.remove('quote');
      vm.quote = angular.copy(QUOTE_INITIAL_STATE);
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

    function confirm(template) {
      switch (template) {
        case 'SENIOR':
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
          break;
        case 'NO_CONTACT':
          if (vm.quoteForm.clientNo.$modelValue && !vm.quote.noContact) {
            $mdDialog.show(
              $mdDialog.confirm().clickOutsideToClose(true).ok('Just gimme the quote').cancel('Fair Enough')
              .title('Are you sure?')
              .textContent('We take your privacy very seriously. We will never sell or reveal your information to a third party.').ariaLabel('We take your privacy very seriously. We will never sell or reveal your information to a third party.')
            ).then(function() {
              vm.quoteForm.$valid = true;
              vm.quote.noContact = true;
              vm.step('next');
            }, function() {
              vm.quote.clientNo = false;
            });
          }
          break;
        case '_walksalt':
          $mdDialog.show(
            $mdDialog.confirm().clickOutsideToClose(true).ok('Sure').cancel('Nevermind')
            .title('You can only select salting for cleared areas')
            .textContent('Would you like to select walkway clearing for your property?').ariaLabel('Would you like to select walkway clearing for your property?')
          ).then(function() {
            vm.quote.walkway = ACTIONS.WALKWAY_YES;
            vm.quote.walksalt = ACTIONS.WALKWAY_SALT_REGULAR;
            vm.select();
          }, function() {
            vm.quote._walksalt = false;
          });
          break;
        case '_sidesalt':
          $mdDialog.show(
            $mdDialog.confirm().clickOutsideToClose(true).ok('Sure').cancel('Nevermind')
            .title('You can only select salting for cleared areas')
            .textContent('Would you like to select sidewalk clearing for your property?').ariaLabel('Would you like to select sidewalk clearing for your property?')
          ).then(function() {
            vm.quote.sidewalk = ACTIONS.SIDEWALK_YES;
            vm.quote.sidesalt = ACTIONS.SIDEWALK_SALT_REGULAR;
            vm.select();
          }, function() {
            vm.quote._sidesalt = false;
          });
          break;
      }
    }

    function sidewalkSwitch() {
      if (vm.quote.sidewalk === ACTIONS.SIDEWALK_NO) {
        vm.quote.corner = undefined;
      }
      vm.select();
    }

    function saltSwitch(action, toggle) {
      if (toggle) { vm.quote[action] = !vm.quote[action]; }
      if (vm.quote[action] === false) {
        vm.quote[action.slice(1)] = undefined;
        vm.select();
      } else {
        switch (action) {
          case '_drivesalt': vm.quote.drivesalt = ACTIONS.DRIVEWAY_SALT_REGULAR; vm.select(); break;
          case '_walksalt': vm.confirm(action); break;
          case '_sidesalt': vm.confirm(action); break;
        }
      }
    }

    function checkAddress(address) {
      if (address) {
        vm.quote.serviceAddress = address.description;
        QuoteFactory.geocode(address)
          .then(function(res) {
            var location = res.data.results[0].geometry.location;
            var verified = QuoteFactory.isInsideServiceArea(location);
            vm.quote.verified = verified;
            vm.quote.serviceLatLng = location;
            localStorage.set('quote', vm.quote);
          });
      }
    }

    function _configDates() {
      return {
        serviceYear: QuoteFactory.getDate('SERVICE_YEAR'),
        minDate: QuoteFactory.getDate('SERVICE_START_DATE'),
        maxDate: QuoteFactory.getDate('SERVICE_END_DATE')
      };
    }

    function _startOverPrompt() {
      var then = Date.parse(vm.quote.date);
      var now = new Date().valueOf();
      var elapsed = (now - then) / 1000; // seconds since starting the quote
      var minWait = 60 * 60 * 16; // 16 hours in seconds
      var itsBeenAWhile = elapsed > minWait;
      var onQuotePage = $state.is('service.quote') || $state.is('quote');
      if (itsBeenAWhile && onQuotePage) {
        $mdDialog.show(
          $mdDialog.confirm().clickOutsideToClose(false).title('Welcome back')
          .textContent('Would you like to continue where you left off?').ariaLabel('Would you like to continue where you left off?')
          .ok('Yes please').cancel('No thanks')
        ).then({}, vm.reset);
      }
    }
  }
}());

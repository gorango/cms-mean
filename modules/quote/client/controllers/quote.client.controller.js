(function() {
  'use strict';

  angular
    .module('quotes')
    .controller('QuoteController', QuoteController);

  QuoteController.$inject = ['$scope', '$state', '$mdDialog', '$analytics', 'localStorageService', 'GeoService', 'EmailService', 'QuoteFactory', 'QUOTE_INITIAL_STATE', 'PREVIEW_IMAGES', 'ACTIONS', 'SERVICE_AREA_BOUNDS'];

  function QuoteController($scope, $state, $mdDialog, $analytics, localStorage, GeoService, EmailService, QuoteFactory, QUOTE_INITIAL_STATE, PREVIEW_IMAGES, ACTIONS, SERVICE_AREA_BOUNDS) {
    var vm = this;
    vm.quoteForm = {};
    vm.quote = localStorage.get('quote') || angular.copy(QUOTE_INITIAL_STATE);
    vm.selectedItem = vm.quote.serviceAddress ? vm.quote.serviceAddress : ''; // for Autocomplete
    vm.searchAddress = GeoService.searchAddress;
    vm.verifyAddress = verifyAddress;
    vm.previewImages = PREVIEW_IMAGES;
    vm.actions = ACTIONS;
    vm.dates = _configDates();
    vm.select = select;
    vm.reset = reset;
    vm.step = step;
    vm.finalStep = finalStep;
    vm.confirm = confirm;
    vm.sidewalkSwitch = sidewalkSwitch;
    // vm.registrationDisabled = registrationDisabled;

    angular.element(document).ready(select);

    // $scope.$on('$stateChangeSuccess', _startOverPrompt);

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
              $analytics.eventTrack('Selected senior option', { category: 'sales', label: vm.quote.total });
            }, function() {
              vm.quote._senior = false;
              vm.quote.senior = ACTIONS.CLIENT_REGULAR;
              vm.select();
              $analytics.eventTrack('Deselected senior option', { category: 'sales', label: vm.quote.total });
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
              $analytics.eventTrack('Quote no contact', { category: 'sales', label: vm.quote.total });
            }, function() {
              vm.quote.clientNo = false;
              $analytics.eventTrack('Quote no contact reconsidered', { category: 'sales', label: vm.quote.total });
            });
          }
          break;
      }
    }

    function sidewalkSwitch() {
      if (vm.quote.sidewalk === ACTIONS.SIDEWALK_NO) {
        vm.quote.corner = undefined;
      }
      vm.select();
    }

    function verifyAddress(address) {
      if (address) {
        vm.quote.serviceAddress = address.description;
        GeoService.geocode(address)
          .then(function(res) {
            var location = res.data.results[0].geometry.location;
            var verified = GeoService.isInsideServiceArea(location);
            vm.quote.verified = verified;
            vm.quote.serviceLatLng = location;
            localStorage.set('quote', vm.quote);
            // Analytics tracking
            if (verified) {
              $analytics.eventTrack('Eligible address', { category: 'area', label: 'Quote page - ' + address.description });
            } else {
              $analytics.eventTrack('Ineligible address', { category: 'area', label: 'Quote page - ' + address.description });
            }
          });
      }
    }

    function finalStep() {
      if (!vm.emailSent && !vm.quote.clientNo) {
        if (vm.quote.clientFollowup) {
          $analytics.eventTrack('Send quote with followup', { category: 'sales', label: vm.quote.total });
        } else {
          $analytics.eventTrack('Send quote without followup', { category: 'sales', label: vm.quote.total });
        }
        sendEmail(angular.copy(vm.quote));
      }
      vm.step('next');
    }

    function sendEmail(quote) {
      vm.emailSent = true;
      if (!quote.clientNo) EmailService.send('QUOTE_OFFICE', quote);
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
          $mdDialog.confirm().clickOutsideToClose(false).title('You have a quote already started')
          .textContent('Would you like to continue where you left off?').ariaLabel('Would you like to continue where you left off?')
          .ok('Yes please').cancel('No thanks')
        ).then(function() {
          $analytics.eventTrack('Returned to old quote', { category: 'sales', label: angular.copy(vm.quote.total) });
        }, function() {
          $analytics.eventTrack('Returned to new quote', { category: 'sales', label: angular.copy(vm.quote.total) });
          vm.reset();
        });
      }
    }
  }
}());

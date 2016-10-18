(function() {
  'use strict';

  angular
    .module('quotes')
    .controller('QuoteController', QuoteController);

  QuoteController.$inject = ['$q', '$mdDialog', '$http', 'uiGmapGoogleMapApi', 'localStorageService', 'QuoteFactory', 'QUOTE_INITIAL_STATE', 'PREVIEW_IMAGES', 'ACTIONS', 'SERVICE_AREA_BOUNDS'];

  function QuoteController($q, $mdDialog, $http, uiGmapGoogleMapApi, localStorage, QuoteFactory, QUOTE_INITIAL_STATE, PREVIEW_IMAGES, ACTIONS, SERVICE_AREA_BOUNDS) {
    var vm = this;
    vm.quoteForm = {};
    vm.quote = localStorage.get('quote') || angular.copy(QUOTE_INITIAL_STATE);
    vm.selectedItem = vm.quote.serviceAddress ? vm.quote.serviceAddress : ''; // for Autocomplete
    vm.previewImages = PREVIEW_IMAGES;
    vm.actions = ACTIONS;
    vm.dates = configDates();
    vm.select = select;
    vm.reset = reset;
    vm.step = step;
    vm.search = search;
    vm.checkAddress = checkAddress;
    vm.confirm = confirm;
    vm.saltSwitch = saltSwitch;
    vm.sidewalkSwitch = sidewalkSwitch;

    uiGmapGoogleMapApi.then(function(map) {
      vm.gmapsService = new google.maps.places.AutocompleteService();
    });

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
          if (vm.quoteForm.clientNo.$modelValue) {
            $mdDialog.show(
              $mdDialog.confirm()
              .clickOutsideToClose(true)
              .title('Are you sure?')
              .textContent('We take your privacy seriously. We will never sell or reveal your information to a third party.')
              .ariaLabel('We take your privacy seriously. We will never sell or reveal your information to a third party.')
              .ok('Just gimme my quote')
              .cancel('Fair Enough')
            ).then(function() {
              vm.quoteForm.$valid = true;
              vm.quote.noContact = true;
              vm.step('next');
            }, function() {
              vm.quote.clientNo = false;
            });
          }
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

    function search(address) {
      var deferred = $q.defer();
      if (address.length > 2) {
        _getResults(address).then(
          function(predictions) {
            var results = [];
            for (var i = 0; i < predictions.length - 1; i++) {
              results.push(predictions[i]);
            }
            deferred.resolve(results);
          }
        );
      } else { deferred.reject(); }
      return deferred.promise;
    }

    function checkAddress(item) {
      vm.quote.serviceAddress = item.description;
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&place_id=' + item.place_id + '&key=AIzaSyCw8afM0SzdyOsDysY_k_eDzTwunNH2-NY';
      $http.get(url).then(handleRes);

      function handleRes(res) {
        var location = res.data.results[0].geometry.location;
        var verified = _isInsideServiceArea(location);
        vm.quote.verified = verified;
        vm.quote.serviceLatLng = location;
        localStorage.set('quote', vm.quote);
      }
    }

    function _isInsideServiceArea(location) {
      var serviceArea = new google.maps.Polygon({ paths: SERVICE_AREA_BOUNDS });
      var latLng = new google.maps.LatLng(location);
      return google.maps.geometry.poly.containsLocation(latLng, serviceArea);
    }

    function _getResults(address) {
      var deferred = $q.defer();
      var options = { input: address, componentRestrictions: { country: 'ca' } };
      vm.gmapsService.getPlacePredictions(options, function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  }
}());

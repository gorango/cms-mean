(function () {
  'use strict';

  angular
    .module('service')
    .controller('ServiceAreaController', ServiceAreaController)
    .controller('PostalDialogController', PostalDialogController)
    .controller('AddressDialogController', AddressDialogController);

  ServiceAreaController.$inject = ['$mdDialog', 'SERVICE_AREA_MAP_CONFIG', 'SERVICE_AREA_STYLES', 'INNER_SERVICE_AREA_COORDS', 'POSTAL_CODES'];
  PostalDialogController.$inject = ['POSTAL_CODES'];
  AddressDialogController.$inject = ['$mdDialog', '$analytics', 'GeoService'];

  function ServiceAreaController($mdDialog, SERVICE_AREA_MAP_CONFIG, SERVICE_AREA_STYLES, INNER_SERVICE_AREA_COORDS, POSTAL_CODES) {
    var vm = this;
    vm.map = SERVICE_AREA_MAP_CONFIG;
    vm.polygons = [_.merge(SERVICE_AREA_STYLES, { path: INNER_SERVICE_AREA_COORDS })];
    vm.dialog = dialog;

    function dialog(type) {
      switch (type) {
        case 'postal':
          $mdDialog.show({
            clickOutsideToClose: true,
            parent: angular.element(document.body),
            ariaLabel: 'Check by postal',
            templateUrl: '/modules/service/client/views/partials/postal.dialog.client.view.html',
            controller: 'PostalDialogController',
            controllerAs: 'vm'
          });
          break;
        case 'address':
          $mdDialog.show({
            clickOutsideToClose: true,
            parent: angular.element(document.body),
            ariaLabel: 'Check by address',
            templateUrl: '/modules/service/client/views/partials/address.dialog.client.view.html',
            controller: 'AddressDialogController',
            controllerAs: 'vm'
          }).then(function(res) {
            vm.verified = res.verified;
            var icon = vm.verified ? 'blue' : 'red';
            vm.marker = _generateMarker(res.location, icon);
            vm.map.center = angular.copy(vm.marker.coords);
          });
          break;
      }
    }

    function _generateMarker(data, icon) {
      return {
        coords: { latitude: data.lat, longitude: data.lng },
        options: { icon: '/modules/core/client/img/markers/marker-' + icon + '.png' }
      };
    }
  }

  function PostalDialogController(POSTAL_CODES) {
    var vm = this;
    vm.postalCodes = POSTAL_CODES;
  }

  function AddressDialogController($mdDialog, $analytics, GeoService) {
    var vm = this;
    vm.searchAddress = GeoService.searchAddress;
    vm.verifyAddress = verifyAddress;

    function verifyAddress(address) {
      if (address) {
        GeoService.geocode(address)
          .then(function(res) {
            var location = res.data.results[0].geometry.location;
            var verified = GeoService.isInsideServiceArea(location);
            $mdDialog.hide({
              location: location,
              verified: verified
            });
            // Analytics
            if (verified) {
              $analytics.eventTrack('Eligible address', { category: 'area', label: 'Service area page - ' + address.description });
            } else {
              $analytics.eventTrack('Ineligible address', { category: 'area', label: 'Service area page - ' + address.description });
            }
          });
      }
    }
  }
}());

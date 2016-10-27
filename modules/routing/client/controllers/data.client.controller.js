(function() {
  'use strict';

  angular
    .module('routing')
    .controller('RoutingDataController', RoutingDataController)
    .controller('DataImportController', DataImportController)
    .controller('DataExportController', DataExportController);

  RoutingDataController.$inject = ['$http', '$state', 'Upload', 'PlacesService', 'FieldsService'];
  DataImportController.$inject = ['$state', 'Upload', 'PlacesService', 'FieldsService'];
  DataExportController.$inject = ['$http', '$window'];

  function RoutingDataController($http, $state, Upload, PlacesService, FieldsService) {
    var vm = this;

    vm.dropPlaces = dropPlaces;

    function dropPlaces() {
      $http.get('/api/places/drop').then(function() {
        $state.reload();
      });
    }
  }

  function DataImportController($state, Upload, PlacesService, FieldsService) {
    var vm = this;

    vm.upload = upload;

    function upload(file, errFiles) {
      if (file) {
        vm.progress = true;
        file.upload = Upload.upload({
          url: '/api/files',
          data: {
            routingFile: file
          }
        });

        file.upload.then(function(response) {
          vm.progress = false;
          console.log(response);
          $state.go('office.routing.places.list');
        });
      }
    }
  }

  function DataExportController($http, $window) {
    var vm = this;

    vm.exportMethods = [{
      label: 'xlsx'
    }, {
      label: 'garmin'
    }, {
      label: 'geotab'
    }];
    vm.exportTo = exportTo;

    function exportTo(method) {
      $http.get('/api/files?type=' + method.label).then(function(res) {
        $window.open(res.data.slice(1), '_blank');
      });
    }
  }
}());

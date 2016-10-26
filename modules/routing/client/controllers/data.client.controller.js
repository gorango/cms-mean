(function() {
  'use strict';

  angular
    .module('routing')
    .controller('RoutingDataController', RoutingDataController)
    .controller('DataImportController', DataImportController)
    .controller('DataExportController', DataExportController);

  RoutingDataController.$inject = ['$http', '$state', 'Upload', 'PlacesService', 'FieldsService'];
  DataImportController.$inject = ['$state', 'Upload', 'PlacesService', 'FieldsService'];
  DataExportController.$inject = ['PlacesService'];

  function RoutingDataController($http, $state, Upload, PlacesService, FieldsService) {
    var vm = this;

    vm.upload = upload;
    vm.create = create;

    init();

    function init() {
      PlacesService.query(ensurePlaces);

      function ensurePlaces(places) {
        if (!places.length) {
          console.log('no places..');
        }
      }
    }

    function create() {}

    function upload(file, errFiles) {
      if (file) {
        vm.progress = {
          mode: 'indeterminate'
        };
        file.upload = Upload.upload({
          url: '/api/files',
          data: {
            routingFile: file
          }
        });

        file.upload.then(function(response) {
          vm.progress = undefined;
        });
      }
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

  function DataExportController(PlacesService) {
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
      console.log(method);
    }
  }
}());

(function() {
  'use strict';

  angular
    .module('routing')
    .controller('RoutingDataController', RoutingDataController)
    .controller('DataImportController', DataImportController);

  RoutingDataController.$inject = ['$http', '$state', 'Upload', 'PlacesService', 'FieldsService'];
  DataImportController.$inject = ['Upload', 'PlacesService', 'FieldsService'];

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
        vm.progress = { mode: 'indeterminate' };
        file.upload = Upload.upload({
          url: '/api/files',
          data: {
            routingFile: file
          }
        });

        file.upload.then(function (response) {
          vm.progress = undefined;
        });
      }
    }
  }

  function DataImportController(Upload, PlacesService, FieldsService) {
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

        file.upload.then(function (response) {
          vm.progress = false;
        });
      }
    }
  }
}());

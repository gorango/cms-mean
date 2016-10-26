(function() {
  'use strict';

  angular
    .module('routing')
    .controller('PlacesController', PlacesController)
    .controller('PlacesFieldsController', PlacesFieldsController)
    .controller('PlacesPanelController', PlacesPanelController);

  PlacesController.$inject = ['$mdPanel', 'PlacesService', 'FieldsService', 'GeoService'];
  PlacesFieldsController.$inject = ['FieldsService'];
  PlacesPanelController.$inject = ['$state', 'mdPanelRef', 'PlacesService', 'FieldsService', 'GeoService'];

  function PlacesController($mdPanel, PlacesService, FieldsService, GeoService) {
    var vm = this;

    vm.places = PlacesService.query();
    vm.addPlace = modifyPlace;
    vm.modifyPlace = modifyPlace;
    vm.searchAddress = GeoService.searchAddress;

    function modifyPlace(place) {
      var config = {
        attachTo: angular.element(document.body),
        controller: 'PlacesPanelController',
        controllerAs: 'panel',
        disableParentScroll: false,
        templateUrl: '/modules/routing/client/views/partials/data-places-new.client.view.html',
        hasBackdrop: true,
        position: $mdPanel.newPanelPosition().absolute().center(),
        locals: {
          places: vm.places,
          place: place,
          address: vm.selectedItem || undefined
        },
        trapFocus: true,
        zIndex: 3,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      };
      $mdPanel.open(config);
    }
  }

  function PlacesFieldsController(FieldsService) {
    var vm = this;

    vm.blankField = { value: '' };
    vm.addField = addField;
    vm.removeField = removeField;

    setView();

    function setView() {
      FieldsService.query(function(fields) {
        vm.fields = fields;
      });
      vm.newField = angular.copy(vm.blankField);
    }


    function addField() {
      var field = new FieldsService(vm.newField);
      field.$save();
      setView();
    }

    function removeField(field) {
      field.$delete();
      setView();
    }
  }

  function PlacesPanelController($state, mdPanelRef, PlacesService, FieldsService, GeoService) {
    var vm = this;

    vm.edit = !!vm.place;
    vm.fields = FieldsService.query();
    vm.savePlace = savePlace;
    vm.updatePlace = updatePlace;
    vm.updatePlaceField = updatePlaceField;

    function savePlace() {
      vm.place = { fields: {} };
      vm.fields.forEach(function(field) {
        vm.place.fields[field.value] = field.content || '';
      });
      vm.place.address = vm.address.description;
      vm.location = GeoService.geocode(vm.address).then(function(res) {
        var body = res.data;
        if (body.status === 'OK') {
          var location = [
            body.results[0].geometry.location.lng,
            body.results[0].geometry.location.lat
          ];
          vm.place.location = location;
          var place = new PlacesService(vm.place);
          place.$save().then(closePanel);
        }
      });
    }

    function updatePlaceField(key, val) {
      vm.place.fields[key] = val;
    }

    function updatePlace(place) {
      place.$update();
      closePanel();
    }

    function closePanel() {
      mdPanelRef.close().then(function() {
        mdPanelRef.destroy();
        $state.reload();
      });
    }
  }
}());

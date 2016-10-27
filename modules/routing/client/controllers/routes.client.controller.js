(function () {
  'use strict';

  angular
    .module('routing')
    .controller('RoutesController', RoutesController);

  RoutesController.$inject = ['$scope', '$window', '$mdToast', 'RoutesService', 'PlacesService'];

  function RoutesController($scope, $window, $mdToast, RoutesService, PlacesService) {
    var vm = this;

    vm.routePlaces = [];
    vm.onRouteSelected = onRouteSelected;

    $scope.$on('placeClick', getBroadcaseRoutePlaces);
    $scope.$on('routeLoaded', getBroadcaseRoutePlaces);

    function getBroadcaseRoutePlaces(e, model) {
      var route = model;
      getRoutePlaces(route);
    }

    function getRoutePlaces(route) {
      vm.routePlaces = [];
      if (route && route.places && route.places.length) {
        route.places.forEach(function(place) {
          vm.routePlaces.push(place);
        });
      }
    }

    function onRouteSelected(route) {
      $scope.$emit('routeSelected', route);
      getRoutePlaces(route);
    }
  }
}());

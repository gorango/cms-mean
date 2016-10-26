(function () {
  'use strict';

  angular
    .module('routing')
    .controller('RoutingController', RoutingController);

  RoutingController.$inject = ['$scope', '$state', '$timeout', '$mdToast', 'RoutesService', 'PlacesService', 'GeoService', 'FieldsService', 'ROUTING_MAP_CONFIG', 'CIRCLES_CONFIG', 'SERVICE_AREA_STYLES', 'INNER_SERVICE_AREA_COORDS'];

  function RoutingController($scope, $state, $timeout, $mdToast, RoutesService, PlacesService, GeoService, FieldsService, ROUTING_MAP_CONFIG, CIRCLES_CONFIG, SERVICE_AREA_STYLES, INNER_SERVICE_AREA_COORDS) {
    var vm = this;

    vm.polygons = [];
    vm.polyline = { path: [], stroke: CIRCLES_CONFIG.green.stroke };
    vm.markers = [];
    vm.map = ROUTING_MAP_CONFIG;
    // vm.routes = RoutesService.query();
    vm.places = PlacesService.query();
    vm.toggleServiceArea = toggleServiceArea;
    vm.searchPlaces = searchPlaces;
    vm.removePlace = removePlace;
    vm.circleEvents = circleEvents();
    vm.placeEvents = placeEvents();

    $scope.$on('$stateChangeSuccess', init);

    function init() {
      _getActiveRoutes();
      PlacesService.query(function(places) {
        vm.places = places;
        searchPlaces();
      });
    }

    function toggleServiceArea() {
      var polygons = [_.merge(SERVICE_AREA_STYLES, { path: INNER_SERVICE_AREA_COORDS })];
      var currentPoly = angular.copy(vm.polygons);
      var same = currentPoly.length === polygons.length;
      vm.polygons = same ? [] : polygons;
    }

    function _getActiveRoute(i) {
      if ($state.current.name.indexOf('routing') > -1) {
        var activeRoute = $state.current.name.split('.')[i];
        return activeRoute;
      }
    }

    function _getActiveRoutes() {
      $timeout(function() {
        vm.activeParentRoute = _getActiveRoute(2);
        vm.activeChildRoute = _getActiveRoute(3);
      });
    }

    function searchPlaces(value) {
      if (value && value.length) {
        vm.displayPlaces = vm.places.filter(function(place) {
          place.circle = angular.copy(_.merge(CIRCLES_CONFIG.base, CIRCLES_CONFIG.red));
          return place.address.toLowerCase().match(value);
        });
        return GeoService.searchAddress(value);
      } else {
        vm.places.forEach(function(place) {
          place.circle = angular.copy(_.merge(CIRCLES_CONFIG.base, CIRCLES_CONFIG.red));
        });
        vm.displayPlaces = vm.places;
      }
    }

    function removePlace(place) {
      vm.places = vm.places.filter(function(p) { return p !== place; });
      place.$delete();
      searchPlaces();
    }

    function circleEvents() {
      return {
        mouseenter: function(place) {
          vm.markers = [];
          var marker = {
            click: {},
            options: {
              icon: '/modules/core/client/img/markers/marker-red.png'
            },
            events: {},
            control: {},
            coords: place.location
          };
          vm.markers.push(marker);
        },
        mouseleave: function(place) {
          vm.markers = [];
        }
      };
    }

    function placeEvents() {
      return {
        click: function(circle, e, model, args) {
          vm.polyline.path = vm.polyline.path.concat(circle.center);
          console.log(vm.polylines);
          $scope.$broadcast('placeClick', model);
        }
      };
    }
  }
}());

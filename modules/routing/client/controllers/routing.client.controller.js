(function () {
  'use strict';

  angular
    .module('routing')
    .controller('RoutingController', RoutingController);

  RoutingController.$inject = ['$scope', '$state', '$timeout', 'uiGmapIsReady', '$mdToast', '$mdDialog', 'RoutesService', 'PlacesService', 'GeoService', 'FieldsService', 'ROUTING_MAP_CONFIG', 'CIRCLES_CONFIG', 'SERVICE_AREA_STYLES', 'INNER_SERVICE_AREA_COORDS'];

  function RoutingController($scope, $state, $timeout, uiGmapIsReady, $mdToast, $mdDialog, RoutesService, PlacesService, GeoService, FieldsService, ROUTING_MAP_CONFIG, CIRCLES_CONFIG, SERVICE_AREA_STYLES, INNER_SERVICE_AREA_COORDS) {
    var vm = this;

    vm.polygons = [];
    vm.polyline = { path: [], stroke: CIRCLES_CONFIG.green.stroke };
    vm.markers = [];
    vm.map = ROUTING_MAP_CONFIG;

    vm.places;
    vm.routes;
    vm.route;

    vm.toggleServiceArea = toggleServiceArea;
    vm.searchPlaces = searchPlaces;
    vm.removePlace = removePlace;

    vm.newTab = { title: '' };
    vm.addRoute = addRoute;
    vm.removeRoute = removeRoute;
    vm.clearRoute = clearRoute;
    vm.reorderInRoute = reorderInRoute;
    vm.reorderInRoutePrompt = reorderInRoutePrompt;
    vm.removeFromRoute = removeFromRoute;
    vm.updateRoute = updateRoute;

    vm.circleEvents = circleEvents();
    vm.placeEvents = placeEvents();

    $scope.$on('$stateChangeSuccess', init);
    $scope.$on('routeSelected', routeSelected);

    function init() {
      uiGmapIsReady.promise(1).then(function(instances) {
        vm.gmap = instances[0];
        _getActiveStates();
        PlacesService.query(function(places) {
          vm.places = places;
          searchPlaces();
        });
        RoutesService.query(function(routes) {
          vm.routes = routes;
          if (routes.length) {
            vm.route = routes[routes.length - 1];
            vm.activeRoute = routes.length - 1;
            $scope.$broadcast('routeLoaded', vm.route);
            drawDirections({}, vm.route);
          }
        });
      });
    }

    function drawDirections(e, route) {
      if (route && route.places) {
        vm.polyline.path = [];
        route.places.forEach(function(place) {
          if (place && place.location) {
            var center = new google.maps.LatLng(place.location[1], place.location[0]);
            vm.polyline.path = vm.polyline.path.concat(center);
          }
        });
      }
    }

    function routeSelected(e, route) {
      vm.route = route;
      drawDirections({}, route);
    }

    function toggleServiceArea() {
      var polygons = [_.merge(SERVICE_AREA_STYLES, { path: INNER_SERVICE_AREA_COORDS })];
      var currentPoly = angular.copy(vm.polygons);
      var same = currentPoly.length === polygons.length;
      vm.polygons = same ? [] : polygons;
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

    // Routes CRUD
    // =========================================================================

    function addToRoute(place) {
      vm.route.places.push(place);
      $scope.$broadcast('placeClick', vm.route);
      drawDirections({}, vm.route);
    }

    function removeFromRoute(place) {
      var routeIndex = vm.route.places.indexOf(place);
      vm.route.places.splice(routeIndex, 1);
      $scope.$broadcast('placeClick', vm.route);
      drawDirections({}, vm.route);
    }

    function reorderInRoute(place, index) {
      var routeIndex = vm.route.places.indexOf(place);
      vm.route.places.splice(routeIndex, 1);
      vm.route.places.splice(index, 0, place);
      $scope.$broadcast('placeClick', vm.route);
      drawDirections({}, vm.route);
    }

    function reorderInRoutePrompt(place) {
      var confirm = $mdDialog.prompt()
        .title('Enter a new position')
        .placeholder('Order number')
        .ariaLabel('Order number')
        .initialValue('')
        .ok('Confirm')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        var routeIndex = vm.route.places.indexOf(place);
        var newIndex = Number(result) - 1;
        vm.route.places.splice(routeIndex, 1);
        vm.route.places.splice(newIndex, 0, place);
        $scope.$broadcast('placeClick', vm.route);
        drawDirections({}, vm.route);
      });
    }

    function addRoute() {
      if (vm.newTab.title.length) {
        var newRoute = new RoutesService(vm.newTab);
        newRoute.$save(function(route) {
          vm.route = route;
          $scope.$broadcast('routeLoaded', vm.route);
          vm.routes.push(route);
          drawDirections({}, vm.route);
        }, function(err) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('A route by that name already exists')
              .position('bottom right')
              .hideDelay(3000)
            );
        });
      }
    }

    function removeRoute(route) {
      var i = vm.routes.indexOf(route);
      route.$delete();
      vm.routes.splice(i, 1);
      vm.route = vm.routes.length ? vm.routes[0] : {};
      drawDirections({}, vm.route);
    }

    function clearRoute(route) {
      route.places = [];
      vm.route = route;
      route.$update().then(function() {
        $scope.$broadcast('routeLoaded', route);
        drawDirections({}, route);
      });
    }

    function updateRoute(route) {
      vm.route = route;
      route.$update().then(function() {
        $scope.$broadcast('routeLoaded', route);
        drawDirections({}, route);
      });
    }

    // Events
    // =========================================================================

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
          if (vm.route) {
            var place = model.$parent.place;
            var placeIndex = vm.route.places.indexOf(place);
            if (placeIndex < 0) {
              addToRoute(place);
            } else {
              removeFromRoute(place);
            }
          }
        }
      };
    }

    function _getActiveState(i) {
      if ($state.current.name.indexOf('routing') > -1) {
        var activeRoute = $state.current.name.split('.')[i];
        return activeRoute;
      }
    }

    function _getActiveStates() {
      $timeout(function() {
        vm.activeParentRoute = _getActiveState(2);
        vm.activeChildRoute = _getActiveState(3);
        vm.activeTrack = _getActiveState(4);
      });
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('routing')
    .controller('RoutesController', RoutesController);

  RoutesController.$inject = ['$scope', '$window', '$mdToast', 'RoutesService', 'PlacesService'];

  function RoutesController($scope, $window, $mdToast, RoutesService, PlacesService) {
    var vm = this;

    vm.newTab = { title: '' };
    vm.routePlaces = [];
    vm.activeRoute = 0;
    vm.routes = RoutesService.query();
    // vm.places = PlacesService.query();
    vm.addRoute = addRoute;
    vm.removeRoute = removeRoute;
    vm.removeFromRoute = removeFromRoute;
    vm.onRouteSelected = onRouteSelected;

    $scope.$on('placeClick', function(e, model) {
      var place = model.$parent.place;
      place.routes.push({ route: vm.routes[vm.activeRoute]._id });
      var newRoutePlaces = vm.routePlaces.concat(place);
      vm.routePlaces = newRoutePlaces;
      // place.$update({ routes: place.routes });
      // console.log(place);
      // getRoutePlaces();
    });

    // init();
    //
    // function init() {
    //   RoutesService.query(function(routes) {
    //     vm.routes = routes;
    //   });
    // }

    // function getRoutePlaces() {
    //   PlacesService.query(function(places) {
    //     vm.routePlaces = places.filter(function(place) {
    //       if (place.routes.length) {
    //         console.log(place.routes);
    //         return place.routes.forEach(function(route) {
    //           var isOnRoute = route.route === vm.routes[vm.activeRoute]._id;
    //           return isOnRoute;
    //         });
    //       }
    //       return [];
    //     });
    //   });
    // }
    //

    function onRouteSelected(route) {
      $scope.$emit('routeSelected', route);
      // vm.route = RoutesService.get({
      //   trackId: route._id
      // });
    }

    function addRoute() {
      if (vm.newTab.title.length) {
        var newRoute = new RoutesService(vm.newTab);
        newRoute.$save(function(route) {
          vm.routes.push(route);
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
    }

    function removeFromRoute(place) {
      console.log(place);
    }
  }
}());

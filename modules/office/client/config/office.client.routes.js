(function () {
  'use strict';

  angular
    .module('office.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('office', {
        url: '/office',
        templateUrl: '/modules/office/client/views/office.client.view.html',
        controller: 'OfficeController',
        controllerAs: 'vm',
        redirectTo: 'office.dashboard',
        data: {
          roles: ['user']
        }
      })
      .state('office.dashboard', {
        url: '',
        templateUrl: '/modules/office/client/views/office-dashboard.client.view.html',
        controller: 'OfficeDashboardController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dashboard'
        }
      })
      .state('office.updates', {
        url: '/updates',
        templateUrl: '/modules/updates/client/views/admin/manage-updates.client.view.html',
        controller: 'ManageUpdatesController',
        controllerAs: 'vm'
      })
      /*
       * Routing Routes
       */
      .state('office.routing', {
        url: '/routing',
        redirectTo: 'office.routing.routes',
        templateUrl: '/modules/routing/client/views/routing.client.view.html',
        controller: 'RoutingController',
        controllerAs: 'parent',
        data: {
          pageTitle: 'Routing'
        }
      })
      /*
       * ROUTES (Routing Child)
       */
      .state('office.routing.routes', {
        url: '/routes',
        templateUrl: '/modules/routing/client/views/list-routes.client.view.html',
        controller: 'RoutesController',
        controllerAs: 'vm'
      })
      /*
       * PLACES (Routing Child)
       */
      .state('office.routing.places', {
        url: '/places',
        redirectTo: 'office.routing.places.list',
        templateUrl: '/modules/routing/client/views/places.client.view.html',
        controller: 'PlacesController',
        controllerAs: 'vm'
      })
      .state('office.routing.places.list', {
        url: '/',
        templateUrl: '/modules/routing/client/views/list-places.client.view.html'
      })
      .state('office.routing.places.fields', {
        url: '/fields',
        templateUrl: '/modules/routing/client/views/places-fields.client.view.html',
        controller: 'PlacesFieldsController',
        controllerAs: 'vm'
      })
      /*
       * DATA (Routing Child)
       */
      .state('office.routing.data', {
        url: '/data',
        redirectTo: 'office.routing.data.import',
        templateUrl: '/modules/routing/client/views/data.client.view.html',
        controller: 'RoutingDataController',
        controllerAs: 'child'
      })
      .state('office.routing.data.import', {
        url: '/',
        templateUrl: '/modules/routing/client/views/data-import.client.view.html',
        controller: 'DataImportController',
        controllerAs: 'vm'
      })
      .state('office.routing.data.export', {
        url: '/export',
        templateUrl: '/modules/routing/client/views/data-export.client.view.html',
        controller: 'DataExportController',
        controllerAs: 'vm'
      });
  }
}());

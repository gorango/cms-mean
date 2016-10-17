(function () {
  'use strict';

  angular
    .module('info.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.info', {
        abstract: true,
        url: '/info',
        template: '<ui-view/>'
      })
      .state('admin.info.list', {
        url: '',
        templateUrl: '/modules/info/client/views/admin/list-info.client.view.html',
        controller: 'InfoAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.info.create', {
        url: '/create',
        templateUrl: '/modules/info/client/views/admin/form-info.client.view.html',
        controller: 'InfoAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          infoResolve: newInfo
        }
      })
      .state('admin.info.edit', {
        url: '/:infoId/edit',
        templateUrl: '/modules/info/client/views/admin/form-info.client.view.html',
        controller: 'InfoAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          infoResolve: getInfo
        }
      });
  }

  getInfo.$inject = ['$stateParams', 'InfoService'];

  function getInfo($stateParams, InfoService) {
    return InfoService.get({
      infoId: $stateParams.infoId
    }).$promise;
  }

  newInfo.$inject = ['InfoService'];

  function newInfo(InfoService) {
    return new InfoService();
  }
}());

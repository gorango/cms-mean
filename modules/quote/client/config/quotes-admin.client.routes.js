(function () {
  'use strict';

  angular
    .module('quotes.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.quotes', {
        abstract: true,
        url: '/quotes',
        template: '<ui-view/>'
      })
      .state('admin.quotes.list', {
        url: '',
        templateUrl: '/modules/quotes/client/views/admin/list-quotes.client.view.html',
        controller: 'QuotesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.quotes.create', {
        url: '/create',
        templateUrl: '/modules/quotes/client/views/admin/form-quote.client.view.html',
        controller: 'QuotesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          quoteResolve: newQuote
        }
      })
      .state('admin.quotes.edit', {
        url: '/:quoteId/edit',
        templateUrl: '/modules/quotes/client/views/admin/form-quote.client.view.html',
        controller: 'QuotesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          quoteResolve: getQuote
        }
      });
  }

  getQuote.$inject = ['$stateParams', 'QuotesService'];

  function getQuote($stateParams, QuotesService) {
    return QuotesService.get({
      quoteId: $stateParams.quoteId
    }).$promise;
  }

  newQuote.$inject = ['QuotesService'];

  function newQuote(QuotesService) {
    return new QuotesService();
  }
}());

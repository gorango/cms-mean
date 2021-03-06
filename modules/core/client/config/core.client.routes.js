(function() {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .rule(function($injector, $location) {
        var path = $location.path();
        var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

        if (hasTrailingSlash) {
          // if last character is a slash, return the same url without the slash
          var newPath = path.substr(0, path.length - 1);
          $location.replace().path(newPath);
        }
      })
      // Forcing logged in user to the backend
      .rule(function($injector, $location) {
        if (window.user && $location.path().indexOf('office') < 0) {
          $location.replace().path('/office');
        }
      });

    // Redirect to 404 when route not found
    $urlRouterProvider
      .otherwise(function($injector, $location) {
        $injector.get('$state').transitionTo('not-found', null, {
          location: false
        });
      });

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/modules/core/client/views/pages/home.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Residential Snow Clearing'
        }
      })
      .state('contact', {
        url: '/contact',
        templateUrl: '/modules/core/client/views/pages/contact.client.view.html',
        controller: 'ContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contact Us'
        }
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: '/modules/core/client/views/pages/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Not Found'
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: '/modules/core/client/views/pages/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Bad Request'
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: '/modules/core/client/views/pages/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      });
  }
}());

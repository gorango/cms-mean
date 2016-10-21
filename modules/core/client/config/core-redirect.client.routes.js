(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('old', {
        url: '/',
        abstract: true
      })
      .state('about', {
        url: '/about',
        redirectTo: 'service.process'
      })
      .state('service-area', {
        url: '/service-area',
        redirectTo: 'service.area'
      })
      .state('quote', {
        url: '/quote',
        redirectTo: 'service.quote'
      })
      .state('register', {
        url: '/register',
        redirectTo: 'service.register'
      })
      .state('confirmation', {
        url: '/confirmation',
        redirectTo: 'checkout.confirm'
      })
      .state('benefits', {
        url: '/benefits',
        redirectTo: 'service.benefits'
      })
      .state('opportunities', {
        url: '/opportunities',
        redirectTo: 'info.opportunities'
      })
      .state('frequently-asked-questions', {
        url: '/frequently-asked-questions',
        redirectTo: 'info.faq'
      })
      .state('updates', {
        url: '/updates',
        redirectTo: 'info.updates'
      })
      .state('documents', {
        url: '/documents',
        redirectTo: 'legal.terms'
      })
      .state('terms-and-conditions', {
        url: '/terms-and-conditions',
        redirectTo: 'legal.terms'
      })
      .state('privacy-policy', {
        url: '/privacy-policy',
        redirectTo: 'legal.privacy'
      })
      .state('service-agreement', {
        url: '/service-agreement',
        redirectTo: 'legal.agreement'
      });
  }
}());

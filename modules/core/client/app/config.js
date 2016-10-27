(function (window) {
  'use strict';

  var applicationModuleName = 'cms';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: [
      'ngResource',
      'ngMessages',
      'ngAnimate',
      'ngAria',
      'ngMaterial',
      'ui.router',
      'LocalStorageModule',
      'ngFileUpload',
      'uiGmapgoogle-maps',
      'angulartics',
      'angulartics.google.analytics'
    ],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }
}(window));

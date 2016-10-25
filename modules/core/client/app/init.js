(function(app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig)
    .run(bootstrapRun);

  bootstrapConfig.$inject = ['$provide', '$compileProvider', '$locationProvider', '$httpProvider', '$logProvider', '$mdIconProvider', '$mdThemingProvider', 'localStorageServiceProvider', 'uiGmapGoogleMapApiProvider'];
  bootstrapRun.$inject = ['$rootScope', '$state', '$templateRequest'];

  function bootstrapConfig($provide, $compileProvider, $locationProvider, $httpProvider, $logProvider, $mdIconProvider, $mdThemingProvider, localStorageServiceProvider, uiGmapGoogleMapApiProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');

    // Register custom theme
    $mdThemingProvider
      .theme('default')
      .primaryPalette('blue')
      .accentPalette('blue-grey', { 'default': '100' })
      .warnPalette('red');

    $mdThemingProvider
      .theme('alt')
      .primaryPalette('blue')
      .accentPalette('blue-grey', { 'default': '500' })
      .warnPalette('green');

    localStorageServiceProvider.setPrefix('cms');

    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBbv92i2n2EwboM3pYKPlTkJPz9eV4XaSs',
      libraries: ['geometry', 'places']
    });

    // Use md-button for file upload
    // https://github.com/angular/material/issues/2151#issuecomment-189975649
    $provide.decorator('mdButtonDirective', ['$delegate',
      function($delegate) {
        var getTemplate = $delegate[0].template;
        $delegate[0].template = function($element, $attrs) {
          if ($attrs.type === 'file') {
            return '<label class="md-button" ng-transclude></label>';
          } else {
            return getTemplate($element, $attrs);
          }
        };
        return $delegate;
      }
    ]);
  }

  function bootstrapRun($rootScope, $state, $templateRequest) {
    $rootScope.$on('$stateChangeStart', function(e, toState, params) {
      document.body.scrollTop = 0;
      if (toState.redirectTo) {
        e.preventDefault();
        $state.go(toState.redirectTo, params, { location: 'replace' });
      }
    });
  }

  // Then define the init function for starting up the application
  angular.element(document).ready(init);

  function init() {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    angular.bootstrap(document, [app.applicationModuleName]);
  }
}(ApplicationConfiguration));

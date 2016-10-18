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

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider', '$mdIconProvider', '$mdThemingProvider', 'localStorageServiceProvider', 'uiGmapGoogleMapApiProvider'];
  bootstrapRun.$inject = ['$rootScope', '$state', '$templateRequest'];

  var iconUrls = ['cli_cloud_drizzle_sun', 'cli_cloud_drizzle', 'cli_cloud_fog_sun', 'cli_cloud_fog', 'cli_cloud_hail_sun', 'cli_cloud_hail', 'cli_cloud_lightning_sun', 'cli_cloud_lightning', 'cli_cloud_rain_sun', 'cli_cloud_rain', 'cli_cloud_snow_sun', 'cli_cloud_snow', 'cli_cloud_sun', 'cli_cloud', 'cli_cloud_wind_sun', 'cli_cloud_wind', 'cli_compass_east', 'cli_compass_north', 'cli_compass_south', 'cli_compass', 'cli_compass_west', 'cli_degrees_celcius', 'cli_degrees_fahrenheit', 'cli_moon_first_quarter', 'cli_moon_full', 'cli_moon_last_quarter', 'cli_moon_new', 'cli_moon', 'cli_moon_waning_crescent', 'cli_moon_waning_gibbous', 'cli_moon_waxing_crescent', 'cli_moon_waxing_gibbous', 'cli_shades', 'cli_snowflake', 'cli_sun_lower', 'cli_sun_low', 'cli_sunrise', 'cli_sunset', 'cli_sun', 'cli_thermometer_100', 'cli_thermometer_25', 'cli_thermometer_50', 'cli_thermometer_75', 'cli_thermometer', 'cli_thermometer_zero', 'cli_tornado', 'cli_umbrella', 'cli_wind'];

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider, $mdIconProvider, $mdThemingProvider, localStorageServiceProvider, uiGmapGoogleMapApiProvider) {
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
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('blue-grey', {
        'default': '100'
      })
      .warnPalette('red');

    // $mdIconProvider.iconSet('cli', '/modules/core/client/img/icons/climate-icons.svg');
    angular.forEach(iconUrls, function(name) {
      var url = '/modules/core/client/img/icons/' + name + '.svg';
      $mdIconProvider.icon(name, url, 100);
    });

    localStorageServiceProvider.setPrefix('cms');

    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBbv92i2n2EwboM3pYKPlTkJPz9eV4XaSs',
      libraries: ['geometry', 'places']
    });
  }

  function bootstrapRun($rootScope, $state, $templateRequest) {
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, { location: 'replace' });
      }
    });

    // Pre-fetch icons sources by URL and cache in the $templateCache...
    // subsequent $templateRequest calls will look there first.
    // $templateRequest('/modules/core/client/img/icons/climate-icons.svg');
    angular.forEach(iconUrls, function(name) {
      var url = '/modules/core/client/img/icons/' + name + '.svg';
      $templateRequest(url);
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

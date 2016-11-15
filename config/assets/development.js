'use strict';

module.exports = {
  client: {
    less: [
      'modules/**/*.less'
    ],
    sass: [
      'modules/**/*.scss'
    ],
    lib: {
      css: [
        // bower:css
        'public/lib/angular-material/angular-material.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-local-storage/dist/angular-local-storage.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/lodash/dist/lodash.js',
        'public/lib/skycons/skycons.js',
        'public/lib/angular-simple-logger/dist/angular-simple-logger.js',
        'public/lib/angular-google-maps/dist/angular-google-maps.js',
        'public/lib/angulartics/src/angulartics.js',
        'public/lib/angulartics-google-analytics/lib/angulartics-ga.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    }
  }
};

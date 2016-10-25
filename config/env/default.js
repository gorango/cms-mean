'use strict';

module.exports = {
  app: {
    title: 'ClearMySnow',
    domain: 'https://staging.clearmysnow.com',
    description: 'Residential Snow Clearing',
    keywords: 'snow removal, snow clearing, residential snow removal, residential snow clearing',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID
  },
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET,
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/',
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    },
    routingUpload: {
      dest: './modules/routing/client/uploads/',
      filename: 'cms.xlsx'
    }
  },
  shared: {
    // owasp: {
    //   allowPassphrases: true,
    //   maxLength: 128,
    //   minLength: 10,
    //   minPhraseLength: 20,
    //   minOptionalTestsToPass: 4
    // }
  }

};

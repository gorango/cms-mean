'use strict';

var fs = require('fs');

module.exports = {
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt'
  },
  port: process.env.PORT,
  host: process.env.HOST,
  db: {
    uri: process.env.DB_LOCATION,
    options: {
      user: process.env.DB_USER,
      pass: process.env.DB_PASS
      /**
        * Uncomment to enable ssl certificate based authentication to mongodb
        * servers. Adjust the settings below for your specific certificate
        * setup.
      server: {
        ssl: true,
        sslValidate: false,
        checkServerIdentity: false,
        sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
        sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
        sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
        sslPass: '1234'
      }
      */
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  mailer: {
    from: process.env.MAILER_FROM,
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER,
      auth: {
        user: process.env.MAILER_EMAIL_ID,
        pass: process.env.MAILER_PASSWORD
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME,
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL,
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME,
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL,
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID,
    clientSecret: process.env.PAYPAL_SECRET,
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  }
};

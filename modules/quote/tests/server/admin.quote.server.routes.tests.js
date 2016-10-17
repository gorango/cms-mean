'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quote = mongoose.model('Quote'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  quote;

/**
 * Quote routes tests
 */
describe('Quote Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new quote
    user.save(function () {
      quote = {
        title: 'Quote Title',
        content: 'Quote Content'
      };

      done();
    });
  });

  it('should be able to save an quote if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(200)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Handle quote save error
            if (quoteSaveErr) {
              return done(quoteSaveErr);
            }

            // Get a list of quotes
            agent.get('/api/quotes')
              .end(function (quotesGetErr, quotesGetRes) {
                // Handle quote save error
                if (quotesGetErr) {
                  return done(quotesGetErr);
                }

                // Get quotes list
                var quotes = quotesGetRes.body;

                // Set assertions
                (quotes[0].user._id).should.equal(userId);
                (quotes[0].title).should.match('Quote Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an quote if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(200)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Handle quote save error
            if (quoteSaveErr) {
              return done(quoteSaveErr);
            }

            // Update quote title
            quote.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing quote
            agent.put('/api/quotes/' + quoteSaveRes.body._id)
              .send(quote)
              .expect(200)
              .end(function (quoteUpdateErr, quoteUpdateRes) {
                // Handle quote update error
                if (quoteUpdateErr) {
                  return done(quoteUpdateErr);
                }

                // Set assertions
                (quoteUpdateRes.body._id).should.equal(quoteSaveRes.body._id);
                (quoteUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an quote if no title is provided', function (done) {
    // Invalidate title field
    quote.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(422)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Set message assertion
            (quoteSaveRes.body.message).should.match('Title cannot be blank');

            // Handle quote save error
            done(quoteSaveErr);
          });
      });
  });

  it('should be able to delete an quote if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(200)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Handle quote save error
            if (quoteSaveErr) {
              return done(quoteSaveErr);
            }

            // Delete an existing quote
            agent.delete('/api/quotes/' + quoteSaveRes.body._id)
              .send(quote)
              .expect(200)
              .end(function (quoteDeleteErr, quoteDeleteRes) {
                // Handle quote error error
                if (quoteDeleteErr) {
                  return done(quoteDeleteErr);
                }

                // Set assertions
                (quoteDeleteRes.body._id).should.equal(quoteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single quote if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new quote model instance
    quote.user = user;
    var quoteObj = new Quote(quote);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(200)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Handle quote save error
            if (quoteSaveErr) {
              return done(quoteSaveErr);
            }

            // Get the quote
            agent.get('/api/quotes/' + quoteSaveRes.body._id)
              .expect(200)
              .end(function (quoteInfoErr, quoteInfoRes) {
                // Handle quote error
                if (quoteInfoErr) {
                  return done(quoteInfoErr);
                }

                // Set assertions
                (quoteInfoRes.body._id).should.equal(quoteSaveRes.body._id);
                (quoteInfoRes.body.title).should.equal(quote.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (quoteInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Quote.remove().exec(done);
    });
  });
});

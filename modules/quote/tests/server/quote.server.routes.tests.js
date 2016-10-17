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
describe('Quote CRUD tests', function () {

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

  it('should not be able to save an quote if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/quotes')
          .send(quote)
          .expect(403)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Call the assertion callback
            done(quoteSaveErr);
          });

      });
  });

  it('should not be able to save an quote if not logged in', function (done) {
    agent.post('/api/quotes')
      .send(quote)
      .expect(403)
      .end(function (quoteSaveErr, quoteSaveRes) {
        // Call the assertion callback
        done(quoteSaveErr);
      });
  });

  it('should not be able to update an quote if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/quotes')
          .send(quote)
          .expect(403)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Call the assertion callback
            done(quoteSaveErr);
          });
      });
  });

  it('should be able to get a list of quotes if not signed in', function (done) {
    // Create new quote model instance
    var quoteObj = new Quote(quote);

    // Save the quote
    quoteObj.save(function () {
      // Request quotes
      request(app).get('/api/quotes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single quote if not signed in', function (done) {
    // Create new quote model instance
    var quoteObj = new Quote(quote);

    // Save the quote
    quoteObj.save(function () {
      request(app).get('/api/quotes/' + quoteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', quote.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single quote with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/quotes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Quote is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single quote which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent quote
    request(app).get('/api/quotes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No quote with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an quote if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/quotes')
          .send(quote)
          .expect(403)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Call the assertion callback
            done(quoteSaveErr);
          });
      });
  });

  it('should not be able to delete an quote if not signed in', function (done) {
    // Set quote user
    quote.user = user;

    // Create new quote model instance
    var quoteObj = new Quote(quote);

    // Save the quote
    quoteObj.save(function () {
      // Try deleting quote
      request(app).delete('/api/quotes/' + quoteObj._id)
        .expect(403)
        .end(function (quoteDeleteErr, quoteDeleteRes) {
          // Set message assertion
          (quoteDeleteRes.body.message).should.match('User is not authorized');

          // Handle quote error error
          done(quoteDeleteErr);
        });

    });
  });

  it('should be able to get a single quote that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new quote
          agent.post('/api/quotes')
            .send(quote)
            .expect(200)
            .end(function (quoteSaveErr, quoteSaveRes) {
              // Handle quote save error
              if (quoteSaveErr) {
                return done(quoteSaveErr);
              }

              // Set assertions on new quote
              (quoteSaveRes.body.title).should.equal(quote.title);
              should.exist(quoteSaveRes.body.user);
              should.equal(quoteSaveRes.body.user._id, orphanId);

              // force the quote to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(quoteInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single quote if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new quote model instance
    var quoteObj = new Quote(quote);

    // Save the quote
    quoteObj.save(function () {
      request(app).get('/api/quotes/' + quoteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', quote.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single quote, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'quoteowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Quote
    var _quoteOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _quoteOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Quote
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new quote
          agent.post('/api/quotes')
            .send(quote)
            .expect(200)
            .end(function (quoteSaveErr, quoteSaveRes) {
              // Handle quote save error
              if (quoteSaveErr) {
                return done(quoteSaveErr);
              }

              // Set assertions on new quote
              (quoteSaveRes.body.title).should.equal(quote.title);
              should.exist(quoteSaveRes.body.user);
              should.equal(quoteSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (quoteInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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

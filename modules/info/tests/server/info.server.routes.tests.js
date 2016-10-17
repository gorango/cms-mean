'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Info = mongoose.model('Info'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  info;

/**
 * Info routes tests
 */
describe('Info CRUD tests', function () {

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

    // Save a user to the test db and create new info
    user.save(function () {
      info = {
        title: 'Info Title',
        content: 'Info Content'
      };

      done();
    });
  });

  it('should not be able to save an info if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/info')
          .send(info)
          .expect(403)
          .end(function (infoSaveErr, infoSaveRes) {
            // Call the assertion callback
            done(infoSaveErr);
          });

      });
  });

  it('should not be able to save an info if not logged in', function (done) {
    agent.post('/api/info')
      .send(info)
      .expect(403)
      .end(function (infoSaveErr, infoSaveRes) {
        // Call the assertion callback
        done(infoSaveErr);
      });
  });

  it('should not be able to update an info if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/info')
          .send(info)
          .expect(403)
          .end(function (infoSaveErr, infoSaveRes) {
            // Call the assertion callback
            done(infoSaveErr);
          });
      });
  });

  it('should be able to get a list of info if not signed in', function (done) {
    // Create new info model instance
    var infoObj = new Info(info);

    // Save the info
    infoObj.save(function () {
      // Request info
      request(app).get('/api/info')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single info if not signed in', function (done) {
    // Create new info model instance
    var infoObj = new Info(info);

    // Save the info
    infoObj.save(function () {
      request(app).get('/api/info/' + infoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', info.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single info with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/info/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Info is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single info which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent info
    request(app).get('/api/info/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No info with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an info if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/info')
          .send(info)
          .expect(403)
          .end(function (infoSaveErr, infoSaveRes) {
            // Call the assertion callback
            done(infoSaveErr);
          });
      });
  });

  it('should not be able to delete an info if not signed in', function (done) {
    // Set info user
    info.user = user;

    // Create new info model instance
    var infoObj = new Info(info);

    // Save the info
    infoObj.save(function () {
      // Try deleting info
      request(app).delete('/api/info/' + infoObj._id)
        .expect(403)
        .end(function (infoDeleteErr, infoDeleteRes) {
          // Set message assertion
          (infoDeleteRes.body.message).should.match('User is not authorized');

          // Handle info error error
          done(infoDeleteErr);
        });

    });
  });

  it('should be able to get a single info that has an orphaned user reference', function (done) {
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

          // Save a new info
          agent.post('/api/info')
            .send(info)
            .expect(200)
            .end(function (infoSaveErr, infoSaveRes) {
              // Handle info save error
              if (infoSaveErr) {
                return done(infoSaveErr);
              }

              // Set assertions on new info
              (infoSaveRes.body.title).should.equal(info.title);
              should.exist(infoSaveRes.body.user);
              should.equal(infoSaveRes.body.user._id, orphanId);

              // force the info to have an orphaned user reference
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

                    // Get the info
                    agent.get('/api/info/' + infoSaveRes.body._id)
                      .expect(200)
                      .end(function (infoInfoErr, infoInfoRes) {
                        // Handle info error
                        if (infoInfoErr) {
                          return done(infoInfoErr);
                        }

                        // Set assertions
                        (infoInfoRes.body._id).should.equal(infoSaveRes.body._id);
                        (infoInfoRes.body.title).should.equal(info.title);
                        should.equal(infoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single info if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new info model instance
    var infoObj = new Info(info);

    // Save the info
    infoObj.save(function () {
      request(app).get('/api/info/' + infoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', info.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single info, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'infoowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Info
    var _infoOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _infoOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Info
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

          // Save a new info
          agent.post('/api/info')
            .send(info)
            .expect(200)
            .end(function (infoSaveErr, infoSaveRes) {
              // Handle info save error
              if (infoSaveErr) {
                return done(infoSaveErr);
              }

              // Set assertions on new info
              (infoSaveRes.body.title).should.equal(info.title);
              should.exist(infoSaveRes.body.user);
              should.equal(infoSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the info
                  agent.get('/api/info/' + infoSaveRes.body._id)
                    .expect(200)
                    .end(function (infoInfoErr, infoInfoRes) {
                      // Handle info error
                      if (infoInfoErr) {
                        return done(infoInfoErr);
                      }

                      // Set assertions
                      (infoInfoRes.body._id).should.equal(infoSaveRes.body._id);
                      (infoInfoRes.body.title).should.equal(info.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (infoInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Info.remove().exec(done);
    });
  });
});

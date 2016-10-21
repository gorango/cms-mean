'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Route = mongoose.model('Route'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  route;

/**
 * Route routes tests
 */
describe('Route CRUD tests', function () {

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

    // Save a user to the test db and create new route
    user.save(function () {
      route = {
        title: 'Route Title',
        content: 'Route Content'
      };

      done();
    });
  });

  it('should not be able to save an route if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/routes')
          .send(route)
          .expect(403)
          .end(function (routeSaveErr, routeSaveRes) {
            // Call the assertion callback
            done(routeSaveErr);
          });

      });
  });

  it('should not be able to save an route if not logged in', function (done) {
    agent.post('/api/routes')
      .send(route)
      .expect(403)
      .end(function (routeSaveErr, routeSaveRes) {
        // Call the assertion callback
        done(routeSaveErr);
      });
  });

  it('should not be able to update an route if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/routes')
          .send(route)
          .expect(403)
          .end(function (routeSaveErr, routeSaveRes) {
            // Call the assertion callback
            done(routeSaveErr);
          });
      });
  });

  it('should be able to get a list of routes if not signed in', function (done) {
    // Create new route model instance
    var routeObj = new Route(route);

    // Save the route
    routeObj.save(function () {
      // Request routes
      request(app).get('/api/routes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single route if not signed in', function (done) {
    // Create new route model instance
    var routeObj = new Route(route);

    // Save the route
    routeObj.save(function () {
      request(app).get('/api/routes/' + routeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', route.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single route with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/routes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Route is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single route which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent route
    request(app).get('/api/routes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No route with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an route if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/routes')
          .send(route)
          .expect(403)
          .end(function (routeSaveErr, routeSaveRes) {
            // Call the assertion callback
            done(routeSaveErr);
          });
      });
  });

  it('should not be able to delete an route if not signed in', function (done) {
    // Set route user
    route.user = user;

    // Create new route model instance
    var routeObj = new Route(route);

    // Save the route
    routeObj.save(function () {
      // Try deleting route
      request(app).delete('/api/routes/' + routeObj._id)
        .expect(403)
        .end(function (routeDeleteErr, routeDeleteRes) {
          // Set message assertion
          (routeDeleteRes.body.message).should.match('User is not authorized');

          // Handle route error error
          done(routeDeleteErr);
        });

    });
  });

  it('should be able to get a single route that has an orphaned user reference', function (done) {
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

          // Save a new route
          agent.post('/api/routes')
            .send(route)
            .expect(200)
            .end(function (routeSaveErr, routeSaveRes) {
              // Handle route save error
              if (routeSaveErr) {
                return done(routeSaveErr);
              }

              // Set assertions on new route
              (routeSaveRes.body.title).should.equal(route.title);
              should.exist(routeSaveRes.body.user);
              should.equal(routeSaveRes.body.user._id, orphanId);

              // force the route to have an orphaned user reference
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

                    // Get the route
                    agent.get('/api/routes/' + routeSaveRes.body._id)
                      .expect(200)
                      .end(function (routeInfoErr, routeInfoRes) {
                        // Handle route error
                        if (routeInfoErr) {
                          return done(routeInfoErr);
                        }

                        // Set assertions
                        (routeInfoRes.body._id).should.equal(routeSaveRes.body._id);
                        (routeInfoRes.body.title).should.equal(route.title);
                        should.equal(routeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single route if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new route model instance
    var routeObj = new Route(route);

    // Save the route
    routeObj.save(function () {
      request(app).get('/api/routes/' + routeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', route.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single route, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'routeowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Route
    var _routeOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _routeOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Route
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

          // Save a new route
          agent.post('/api/routes')
            .send(route)
            .expect(200)
            .end(function (routeSaveErr, routeSaveRes) {
              // Handle route save error
              if (routeSaveErr) {
                return done(routeSaveErr);
              }

              // Set assertions on new route
              (routeSaveRes.body.title).should.equal(route.title);
              should.exist(routeSaveRes.body.user);
              should.equal(routeSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the route
                  agent.get('/api/routes/' + routeSaveRes.body._id)
                    .expect(200)
                    .end(function (routeInfoErr, routeInfoRes) {
                      // Handle route error
                      if (routeInfoErr) {
                        return done(routeInfoErr);
                      }

                      // Set assertions
                      (routeInfoRes.body._id).should.equal(routeSaveRes.body._id);
                      (routeInfoRes.body.title).should.equal(route.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (routeInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Route.remove().exec(done);
    });
  });
});

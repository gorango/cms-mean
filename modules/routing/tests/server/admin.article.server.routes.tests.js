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
describe('Route Admin CRUD tests', function () {
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

    // Save a user to the test db and create new route
    user.save(function () {
      route = {
        title: 'Route Title',
        content: 'Route Content'
      };

      done();
    });
  });

  it('should be able to save an route if logged in', function (done) {
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

        // Save a new route
        agent.post('/api/routes')
          .send(route)
          .expect(200)
          .end(function (routeSaveErr, routeSaveRes) {
            // Handle route save error
            if (routeSaveErr) {
              return done(routeSaveErr);
            }

            // Get a list of routes
            agent.get('/api/routes')
              .end(function (routesGetErr, routesGetRes) {
                // Handle route save error
                if (routesGetErr) {
                  return done(routesGetErr);
                }

                // Get routes list
                var routes = routesGetRes.body;

                // Set assertions
                (routes[0].user._id).should.equal(userId);
                (routes[0].title).should.match('Route Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an route if signed in', function (done) {
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

        // Save a new route
        agent.post('/api/routes')
          .send(route)
          .expect(200)
          .end(function (routeSaveErr, routeSaveRes) {
            // Handle route save error
            if (routeSaveErr) {
              return done(routeSaveErr);
            }

            // Update route title
            route.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing route
            agent.put('/api/routes/' + routeSaveRes.body._id)
              .send(route)
              .expect(200)
              .end(function (routeUpdateErr, routeUpdateRes) {
                // Handle route update error
                if (routeUpdateErr) {
                  return done(routeUpdateErr);
                }

                // Set assertions
                (routeUpdateRes.body._id).should.equal(routeSaveRes.body._id);
                (routeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an route if no title is provided', function (done) {
    // Invalidate title field
    route.title = '';

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

        // Save a new route
        agent.post('/api/routes')
          .send(route)
          .expect(422)
          .end(function (routeSaveErr, routeSaveRes) {
            // Set message assertion
            (routeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle route save error
            done(routeSaveErr);
          });
      });
  });

  it('should be able to delete an route if signed in', function (done) {
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

        // Save a new route
        agent.post('/api/routes')
          .send(route)
          .expect(200)
          .end(function (routeSaveErr, routeSaveRes) {
            // Handle route save error
            if (routeSaveErr) {
              return done(routeSaveErr);
            }

            // Delete an existing route
            agent.delete('/api/routes/' + routeSaveRes.body._id)
              .send(route)
              .expect(200)
              .end(function (routeDeleteErr, routeDeleteRes) {
                // Handle route error error
                if (routeDeleteErr) {
                  return done(routeDeleteErr);
                }

                // Set assertions
                (routeDeleteRes.body._id).should.equal(routeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single route if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new route model instance
    route.user = user;
    var routeObj = new Route(route);

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

        // Save a new route
        agent.post('/api/routes')
          .send(route)
          .expect(200)
          .end(function (routeSaveErr, routeSaveRes) {
            // Handle route save error
            if (routeSaveErr) {
              return done(routeSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (routeInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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

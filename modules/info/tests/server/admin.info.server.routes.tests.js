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
describe('Info Admin CRUD tests', function () {
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

    // Save a user to the test db and create new info
    user.save(function () {
      info = {
        title: 'Info Title',
        content: 'Info Content'
      };

      done();
    });
  });

  it('should be able to save an info if logged in', function (done) {
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

        // Save a new info
        agent.post('/api/info')
          .send(info)
          .expect(200)
          .end(function (infoSaveErr, infoSaveRes) {
            // Handle info save error
            if (infoSaveErr) {
              return done(infoSaveErr);
            }

            // Get a list of info
            agent.get('/api/info')
              .end(function (infoGetErr, infoGetRes) {
                // Handle info save error
                if (infoGetErr) {
                  return done(infoGetErr);
                }

                // Get info list
                var info = infoGetRes.body;

                // Set assertions
                (info[0].user._id).should.equal(userId);
                (info[0].title).should.match('Info Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an info if signed in', function (done) {
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

        // Save a new info
        agent.post('/api/info')
          .send(info)
          .expect(200)
          .end(function (infoSaveErr, infoSaveRes) {
            // Handle info save error
            if (infoSaveErr) {
              return done(infoSaveErr);
            }

            // Update info title
            info.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing info
            agent.put('/api/info/' + infoSaveRes.body._id)
              .send(info)
              .expect(200)
              .end(function (infoUpdateErr, infoUpdateRes) {
                // Handle info update error
                if (infoUpdateErr) {
                  return done(infoUpdateErr);
                }

                // Set assertions
                (infoUpdateRes.body._id).should.equal(infoSaveRes.body._id);
                (infoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an info if no title is provided', function (done) {
    // Invalidate title field
    info.title = '';

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

        // Save a new info
        agent.post('/api/info')
          .send(info)
          .expect(422)
          .end(function (infoSaveErr, infoSaveRes) {
            // Set message assertion
            (infoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle info save error
            done(infoSaveErr);
          });
      });
  });

  it('should be able to delete an info if signed in', function (done) {
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

        // Save a new info
        agent.post('/api/info')
          .send(info)
          .expect(200)
          .end(function (infoSaveErr, infoSaveRes) {
            // Handle info save error
            if (infoSaveErr) {
              return done(infoSaveErr);
            }

            // Delete an existing info
            agent.delete('/api/info/' + infoSaveRes.body._id)
              .send(info)
              .expect(200)
              .end(function (infoDeleteErr, infoDeleteRes) {
                // Handle info error error
                if (infoDeleteErr) {
                  return done(infoDeleteErr);
                }

                // Set assertions
                (infoDeleteRes.body._id).should.equal(infoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single info if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new info model instance
    info.user = user;
    var infoObj = new Info(info);

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

        // Save a new info
        agent.post('/api/info')
          .send(info)
          .expect(200)
          .end(function (infoSaveErr, infoSaveRes) {
            // Handle info save error
            if (infoSaveErr) {
              return done(infoSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (infoInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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

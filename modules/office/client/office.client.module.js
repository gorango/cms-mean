(function (app) {
  'use strict';

  app.registerModule('office', ['core', 'weather']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('office.services');
  app.registerModule('office.routes', ['ui.router', 'core.routes', 'office.services']);
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('updates', ['core', 'weather']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('updates.admin', ['core.admin']);
  app.registerModule('updates.admin.routes', ['core.admin.routes']);
  app.registerModule('updates.services');
  app.registerModule('updates.routes', ['ui.router', 'core.routes', 'updates.services']);
}(ApplicationConfiguration));

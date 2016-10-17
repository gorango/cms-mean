(function (app) {
  'use strict';

  app.registerModule('legal', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('legal.admin', ['core.admin']);
  app.registerModule('legal.admin.routes', ['core.admin.routes']);
  app.registerModule('legal.services');
  app.registerModule('legal.routes', ['ui.router', 'core.routes', 'legal.services']);
}(ApplicationConfiguration));

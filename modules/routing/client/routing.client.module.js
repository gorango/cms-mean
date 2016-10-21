(function (app) {
  'use strict';

  app.registerModule('routing', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('routing.admin', ['core.admin']);
  app.registerModule('routing.admin.routes', ['core.admin.routes']);
  app.registerModule('routing.services');
  app.registerModule('routing.routes', ['ui.router', 'core.routes', 'routing.services']);
}(ApplicationConfiguration));

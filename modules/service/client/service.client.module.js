(function (app) {
  'use strict';

  app.registerModule('service', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('service.admin', ['core.admin']);
  app.registerModule('service.admin.routes', ['core.admin.routes']);
  app.registerModule('service.services');
  app.registerModule('service.routes', ['ui.router', 'core.routes', 'service.services']);
}(ApplicationConfiguration));

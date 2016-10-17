(function (app) {
  'use strict';

  app.registerModule('info', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('info.admin', ['core.admin']);
  app.registerModule('info.admin.routes', ['core.admin.routes']);
  app.registerModule('info.services');
  app.registerModule('info.routes', ['ui.router', 'core.routes', 'info.services']);
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('quotes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('quotes.admin', ['core.admin']);
  app.registerModule('quotes.admin.routes', ['core.admin.routes']);
  app.registerModule('quotes.services');
  app.registerModule('quotes.routes', ['ui.router', 'core.routes', 'quotes.services']);
}(ApplicationConfiguration));

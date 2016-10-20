(function (app) {
  'use strict';

  app.registerModule('checkout', ['core']);
  app.registerModule('checkout.admin', ['core.admin']);
  app.registerModule('checkout.admin.routes', ['core.admin.routes']);
  app.registerModule('checkout.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));

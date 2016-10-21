﻿(function () {
  'use strict';

  describe('Routes Route Tests', function () {
    // Initialize global variables
    var $scope,
      RoutesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RoutesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RoutesService = _RoutesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.routes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/routes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.routes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/routes/client/views/admin/list-routes.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RoutesAdminController,
          mockRoute;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.routes.create');
          $templateCache.put('/modules/routes/client/views/admin/form-route.client.view.html', '');

          // Create mock route
          mockRoute = new RoutesService();

          // Initialize Controller
          RoutesAdminController = $controller('RoutesAdminController as vm', {
            $scope: $scope,
            routeResolve: mockRoute
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.routeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/routes/create');
        }));

        it('should attach an route to the controller scope', function () {
          expect($scope.vm.route._id).toBe(mockRoute._id);
          expect($scope.vm.route._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/routes/client/views/admin/form-route.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RoutesAdminController,
          mockRoute;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.routes.edit');
          $templateCache.put('/modules/routes/client/views/admin/form-route.client.view.html', '');

          // Create mock route
          mockRoute = new RoutesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Route about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          RoutesAdminController = $controller('RoutesAdminController as vm', {
            $scope: $scope,
            routeResolve: mockRoute
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:routeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.routeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            routeId: 1
          })).toEqual('/admin/routes/1/edit');
        }));

        it('should attach an route to the controller scope', function () {
          expect($scope.vm.route._id).toBe(mockRoute._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/routes/client/views/admin/form-route.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

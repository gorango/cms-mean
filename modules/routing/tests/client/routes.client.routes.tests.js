(function () {
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
          mainstate = $state.get('routes');
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
          liststate = $state.get('routes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/routes/client/views/list-routes.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          RoutesController,
          mockRoute;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('routes.view');
          $templateCache.put('/modules/routes/client/views/view-route.client.view.html', '');

          // create mock route
          mockRoute = new RoutesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Route about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          RoutesController = $controller('RoutesController as vm', {
            $scope: $scope,
            routeResolve: mockRoute
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:routeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.routeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            routeId: 1
          })).toEqual('/routes/1');
        }));

        it('should attach an route to the controller scope', function () {
          expect($scope.vm.route._id).toBe(mockRoute._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/routes/client/views/view-route.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/routes/client/views/list-routes.client.view.html', '');

          $state.go('routes.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('routes/');
          $rootScope.$digest();

          expect($location.path()).toBe('/routes');
          expect($state.current.templateUrl).toBe('/modules/routes/client/views/list-routes.client.view.html');
        }));
      });
    });
  });
}());

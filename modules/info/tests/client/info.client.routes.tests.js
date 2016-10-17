(function () {
  'use strict';

  describe('Info Route Tests', function () {
    // Initialize global variables
    var $scope,
      InfoService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InfoService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InfoService = _InfoService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('info');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/info');
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
          liststate = $state.get('info.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/info/client/views/list-info.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InfoController,
          mockInfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('info.view');
          $templateCache.put('/modules/info/client/views/view-info.client.view.html', '');

          // create mock info
          mockInfo = new InfoService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Info about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          InfoController = $controller('InfoController as vm', {
            $scope: $scope,
            infoResolve: mockInfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:infoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.infoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            infoId: 1
          })).toEqual('/info/1');
        }));

        it('should attach an info to the controller scope', function () {
          expect($scope.vm.info._id).toBe(mockInfo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/info/client/views/view-info.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/info/client/views/list-info.client.view.html', '');

          $state.go('info.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('info/');
          $rootScope.$digest();

          expect($location.path()).toBe('/info');
          expect($state.current.templateUrl).toBe('/modules/info/client/views/list-info.client.view.html');
        }));
      });
    });
  });
}());

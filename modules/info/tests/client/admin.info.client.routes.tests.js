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
          mainstate = $state.get('admin.info');
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
          liststate = $state.get('admin.info.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/info/client/views/admin/list-info.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InfoAdminController,
          mockInfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.info.create');
          $templateCache.put('/modules/info/client/views/admin/form-info.client.view.html', '');

          // Create mock info
          mockInfo = new InfoService();

          // Initialize Controller
          InfoAdminController = $controller('InfoAdminController as vm', {
            $scope: $scope,
            infoResolve: mockInfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.infoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/info/create');
        }));

        it('should attach an info to the controller scope', function () {
          expect($scope.vm.info._id).toBe(mockInfo._id);
          expect($scope.vm.info._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/info/client/views/admin/form-info.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InfoAdminController,
          mockInfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.info.edit');
          $templateCache.put('/modules/info/client/views/admin/form-info.client.view.html', '');

          // Create mock info
          mockInfo = new InfoService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Info about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          InfoAdminController = $controller('InfoAdminController as vm', {
            $scope: $scope,
            infoResolve: mockInfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:infoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.infoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            infoId: 1
          })).toEqual('/admin/info/1/edit');
        }));

        it('should attach an info to the controller scope', function () {
          expect($scope.vm.info._id).toBe(mockInfo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/info/client/views/admin/form-info.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

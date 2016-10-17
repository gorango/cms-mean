(function () {
  'use strict';

  describe('Admin Info List Controller Tests', function () {
    // Initialize global variables
    var InfoAdminListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      InfoService,
      mockInfo;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _InfoService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      InfoService = _InfoService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/info/client/views/list-info.client.view.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock info
      mockInfo = new InfoService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Info about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the Info List controller.
      InfoAdminListController = $controller('InfoAdminListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockInfoList;

      beforeEach(function () {
        mockInfoList = [mockInfo, mockInfo];
      });

      it('should send a GET request and return all info', inject(function (InfoService) {
        // Set POST response
        $httpBackend.expectGET('/api/info').respond(mockInfoList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.info.length).toEqual(2);
        expect($scope.vm.info[0]).toEqual(mockInfo);
        expect($scope.vm.info[1]).toEqual(mockInfo);

      }));
    });
  });
}());

(function () {
  'use strict';

  describe('Quotes Route Tests', function () {
    // Initialize global variables
    var $scope,
      QuotesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QuotesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QuotesService = _QuotesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('quotes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/quotes');
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
          liststate = $state.get('quotes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/quotes/client/views/list-quotes.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          QuotesController,
          mockQuote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('quotes.view');
          $templateCache.put('/modules/quotes/client/views/view-quote.client.view.html', '');

          // create mock quote
          mockQuote = new QuotesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Quote about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          QuotesController = $controller('QuotesController as vm', {
            $scope: $scope,
            quoteResolve: mockQuote
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:quoteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.quoteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            quoteId: 1
          })).toEqual('/quotes/1');
        }));

        it('should attach an quote to the controller scope', function () {
          expect($scope.vm.quote._id).toBe(mockQuote._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/quotes/client/views/view-quote.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/quotes/client/views/list-quotes.client.view.html', '');

          $state.go('quotes.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('quotes/');
          $rootScope.$digest();

          expect($location.path()).toBe('/quotes');
          expect($state.current.templateUrl).toBe('/modules/quotes/client/views/list-quotes.client.view.html');
        }));
      });
    });
  });
}());

(function () {
  'use strict';

  angular
    .module('quotes.services')
    .factory('QuotesService', QuotesService);

  QuotesService.$inject = ['$resource', '$log'];

  function QuotesService($resource, $log) {
    var Quote = $resource('/api/quotes/:quoteId', {
      quoteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Quote.prototype, {
      createOrUpdate: function () {
        var quote = this;
        return createOrUpdate(quote);
      }
    });

    return Quote;

    function createOrUpdate(quote) {
      if (quote._id) {
        return quote.$update(onSuccess, onError);
      } else {
        return quote.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(quote) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());

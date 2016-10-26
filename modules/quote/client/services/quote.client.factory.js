(function() {
  'use strict';

  angular
    .module('quotes')
    .factory('QuoteFactory', QuoteFactory);

  QuoteFactory.$inject = (['$q', 'localStorageService', 'ACTIONS', 'PRICING', 'QUOTE_INITIAL_STATE']);

  function QuoteFactory($q, localStorage, ACTIONS, PRICING, QUOTE_INITIAL_STATE) {
    return {
      calc: function(quote) {
        var defer = $q.defer();
        quote.selection = _makeSelectionArray(quote);
        quote.total = 0;
        quote.selection.forEach(function(action, i) {
          quote.total = _setTotal(quote, action);
          if (i === quote.selection.length - 1) {
            localStorage.set('quote', quote);
            quote.image = _imageFromQuote(quote);
            defer.resolve(quote);
          }
        });
        return defer.promise;
      },
      getDate: function(type) {
        var serviceYear = new Date().getFullYear() - (new Date().getMonth() < 4 ? 1 : 0);
        var serviceStart = new Date(serviceYear, 10, 15);
        var serviceEnd = new Date(serviceYear + 1, 3, 15);
        switch (type) {
          case 'SERVICE_YEAR':
            return serviceYear;
          case 'SERVICE_START_DATE':
            return serviceStart;
          case 'SERVICE_END_DATE':
            return serviceEnd;
          case 'SINGLE_DATE':
            return new Date() < serviceStart ? serviceStart : new Date();
          case 'HOLIDAY_START_DATE':
            return new Date() < serviceStart ? serviceStart : new Date();
          case 'HOLIDAY_END_DATE':
            return new Date() < serviceStart ?
                new Date(serviceStart.valueOf() + (1000 * 60 * 60 * 24 * 7)) :
                new Date(new Date().valueOf() + (1000 * 60 * 60 * 24 * 7));
        }
      }
    };

    function _imageFromQuote(quote) {
      var fileName = '';
      switch (quote.driveway) {
        case ACTIONS.DRIVEWAY_LARGE:
          fileName += 'L';
          break;
        default:
          fileName += 'R';
      }
      switch (quote.drivesalt) {
        case ACTIONS.DRIVEWAY_SALT_REGULAR:
        case ACTIONS.DRIVEWAY_SALT_ECO:
          fileName += '-';
          break;
      }
      switch (quote.walkway) {
        case ACTIONS.WALKWAY_YES:
          fileName += 'W';
          break;
      }
      switch (quote.walksalt) {
        case ACTIONS.WALKWAY_SALT_REGULAR:
        case ACTIONS.WALKWAY_SALT_ECO:
          fileName += '-';
          break;
      }
      switch (quote.sidewalk) {
        case ACTIONS.SIDEWALK_YES:
          fileName += 'S';
          break;
      }
      switch (quote.corner) {
        case ACTIONS.SIDEWALK_SIZE_CORNER:
          fileName += 'c';
          break;
      }
      switch (quote.sidesalt) {
        case ACTIONS.SIDEWALK_SALT_REGULAR:
        case ACTIONS.SIDEWALK_SALT_ECO:
          fileName += '-';
          break;
      }
      if (fileName.length === 1) {
        fileName += '.gif';
      } else {
        fileName += '.jpg';
      }
      return fileName;
    }

    function _makeSelectionArray(quote) {
      var selection = [];
      Object.keys(quote).forEach(function(key) {
        if (ACTIONS.hasOwnProperty(quote[key])) {
          // Because 'SEASON_XXX' action and 'CLIENT_XXX' action act as modifiers
          // on the quote, they need to be applied at the very end.
          // (The order of all other fields is irrelevant because they apply addition)
          if (quote[key].indexOf('SEASON') > -1 || quote[key].indexOf('CLIENT') > -1) {
            selection.push(quote[key]);
          } else {
            selection.splice(0, 0, quote[key]);
          }
        }
      });
      return _.flatten(selection);
    }

    function _getRange(quote) {
      if (quote.holidayStartDate && quote.holidayEndDate && typeof(quote.holidayStartDate) === 'object' && typeof(quote.holidayEndDate) === 'object') {
        var start = quote.holidayStartDate.valueOf();
        var end = quote.holidayEndDate.valueOf();
        var range = (end - start) / 1000 / 60 / 60 / 24;
        return range;
      }
    }

    // The main calc function
    function _setTotal(quote, action) {
      switch (action) {
        // Salt pricing varies based on driveway size
        case ACTIONS.DRIVEWAY_SALT_REGULAR:
          var REG_TYPE;
          if (quote.selection.indexOf(ACTIONS.DRIVEWAY_REGULAR) > -1) {
            REG_TYPE = 'DRIVEWAY_REGULAR_SALT_REGULAR';
          } else if (quote.selection.indexOf(ACTIONS.DRIVEWAY_LARGE) > -1) {
            REG_TYPE = 'DRIVEWAY_LARGE_SALT_REGULAR';
          } else if (quote.selection.indexOf(ACTIONS.DRIVEWAY_PARKING) > -1) {
            REG_TYPE = 'DRIVEWAY_PARKING_SALT_REGULAR';
          } else {
            return '';
          }
          return quote.total + PRICING[REG_TYPE];
        // Salt pricing varies based on driveway size
        case ACTIONS.DRIVEWAY_SALT_ECO:
          var ECO_TYPE;
          if (quote.selection.indexOf(ACTIONS.DRIVEWAY_REGULAR) > -1) {
            ECO_TYPE = 'DRIVEWAY_REGULAR_SALT_ECO';
          } else if (quote.selection.indexOf(ACTIONS.DRIVEWAY_LARGE) > -1) {
            ECO_TYPE = 'DRIVEWAY_LARGE_SALT_ECO';
          } else if (quote.selection.indexOf(ACTIONS.DRIVEWAY_PARKING) > -1) {
            ECO_TYPE = 'DRIVEWAY_PARKING_SALT_ECO';
          } else {
            return '';
          }
          return quote.total + PRICING[ECO_TYPE];
        // If selection carries no value, change nothing
        case ACTIONS.DRIVEWAY_SALT_NO:
        case ACTIONS.WALKWAY_NO:
        case ACTIONS.WALKWAY_SALT_NO:
        case ACTIONS.SIDEWALK_NO:
        case ACTIONS.SIDEWALK_SALT_NO:
        case ACTIONS.SIDEWALK_SIZE_REGULAR:
        case ACTIONS.CLIENT_REGULAR:
        case ACTIONS.SEASON_FULL:
        case ACTIONS.SEASON_HALF_FIRST:
        case ACTIONS.SEASON_HALF_SECOND:
          return quote.total;
        // In case of senior client and half season, multiply current total by modifier
        case ACTIONS.CLIENT_SENIOR:
        case ACTIONS.SEASON_HALF:
          return quote.total * PRICING[action];
        // SEASON_HOLIDAY and SEASON_SINGLE modify the price based on duration
        // General formula:
        //   <price> / <number of full service days> * <duration> + <admin costs>
        case ACTIONS.SEASON_HOLIDAY:
          var range = _getRange(quote);
          if (range) {
            return ((quote.total / 155) * range) + 100;
          }
          return quote.total;
        case ACTIONS.SEASON_SINGLE:
          return (quote.total / 155) + 100;
        // General case: Add the value from new selection to current total
        default:
          return quote.total + PRICING[action];
      }
    }
  }
}());

(function() {
  'use strict';

  angular
    .module('quotes')
    .filter('englishize', EnglishizeQuoteFilter);

  EnglishizeQuoteFilter.$inject = ['ACTIONS'];

  function EnglishizeQuoteFilter(ACTIONS) {
    return function(input) {
      switch (input) {
        case ACTIONS.DRIVEWAY_REGULAR:
          return 'Regular Driveway';
        case ACTIONS.DRIVEWAY_LARGE:
          return 'Large Driveway';
        case ACTIONS.DRIVEWAY_PARKING:
          return 'Parking Lot';
        case ACTIONS.DRIVEWAY_SALT_REGULAR:
          return 'Regular Salt for Driveway';
        case ACTIONS.DRIVEWAY_SALT_ECO:
          return 'Eco Salt for Driveway';
        case ACTIONS.DRIVEWAY_SALT_NO:
          return 'No Salt for Driveway';
        case ACTIONS.WALKWAY_YES:
          return 'Walkway Shovelling';
        case ACTIONS.WALKWAY_NO:
          return 'No Walkway Shovelling';
        case ACTIONS.WALKWAY_SALT_REGULAR:
          return 'Regular Salt for Walkway';
        case ACTIONS.WALKWAY_SALT_ECO:
          return 'Eco Salt for Walkway';
        case ACTIONS.WALKWAY_SALT_NO:
          return 'No Salt for Walkway';
        case ACTIONS.SIDEWALK_YES:
          return 'Sidewalk Shovelling';
        case ACTIONS.SIDEWALK_NO:
          return 'No Sidewalk Shovelling';
        case ACTIONS.SIDEWALK_SIZE_CORNER:
          return 'Sidewalk Corner Lot';
        case ACTIONS.SIDEWALK_SIZE_REGULAR:
          return 'Sidewalk Regular Lot';
        case ACTIONS.SIDEWALK_SALT_REGULAR:
          return 'Regular Salt for Sidewalk';
        case ACTIONS.SIDEWALK_SALT_ECO:
          return 'Eco Salt for Sidewalk';
        case ACTIONS.SIDEWALK_SALT_NO:
          return 'No Salt for Sidewalk';
        case ACTIONS.CLIENT_SENIOR:
          return 'Senior Client (5% Discount)';
        case ACTIONS.CLIENT_REGULAR:
          return 'Regular Client';
        case ACTIONS.SEASON_FULL:
          return 'Full Season';
        case ACTIONS.SEASON_HALF:
          return 'Half Season';
        case ACTIONS.SEASON_HALF_FIRST:
          return 'November 15 - February 1';
        case ACTIONS.SEASON_HALF_SECOND:
          return 'February 1 - March 31';
        case ACTIONS.SEASON_SINGLE:
          return 'Single Service';
        case ACTIONS.SEASON_HOLIDAY:
          return 'Holiday Season';
      }
    };
  }
}());

(function() {
  'use strict';

  angular
    .module('core')
    .factory('EmailService', EmailService);

  EmailService.$inject = (['$http']);

  function EmailService($http) {
    return {
      send: function(type, quote) {
        var payload = {
          emailType: type,
          quote: quote,
          recipient: quote.clientEmail
        };
        var selection = quote.selection.slice(0);
        switch (type) {
          case 'CONTACT':
            payload.title = 'Website Contact Form';
            payload.template = 'contact-email';
            payload.recipient = 'sales@clearmysnow.com';
            break;
          case 'QUOTE':
            payload.title = 'Snow Clearing Quote';
            payload.template = 'quote-email';
            payload.bcc = 'sales@clearmysnow.com';
            break;
          case 'QUOTE_OFFICE':
            payload.title = 'Snow Clearing Quote';
            payload.template = 'quote-email';
            payload.quote.selection = filterSort(selection).map(englishize);
            // Sending an email to the client before changing the template and recipient
            $http.post('/api/email', { payload: _.cloneDeep(payload) });

            payload.template = 'quote-office-email';
            payload.recipient = 'sales@clearmysnow.com';
            payload.quote.selection = selection.map(englishize);
            break;
          case 'PURCHASE':
            payload.title = 'Purchase Confirmation';
            payload.template = 'purchase-confirm-email';
            payload.bcc = 'sales@clearmysnow.com';
            break;
        }
        $http.post('/api/email', { payload: payload })
          .then(_handleEmailResponse, _handleEmailError);
      },
      update: function(recipient, update) {
        var payload = {
          update: update,
          bcc: '',
          template: 'service-update-email',
          recipient: recipient,
          title: 'ClearMySnow Service Update'
        };

        $http.post('/api/email', { payload: payload })
          .then(_handleEmailResponse, _handleEmailError);
      }
    };

    function _handleEmailResponse(res) { console.log(); }

    function _handleEmailError(err) { console.log(err); }
  }

  // HACK: this constant is a clone from "actions.client.constants.js" because I forgot how to angular...
  var ACTIONS = {
    DRIVEWAY_REGULAR: 'DRIVEWAY_REGULAR',
    DRIVEWAY_LARGE: 'DRIVEWAY_LARGE',
    DRIVEWAY_PARKING: 'DRIVEWAY_PARKING',
    DRIVEWAY_SALT_REGULAR: 'DRIVEWAY_SALT_REGULAR',
    DRIVEWAY_SALT_ECO: 'DRIVEWAY_SALT_ECO',
    DRIVEWAY_SALT_NO: 'DRIVEWAY_SALT_NO',
    WALKWAY_YES: 'WALKWAY_YES',
    WALKWAY_NO: 'WALKWAY_NO',
    WALKWAY_SALT_REGULAR: 'WALKWAY_SALT_REGULAR',
    WALKWAY_SALT_ECO: 'WALKWAY_SALT_ECO',
    WALKWAY_SALT_NO: 'WALKWAY_SALT_NO',
    SIDEWALK_YES: 'SIDEWALK_YES',
    SIDEWALK_NO: 'SIDEWALK_NO',
    SIDEWALK_SIZE_CORNER: 'SIDEWALK_SIZE_CORNER',
    SIDEWALK_SIZE_REGULAR: 'SIDEWALK_SIZE_REGULAR',
    SIDEWALK_SALT_REGULAR: 'SIDEWALK_SALT_REGULAR',
    SIDEWALK_SALT_ECO: 'SIDEWALK_SALT_ECO',
    SIDEWALK_SALT_NO: 'SIDEWALK_SALT_NO',
    CLIENT_SENIOR: 'CLIENT_SENIOR',
    CLIENT_REGULAR: 'CLIENT_REGULAR',
    SEASON_FULL: 'SEASON_FULL',
    SEASON_HALF: 'SEASON_HALF',
    SEASON_HALF_FIRST: 'SEASON_HALF_FIRST',
    SEASON_HALF_SECOND: 'SEASON_HALF_SECOND',
    SEASON_SINGLE: 'SEASON_SINGLE',
    SEASON_SINGLE_DATE: 'SEASON_SINGLE_DATE',
    SEASON_HOLIDAY: 'SEASON_HOLIDAY',
    SEASON_HOLIDAY_RANGE: 'SEASON_HOLIDAY_RANGE',
    QUOTE_STEP_BACK: 'QUOTE_STEP_BACK',
    QUOTE_RESET: 'QUOTE_RESET'
  };

  function filterSort (input) {
    var properOrder = Object.keys(ACTIONS).slice(0, 18);
    var res = _.intersection(properOrder, input);
    return res;
  }

  function englishize (input) {
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
  }
}());

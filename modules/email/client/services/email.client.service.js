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
        switch (type) {
          case 'CONTACT':
            payload.recipient = 'sales@clearmysnow.com';
            payload.template = 'contact-email';
            payload.title = 'Website Contact Form';
            break;
          case 'QUOTE':
            payload.template = 'quote-email';
            payload.title = 'Snow Clearing Quote';
            break;
          case 'QUOTE_OFFICE':
            payload.template = 'quote-office-email';
            payload.recipient = 'sales@clearmysnow.com';
            payload.title = 'Snow Clearing Quote';
            break;
          case 'PURCHASE':
            payload.template = 'purchase-confirm-email';
            payload.title = 'Purchase Confirmation';
            break;
        }
        $http.post('/api/email', { payload: payload })
          .then(_handleEmailResponse, _handleEmailError);
      }
    };

    function _handleEmailResponse(res) { }

    function _handleEmailError(err) { }
  }
}());

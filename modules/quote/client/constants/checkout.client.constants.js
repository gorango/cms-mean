(function() {
  'use strict';

  angular
    .module('quotes')
    .constant('PAYPAL_CHECKOUT_DEFAULTS', {
      /*
      * Additionally supply the following:
      *
      * transactions[0].amount.total // must be formatted to contain 2 decimals
      * transactions[0].description
      *
      **/
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'https://staging.clearmysnow.com/checkout/confirm',
        cancel_url: 'https://staging.clearmysnow.com/service/register'
      },
      transactions: [{
        amount: {
          currency: 'CAD'
        }
      }]
    })
    .constant('CREDIT_CHECKOUT_DEFAULTS', {
      /*
      * Additionally supply the following:
      *
      * payer.funding_instruments[0].credit_card.type // visa|mastercard
      * payer.funding_instruments[0].credit_card.number
      * payer.funding_instruments[0].credit_card.expire_month
      * payer.funding_instruments[0].credit_card.expire_year
      * payer.funding_instruments[0].credit_card.cvv2
      * payer.funding_instruments[0].credit_card.first_name
      * payer.funding_instruments[0].credit_card.last_name
      * payer.funding_instruments[0].credit_card.billingAddress: {
      *   line1,
      *   line2,
      *   city,
      *   postal_code,
      * }
      * transactions[0].amount.total // must be formatted to contain 2 decimals
      * transactions[0].amount.details.subtotal
      * transactions[0].description
      *
      **/
      intent: 'sale',
      payer: {
        payment_method: 'credit_card',
        funding_instruments: [{
          credit_card: {
            billing_address: {
              state: 'ON',
              country_code: 'CA'
            }
          }
        }]
      },
      transactions: [{
        amount: {
          currency: 'CAD',
          details: {
            tax: '13'
          }
        }
      }]
    });
}());

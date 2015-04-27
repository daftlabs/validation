define([
  'jquery',
  'https://js.stripe.com/v2/?requirejsisdumb=true'
], function($, stripe) {

  return {
    'credit_card': function(value, input) {
      return Stripe.card.validateCardNumber(value) || !value;
    },
    'credit_card_verification': function(value, input) {
      return Stripe.card.validateCVC(value) || !value;
    },
    'credit_card_expiration': function(value, input, options) {
      var month = $('[name="' + options[0] + '"]').val()
       ,  year  = $('[name="' + options[1] + '"]').val()
   
      return !month || !year || Stripe.card.validateExpiry(month, year);
    }
  };
});

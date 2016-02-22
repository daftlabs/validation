define([
  'jquery'
], function($) {

  function required_radio(radio) {
    var anySelected = false;
    $("input[name='" + radio.attr("name") + "']").each(function (i, input) {
      if ($(input).prop("checked")) {
        anySelected = true;
        return false;
      }
    });
    return anySelected;
  }

  return {
    required: function (value, input, ruleArgs) {
      if ($(input).attr("type") === "radio") {
        return Boolean(required_radio(input));
      }
      return Boolean(value);
    },
    email: function(value) {
      var result = new $.Deferred();

      if(!value.length || value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i)) {
        result.resolve();
      }
      else {
        result.rejectWith($, ['Not a valid email.']);
      }

      return result.promise();

    },
    url: function(value) {
      return !value.length || value.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
    },
    phone: function(value) {
      var clean = value.replace(/[\(\)\- ]/g, '');

      if (!clean.match(/^[0-9]*$/)) {
        return false;
      }

      return clean.length == 10 || clean.length == 11 || clean.length == 0;
    }
  };
});

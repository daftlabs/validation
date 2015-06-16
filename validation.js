define([
  'jquery',
], function($) {

  var validateForm = function(form) {
    var queries = []
      , passed = true;

    form.find('input,textarea,select').each(function() {
      var input = $(this)
        , promise = input.validateWithErroHandling()
        ;

      queries.push(promise);
    });

    return $.when.apply($, queries).fail(function() {
      $('body').animate({
        scrollTop: $('.error').first().position().top - 100
      }, 250);
    });
  };

  var validateInput = function(input) {
    var validationString = input.attr('validation')
      , value            = input.val()
      , whitelist        = input.attr('validation-enforce-ok')
      , results          = [];
      ;

    if (validationString && (!whitelist || whitelist != value)) {
      var ruleNames = validationString.split(','); 

      $.each(ruleNames, function(i, ruleDefinition) {
        var moduleParts = ruleDefinition.split('#')
          , moduleName  = moduleParts[moduleParts.length-2] || 'default'
          , rule        = moduleParts[moduleParts.length-1]
          , ruleName    = rule.split(':').slice(0, 1)
          , ruleArgs    = rule.split(':').slice(1)
          , deferred    = new $.Deferred()
          ;

        require(['validation/rules/' + moduleName], function(module) {
          var result = module[ruleName](value, input, ruleArgs)

          if (result && result.promise) {
            result
              .done(function () {deferred.resolve()})
              .fail(function () {
                deferred.rejectWith($, arguments)
              })
          }
          else if (result) {
            deferred.resolve();
          }
          else {
            deferred.reject();
          }
        });

        results.push(deferred.promise()); 

      });
    }

    return $.when.apply($, results).promise();
  };

  $(document).ready(function() {

    $.fn.validate = function() {

      if ($(this)[0].tagName == 'FORM') {
        return validateForm($(this));
      }
      else {
        return validateInput($(this));
      }
    };

    $.fn.validateWithErroHandling = function() {

      var input = this;

      return input.validate()
        .done(function() {
          input.clearError();
        })
        .fail(function() {
          input.setError(arguments);
        });
    };

    $.fn.getErrorParent = function() {
      return $(this).parents(
        $(this).attr('validation-container') || '.checkbox,.radio,.form-group,.input-group,td'
      ).first()
    };

    $.fn.setError = function(errors) {
      var input     = $(this)
        , container = input.getErrorParent()
        , errors    = errors || []
        ;

      container.addClass('error');

      container
        .find('input,select,textarea')
        .css({'box-shadow': '0 0 8px rgb(255, 0, 0)'});      

      container.find('[validation-error]').remove();

      $.each(errors, function(i, error) {
        $('<div class="alert alert-danger" validation-error role="alert">')
              .text(error)
          .appendTo(container);
      });
    };

    $.fn.clearError = function() {
      var input = $(this)
        , container = input.getErrorParent()
        ;

      container.removeClass('error');

      container
        .find('input,select,textarea')
        .removeAttr('style');

      container.find('[validation-error]').remove();
    };

    $(document).on('submit', 'form:not([no-validate])', function(e) {
      var form = $(this);

      if (form.data('submitted')) {
        e.preventDefault();
        return false;
      }

      if (!form.data('valid')) {
        e.preventDefault();

        form.validate().done(function() {
          form.data('valid', true);
          form.submit();
        });
      }
      else {
        form.data('submitted', true);
      }
    });

    $(document).on('click', 'form [validation-trigger]', function(e) {
      e.preventDefault();
      $(this).parents('form').first().validate();
    });

    $(document).on('change', 'input,textarea,select', function() {
      $(this).validateWithErroHandling();
    });
  });
});

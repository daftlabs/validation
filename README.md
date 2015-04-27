# validation

# DISCLAIMER

this is probably an embarrassment to everything that is javascript, but it does work.
so if anyone feels bored please feel free to improve the structure of this and hopefully 
remove some the the assumptions i'm about to talk about.

# assumptions
- you're using requirejs
- you have a jquery shim configured in requirejs
- you're using bootstrap
- you're using bootstrap correctly

# usage
- in require just depend on dat ol validation.js file.
- add a `validation` attribute to relevant form inputs (ie: validation="required")
- general available rules are `required`, `email`, `url`, `phone`
- rules can be put into modules, check out `rules/stripe.js`

stripe credit card experation code validation:
```
<select
  validation='required,stripe#credit_card_expiration:card[exp_month]:card[exp_year]'
  name='card[exp_month]'
  >
<select
  validation='required,stripe#credit_card_expiration:card[exp_month]:card[exp_year]'
  name='card[exp_year]'
  >
```

the bit before teh `#` is the module name, you can define your own modules, we'll get into that.
the bit after the # is the rule name and any arguments. arguments are separated with a `:`. arguments
are forwarded directly to the rule, in this case the stripe `credit_card_expiration` rule just expects 
the names of the month and year inputs because both are required for the operation.

if the validation.js is loaded inputs will be validated whenever they change and on form submit.
the js will block the form from actually submitting until there are no errors

# custom rule modules

add a thing like this to your requirejs path section

```javascript
require.config({
  "paths": {
    "validation/rules/mycoolmodules": "path/to/my/cool/module"
  }
});
```

you can reference the default modules as a reference, the rule functions can return promises or not.
if they return a promise you can use `rejectWith` to set error messages. if anything that isn't a promise
is returned it'll just be used in a normal truthy check.

(function () {
  'use strict';

  // https://gist.github.com/rhutchison/c8c14946e88a1c8f9216

  angular
    .module('core')
    .directive('showErrors', showErrors);

  showErrors.$inject = ['$timeout', '$interpolate'];

  function showErrors($timeout, $interpolate) {
    var directive = {
      restrict: 'A',
      require: '^form',
      compile: compile
    };

    return directive;

    function compile(elem, attrs) {
      return function(scope, el, attrs, formCtrl) {
        var inputEl,
          inputName,
          inputNgEl,
          options,
          showSuccess,
          initCheck = false,
          showValidationMessages = false;

        options = scope.$eval(attrs.showErrors) || {};
        showSuccess = options.showSuccess || false;
        inputEl = el[0].querySelector('md-input-container[name]') || el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

        if (!inputName) {
          throw new Error('show-errors element has no child input elements with a \'name\' attribute class');
        }

        scope.$watch(function () {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, toggleClasses);

        scope.$on('show-errors-check-validity', checkValidity);
        scope.$on('show-errors-reset', reset);

        function checkValidity(event, name) {
          if (angular.isUndefined(name) || formCtrl.$name === name) {
            initCheck = true;
            showValidationMessages = true;

            return toggleClasses(formCtrl[inputName].$invalid);
          }
        }

        function reset(event, name) {
          if (angular.isUndefined(name) || formCtrl.$name === name) {
            return $timeout(function () {
              el.removeClass('has-error');
              el.removeClass('has-success');
              showValidationMessages = false;
            }, 0, false);
          }
        }

        function toggleClasses(invalid) {
          el.toggleClass('has-error', showValidationMessages && invalid);

          if (showSuccess) {
            return el.toggleClass('has-success', showValidationMessages && !invalid);
          }
        }
      };
    }
  }
}());

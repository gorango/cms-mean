(function() {
  'use strict';

  angular
    .module('core')
    .directive('fileUpload', FileUploadDirective);

  FileUploadDirective.$inject = [];

  function FileUploadDirective() {
    return {
      scope: true,
      link: function(scope, element, attrs) {
        element.on('click', function() {
          var input = document.createElement('input');
          var clickEvent = new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': false });
          input.style.display = 'none';
          input.setAttribute('type', 'file');
          input.dispatchEvent(clickEvent);
          input.addEventListener('change', function(e) {
            var file = e.target.files[0];
            scope.$emit('file-loaded', file);
          });
          angular.element(document.body).append(input);
        });
      }
    };
  }

}());

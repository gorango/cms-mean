(function () {
  'use strict';

  angular.module('core')
    .directive('userSession', userSession);

  userSession.$inject = ['$rootScope', '$state'];

  function userSession($rootScope, $state) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        var officeState = toState.name.split('.')[0] === 'office';
        if (officeState) {
          element.attr('id', 'session');
        }
      }
    }
  }
}());

(function() {
  'use strict';

  angular
    .module('info')
    .factory('UpdatesFactory', UpdatesFactory);

  UpdatesFactory.$inject = (['$q']);

  function UpdatesFactory($q) {
    return {

    };
  }
}());

(function () {
  'use strict';

  angular
    .module('quotes')
    .controller('QuotesController', QuotesController);

  QuotesController.$inject = ['$scope', 'quoteResolve', 'Authentication'];

  function QuotesController($scope, quote, Authentication) {
    var vm = this;

    vm.quote = quote;
    vm.authentication = Authentication;

  }
}());

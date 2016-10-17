(function () {
  'use strict';

  angular
    .module('quotes')
    .controller('QuotesListController', QuotesListController);

  QuotesListController.$inject = ['QuotesService'];

  function QuotesListController(QuotesService) {
    var vm = this;

    vm.quotes = QuotesService.query();
  }
}());

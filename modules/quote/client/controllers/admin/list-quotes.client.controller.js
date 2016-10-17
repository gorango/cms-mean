(function () {
  'use strict';

  angular
    .module('quotes.admin')
    .controller('QuotesAdminListController', QuotesAdminListController);

  QuotesAdminListController.$inject = ['QuotesService'];

  function QuotesAdminListController(QuotesService) {
    var vm = this;

    vm.quotes = QuotesService.query();
  }
}());

(function() {
  'use strict';

  angular
    .module('quotes')
    .filter('orderBySelection', OrderBySelectionFilter);

  OrderBySelectionFilter.$inject = ['ACTIONS'];

  function OrderBySelectionFilter(ACTIONS) {
    // Quote selection contains items from ACTIONS
    // Slice ACTIONS list up to CLIENT_REGULAR (i=19)
    // (TODO: ? Alternatively copy the list here into an array and intersect)
    return function(input) {
      var properOrder = Object.keys(ACTIONS).slice(0, 19);
      return _.intersection(properOrder, input);
    };
  }
}());

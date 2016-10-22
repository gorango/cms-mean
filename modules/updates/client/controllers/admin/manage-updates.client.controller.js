(function () {
  'use strict';

  angular
    .module('updates')
    .controller('ManageUpdatesController', ManageUpdatesController);

  ManageUpdatesController.$inject = ['$sce', 'UpdatesService', 'Authentication'];

  function ManageUpdatesController($sce, UpdatesService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.add = add;
    vm.create = create;
    vm.select = select;
    vm.save = save;
    vm.remove = remove;

    refreshUpdates();

    function refreshUpdates() {
      resetUpdate();
      UpdatesService.query(handleUpdates);
    }

    function resetUpdate() {
      vm.update = {};
    }

    function handleUpdates(updates) {
      angular.forEach(updates, function(update) {
        update.content = $sce.trustAsHtml(update.content);
      });
      vm.updates = updates;
    }

    function handleWeather(res) {
      vm.currentWeather = JSON.parse(res.data);
    }

    function add() {
      resetUpdate();
    }

    function create(update) {
      var newUpdate = new UpdatesService(update);
      newUpdate.$save().then(refreshUpdates);
    }

    function select(update) {
      UpdatesService.get({ updateId: update._id }, function(result) {
        result.date = new Date(result.date); // required for datepicker
        vm.update = result;
      });
    }

    function remove(update) {
      if (update._id) {
        UpdatesService.delete({ updateId: update._id }, function(result) {
          vm.upate = {};
          refreshUpdates();
        });
      }
    }

    function save(update) {
      var _update = angular.copy(update);
      if (_update._id) {
        UpdatesService.update({ updateId: _update._id }, _update)
          .$promise.then(refreshUpdates);
      }
    }
  }
}());

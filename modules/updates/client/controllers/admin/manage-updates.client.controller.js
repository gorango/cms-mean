(function () {
  'use strict';

  angular
    .module('updates')
    .controller('ManageUpdatesController', ManageUpdatesController);

  ManageUpdatesController.$inject = ['$sce', '$mdDialog', 'UpdatesService', 'WeatherService', 'Authentication'];

  function ManageUpdatesController($sce, $mdDialog, UpdatesService, WeatherService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.add = add;
    vm.create = create;
    vm.toggleServiceMode = toggleServiceMode;
    vm.select = select;
    vm.save = save;
    vm.remove = remove;

    init();

    function init() {
      _refreshUpdates();
      WeatherService.query().$promise.then(_handleWeather);
    }

    function add() {
      vm.update = {
        date: new Date(),
        weather: angular.copy(vm.currentWeather)
      };
    }

    function create(update) {
      var newUpdate = new UpdatesService(update);
      newUpdate.$save().then(_refreshUpdates);
    }

    function toggleServiceMode() {
    }

    function select(update) {
      if (!update.length) {
        UpdatesService.get({ updateId: update._id }, function(result) {
          result.date = new Date(result.date); // required for datepicker
          vm.update = result;
        });
      } else {
        select(update[0]);
      }
    }

    function remove(update) {
      if (update._id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog
          .confirm()
          .title('Are you sure?')
          .clickOutsideToClose(true)
          .textContent('Are you sure you want to delete this update?')
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {
          UpdatesService.delete({ updateId: update._id }, function(result) {
            vm.upate = {};
            _refreshUpdates();
          });
        });
      }
    }

    function save(update) {
      var _update = angular.copy(update);
      if (_update._id) {
        UpdatesService.update({ updateId: _update._id }, _update)
          .$promise.then(_refreshUpdates);
      }
    }

    function _refreshUpdates() {
      UpdatesService
      .query(_handleUpdates).$promise
      .then(select);
    }

    function _handleUpdates(updates) {
      angular.forEach(updates, function(update) {
        update.content = $sce.trustAsHtml(update.content);
      });
      vm.updates = updates;
    }

    function _handleWeather(res) {
      console.log(res);
      vm.currentWeather = res[0];
    }
  }
}());

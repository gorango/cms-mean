(function () {
  'use strict';

  angular
    .module('core')
    .controller('ContactController', ContactController);

  ContactController.$inject = ['EmailService'];

  function ContactController(EmailService) {
    var vm = this;
    vm.contact;
    vm.contactForm;
    vm.submitForm = submitForm;

    function submitForm() {
      EmailService.send('CONTACT', angular.copy(vm.contact));
      vm.submitted = true;
    }
  }
}());

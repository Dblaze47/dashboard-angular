(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('editUserBankAccountView', editUserBankAccountView);

    /** @ngInject */
    function editUserBankAccountView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userBankAccounts/editUserBankAccount/editUserBankAccount.html'
        };
    }
})();

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('userBankAccount', userBankAccount);

    /** @ngInject */
    function userBankAccount() {
        return {
            restrict: 'E',
            controller: 'UserBankAccountsCtrl',
            templateUrl: 'app/pages/users/userDetails/userBankAccounts/userBankAccounts.html'
        };
    }
})();

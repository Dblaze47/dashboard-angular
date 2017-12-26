(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencyFees')
        .directive('editAccountCurrencyFee', editAccountCurrencyFee);

    /** @ngInject */
    function editAccountCurrencyFee() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/user/userDetails/userAccounts/accountSettings/accountCurrencyFees/editAccountCurrencyFee/editAccountCurrencyFee.html'
        };
    }
})();

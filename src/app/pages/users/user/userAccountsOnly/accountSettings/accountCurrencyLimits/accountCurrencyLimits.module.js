(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencyLimits', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accountSettings.accountCurrencyLimits', {
                url: '/limits',
                title: 'Account currency limits',
                views:{
                    'accountSettings':{
                        templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountCurrencyLimits/accountCurrencyLimits.html',
                        controller: "AccountCurrencyLimitsCtrl"
                    }
                }
            });
    }

})();
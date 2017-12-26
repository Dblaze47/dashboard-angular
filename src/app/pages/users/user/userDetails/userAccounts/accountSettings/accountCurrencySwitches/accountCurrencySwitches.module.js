(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencySwitches', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accountSettings.accountCurrencySwitches', {
                url: '/switches',
                title: 'Account currency switches',
                views:{
                    'accountSettings':{
                        templateUrl: 'app/pages/users/user/userDetails/userAccounts/accountSettings/accountCurrencySwitches/accountCurrencySwitches.html',
                        controller: "AccountCurrencySwitchesCtrl"
                    }
                }
            });
    }

})();
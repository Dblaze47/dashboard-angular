(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions', [
            'BlurAdmin.pages.transactions.history',
            'BlurAdmin.pages.transactions.debit',
            'BlurAdmin.pages.transactions.credit',
            'BlurAdmin.pages.transactions.transfers'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('transactions', {
                url: '/transactions',
                template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'Transactions',
                sidebarMeta: {
                    order: 100
                }
            });
    }

})();
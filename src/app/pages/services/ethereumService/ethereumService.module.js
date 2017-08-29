(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService', [
      "BlurAdmin.pages.services.ethereumService.ethereumServiceTransactions",
      "BlurAdmin.pages.services.ethereumService.ethereumServiceUsers",
      "BlurAdmin.pages.services.ethereumService.ethereumServiceSettings"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('ethereumService', {
                url: '/services/ethereum',
                abstract:true,
                // templateUrl: 'app/pages/services/ethereumService/ethereumService.html',
                // controller: "EthereumServiceCtrl",
                title: 'Ethereum service'
            });
            $urlRouterProvider.when("/services/ethereum", "/services/ethereum/settings");
    }

})();

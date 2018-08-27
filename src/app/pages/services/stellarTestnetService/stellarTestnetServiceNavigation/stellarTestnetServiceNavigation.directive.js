(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService')
        .directive('stellarTestnetServiceNavigation', stellarTestnetServiceNavigation);

    /** @ngInject */
    function stellarTestnetServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceNavigation/stellarTestnetServiceNavigation.html',
            controller: function($rootScope,$scope,$location){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
            }
        };
    }
})();

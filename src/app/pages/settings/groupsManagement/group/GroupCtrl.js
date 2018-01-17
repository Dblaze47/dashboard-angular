(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group')
        .controller('GroupCtrl', GroupCtrl);

    /** @ngInject */
    function GroupCtrl($scope,$stateParams,cookieManagement,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;

        $scope.goToGroupSettings = function (path) {
            $location.path('/settings/groups-management/' + vm.groupName + path);
        };

        $scope.backToSettings = function () {
            $location.path('/settings/groups-management');
        };

    }
})();
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups', [
        'BlurAdmin.pages.groups.overview',
        'BlurAdmin.pages.groups.groupUsers',
        'BlurAdmin.pages.groups.editGroup',
        'BlurAdmin.pages.groups.groupPermissions',
        'BlurAdmin.pages.groups.groupAccountConfigurations',
        'BlurAdmin.pages.groups.groupManagementTiers',
        'BlurAdmin.pages.groups.groupTransactionSettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups', {
                url: '/groups',
                template: "<ui-view autoscroll='true' autoscroll-body-top></ui-view>",
                controller: function ($scope,_,$state,$location) {

                    var vm = this;
                    vm.location = $location.path();
                    vm.locationArray = vm.location.split('/');
                    $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
                    if($scope.locationIndicator == 'groups'){
                        $state.go('groups.overview');
                    }
                    $scope.$on('$locationChangeStart', function (event,newUrl) {
                         var newUrlArray = newUrl.split('/'),
                             newUrlLastElement = _.last(newUrlArray);
                         if(newUrlLastElement == 'groups'){
                             $state.go('groups.overview');
                         }
                    });
                },
                title: "Groups",
                sidebarMeta: {
                    order: 600
                }
            });
        $urlRouterProvider.when("/groups","/groups/overview");
    }

})();
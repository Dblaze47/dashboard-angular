(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceUsers')
        .controller('StellarServiceUsersCtrl', StellarServiceUsersCtrl);

    /** @ngInject */
    function StellarServiceUsersCtrl($scope,$http,cookieManagement,errorHandler,$location,environmentConfig) {
        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');

        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.usersSearchParams = {
            searchEmail:'',
            searchIdentifier: '',
            searchAddress: ''
        };

        $scope.users = [];
        $scope.loadingUsers = true;

        vm.getUsersUrl = function(){
            vm.filterParams = '?page=' + $scope.usersPagination.pageNo + '&page_size=' + $scope.usersPagination.itemsPerPage
            + '&email=' + ($scope.usersSearchParams.searchEmail? encodeURIComponent($scope.usersSearchParams.searchEmail) : '')
            + '&identifier=' + $scope.usersSearchParams.searchIdentifier
            + '&address=' + $scope.usersSearchParams.searchAddress;

            return vm.serviceUrl + 'users/' + vm.filterParams;
        };

        $scope.getAllUsers = function(applyFilter){
            $scope.usersStateMessage = '';
            $scope.loadingUsers = true;

            if(applyFilter){
                $scope.usersPagination.pageNo = 1;
            }

            if($scope.users.length > 0 ){
                $scope.users.length = 0;
            }

            var usersUrl = vm.getUsersUrl();

            $http.get(usersUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingUsers = false;
                if (res.status === 200) {
                    $scope.usersData = res.data.data;
                    $scope.users = res.data.data.results;
                    if($scope.users.length == 0){
                        $scope.usersStateMessage = 'No users have been found';
                        return;
                    }
                    $scope.usersStateMessage = '';
                }
            }).catch(function (error) {
                $scope.loadingUsers = false;
                if(error.status == 403){
                    $location.path('/services');
                    return
                }
                $scope.usersStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getAllUsers();

    }
})();

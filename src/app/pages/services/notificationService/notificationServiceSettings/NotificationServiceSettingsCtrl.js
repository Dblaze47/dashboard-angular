(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('NotificationServiceSettingsCtrl', NotificationServiceSettingsCtrl);

    /** @ngInject */
    function NotificationServiceSettingsCtrl($scope,$http,cookieManagement,toastr,errorToasts,$state) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.notificationSettingView = '';
        $scope.updatingCompanyDetails =  false;
        vm.updatedCompany = {};
        $scope.company = {};

        $scope.goToNotificationSetting = function (setting) {
            $scope.notificationSettingView = setting;
        };

        vm.getCompanyDetails = function () {
          $scope.updatingCompanyDetails =  true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    if (res.status === 200) {
                      $scope.company = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getCompanyDetails();

        $scope.companyDetailsChanged = function (field) {
            vm.updatedCompany[field] = $scope.company[field];
        };

        $scope.updateCompanyDetails = function () {
          $scope.updatingCompanyDetails =  true;
            $scope.company = {};
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/company/', vm.updatedCompany, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    if (res.status === 200) {
                      toastr.success('Company details have been successfully updated');
                      $scope.company = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        $scope.goToTransactionsWebhooks = function(secret){
            $state.go('webhooks.transactionWebhooks',{"secret": secret});
        };

        $scope.goToUsersWebhooks = function(secret){
            $state.go('webhooks.userWebhooks',{"secret": secret});
        };



    }

})();

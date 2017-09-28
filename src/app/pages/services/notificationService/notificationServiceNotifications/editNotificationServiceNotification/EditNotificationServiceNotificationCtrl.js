(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotificationServiceNotification')
        .controller('EditNotificationServiceNotificationCtrl', EditNotificationServiceNotificationCtrl);

    /** @ngInject */
    function EditNotificationServiceNotificationCtrl($scope,$http,cookieManagement,$filter,errorHandler,$location,$stateParams,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        vm.updatedNotification = {};
        $scope.loadingNotifications =  false;

        $scope.boolOptions = ['True','False'];

        vm.eventOptionsObj = {
            USER_CREATE: 'user.create',
            USER_UPDATE: 'user.update',
            USER_PASSWORD_RESET: 'user.password.reset',
            USER_EMAIL_VERIFY: 'user.email.verify',
            USER_MOBILE_VERIFY: 'user.mobile.verify',
            ADDRESS_CREATE: 'address.create',
            ADDRESS_UPDATE: 'address.update',
            DOCUMENT_CREATE: 'document.create',
            DOCUMENT_UPDATE: 'document.update',
            BANK_ACCOUNT_CREATE: 'bank_account.create',
            BANK_ACCOUNT_UPDATE: 'bank_account.update',
            CRYPTO_ACCOUNT_CREATE: 'crypto_account.create',
            CRYPTO_ACCOUNT_UPDATE: 'crypto_account.update',
            TRANSACTION_CREATE: 'transaction.create',
            TRANSACTION_UPDATE: 'transaction.update',
            TRANSACTION_DELETE: 'transaction.delete',
            TRANSACTION_INITIATE: 'transaction.initiate',
            TRANSACTION_EXECUTE: 'transaction.execute'
        };

        $scope.eventOptions = ['User Create','User Update','User Password Reset','User Email Verify','User Mobile Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

        vm.getSingleNotification = function () {
            $scope.loadingNotifications =  true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/notifications/' + $stateParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingNotifications =  false;
                    if (res.status === 200) {
                        $scope.editNotification = res.data.data;
                        $scope.editNotification.event = $filter('capitalizeDottedSentence')(res.data.data.event);
                        $scope.editNotification.event = $filter('capitalizeUnderscoredSentence')($scope.editNotification.event);
                        $scope.editNotification.enabled = $scope.editNotification.enabled == true ? 'True' : 'False';
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getSingleNotification();

        $scope.goToNotificationListView = function () {
            $location.path('/services/notifications/list');
        };


        $scope.notificationChanged = function (field) {
            vm.updatedNotification[field] = $scope.editNotification[field];
        };

        $scope.updateNotification = function () {
            $scope.loadingNotifications =  true;
            if(vm.updatedNotification.enabled){
                vm.updatedNotification.enabled = vm.updatedNotification.enabled == 'True' ? true : false;
            }
            if(vm.updatedNotification.event){
                var event = vm.updatedNotification.event.toUpperCase();
                event = event.replace(/ /g, '_');
                vm.updatedNotification.event = vm.eventOptionsObj[event];
            }

            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/notifications/' + $scope.editNotification.id + '/',vm.updatedNotification, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Notification updated successfully');
                        $location.path('/services/notifications/list')
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.notifications')
        .controller('NotificationsCtrl', NotificationsCtrl);

    /** @ngInject */
    function NotificationsCtrl($scope,environmentConfig,toastr,$http,cookieManagement,errorToasts) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingCompanyNotifications = true;

        vm.getCompanyNotifications = function () {
            if(vm.token) {
                $scope.loadingCompanyNotifications = true;
                $http.get(environmentConfig.API + '/admin/notifications/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingCompanyNotifications = false;
                    if (res.status === 200) {
                        $scope.notifications = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingCompanyNotifications = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getCompanyNotifications();

        $scope.saveNotifications = function(notification){
          $scope.loadingCompanyNotifications = true;
            $http.patch(environmentConfig.API + '/admin/notifications/' + notification.id + '/', {enabled: notification.enabled}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
              $scope.loadingCompanyNotifications = false;
                if (res.status === 200) {
                    toastr.success('You have successfully updated the notification');
                }
            }).catch(function (error) {
              $scope.loadingCompanyNotifications = false;
                errorToasts.evaluateErrors(error.data);
            });
        }

    }
})();

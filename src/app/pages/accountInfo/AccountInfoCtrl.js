(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountInfo')
        .controller('AccountInfoCtrl', AccountInfoCtrl);

    /** @ngInject */
    function AccountInfoCtrl($scope,Rehive,localStorageManagement,errorHandler,toastr,$location) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingAccountInfo = true;
        $scope.changingPassword = false;
        $scope.addingEmail = false;
        $scope.loadingAdminEmails = true;
        $scope.newEmail = {primary: true};
        vm.updatedAdministrator = {};

        $scope.accountInfoChanged = function(field){
            vm.updatedAdministrator[field] = $scope.administrator[field];
        };

        vm.getAdminAccountInfo = function () {
            if(vm.token) {
                $scope.loadingAccountInfo = true;
                Rehive.user.get().then(function(res){
                    $scope.loadingAccountInfo = false;
                    $scope.administrator = res;
                    $scope.$apply();
                },function(error){
                    $scope.loadingAccountInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getAdminAccountInfo();

        $scope.updateAdministratorAccount = function(){
            $scope.loadingAccountInfo = true;
            Rehive.user.update(vm.updatedAdministrator).then(function (res) {
                $scope.loadingAccountInfo = false;
                $scope.administrator = res;
                vm.updatedAdministrator = {};
                toastr.success('You have successfully updated the administrator info');
                $scope.$apply();
            }, function (error) {
                vm.updatedAdministrator = {};
                $scope.loadingAccountInfo = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getUserEmails = function () {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.get().then(function (res) {
                    $scope.loadingAdminEmails = false;
                    $scope.adminEmailsList = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserEmails();

        $scope.updateEmail = function (email) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.update(email.id,{primary: true}).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    toastr.success('Primary email changed successfully');
                    vm.getUserEmails();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.createEmail = function (newEmail) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.create(newEmail).then(function (res)
                {
                    $scope.loadingAdminEmails = false;
                    toastr.success('Email added successfully');
                    $scope.toggleAddEmailView();
                    $scope.newEmail = {primary: true};
                    vm.getUserEmails();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteEmail = function (email) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.delete(email.id).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    toastr.success('Email deleted successfully');
                    vm.getUserEmails();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleAddEmailView = function(){
            $scope.addingEmail = !$scope.addingEmail;
        };

        $scope.changePassword = function (passwordChangeParams) {
            $scope.changingPassword = true;
            Rehive.auth.password.change(passwordChangeParams).then(function(res){
                $scope.changingPassword = false;
                toastr.success('New password has been saved');
                $scope.passwordChangeParams = {};
                $scope.$apply();
            },function(error){
                $scope.changingPassword = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.viewAllEmails = function (){
            $location.path('/admin/emails');
        };
    }
})();

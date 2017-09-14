(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('BankAccountsCtrl', BankAccountsCtrl);

    /** @ngInject */
    function BankAccountsCtrl($scope,environmentConfig,$uibModal,toastr,$http,cookieManagement,errorToasts,$window) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.editingBankAccounts = false;
        $scope.loadingBankAccounts = true;
        $scope.newBankData = {};
        vm.updatedBankAccount = {};


        $scope.toggleEditBankAccountsView = function(bankAccount){
            if(bankAccount){
                vm.getBankAccount(bankAccount);
            } else {
                $scope.editBankData = {};
                vm.getBankAccounts();
            }

            $scope.editingBankAccounts = !$scope.editingBankAccounts;
        };

        vm.getBankAccount = function (bankAccount) {
            $scope.loadingBankAccounts = true;
            $http.get(environmentConfig.API + '/admin/bank-accounts/' + bankAccount.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingBankAccounts = false;
                if (res.status === 200) {
                    $scope.editBankData = res.data.data;
                }
            }).catch(function (error) {
                $scope.loadingBankAccounts = false;
                errorToasts.evaluateErrors(error.data);
            });
        };

        vm.getBankAccounts = function () {
            if(vm.token) {
                $scope.loadingBankAccounts = true;
                $http.get(environmentConfig.API + '/admin/bank-accounts/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingBankAccounts = false;
                    if (res.status === 200) {
                        $scope.bankAccounts = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingBankAccounts = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getBankAccounts();

        $scope.addBankAccount = function (newBankAccount) {
            $http.post(environmentConfig.API + '/admin/bank-accounts/', newBankAccount, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingBankAccounts = false;
                if (res.status === 201) {
                    vm.getBankAccounts();
                    toastr.success('You have successfully added the bank account!');
                    $scope.newBankData = {};
                    $window.scrollTo(0, 0);
                }
            }).catch(function (error) {
                $scope.loadingBankAccounts = false;
                errorToasts.evaluateErrors(error.data);
            });
        };

        $scope.bankAccountChanged = function(field){
            vm.updatedBankAccount[field] = $scope.editBankData[field];
        };

        $scope.updateBankAccount = function () {
            $window.scrollTo(0, 0);
            $scope.editingBankAccounts = !$scope.editingBankAccounts;
            $scope.loadingBankAccounts = true;
            $http.patch(environmentConfig.API + '/admin/bank-accounts/'+ $scope.editBankData.id + '/', vm.updatedBankAccount, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingBankAccounts = false;
                if (res.status === 200) {
                    vm.updatedBankAccount = {};
                    vm.getBankAccounts();
                    toastr.success('You have successfully updated the bank account!');
                }
            }).catch(function (error) {
                $scope.loadingBankAccounts = false;
                vm.updatedBankAccount = {};
                errorToasts.evaluateErrors(error.data);
            });
        };

        vm.findIndexOfBankAccount = function(element){
            return this.id == element.id;
        };

        $scope.openBankAccountModal = function (page, size,bankAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'BankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theModal.result.then(function(bankAccount){
                var index = $scope.bankAccounts.findIndex(vm.findIndexOfBankAccount,bankAccount);
                $scope.bankAccounts.splice(index, 1);
            }, function(){
            });
        };
    }
})();

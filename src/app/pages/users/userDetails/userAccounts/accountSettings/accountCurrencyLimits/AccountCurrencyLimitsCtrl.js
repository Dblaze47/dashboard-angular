(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencyLimits')
        .controller('AccountCurrencyLimitsCtrl', AccountCurrencyLimitsCtrl);

    /** @ngInject */
    function AccountCurrencyLimitsCtrl($window,$scope,$stateParams,$http,$uibModal,environmentConfig,cookieManagement,errorToasts,currencyModifiers,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currencyCode = $stateParams.currencyCode;
        vm.reference = $stateParams.reference;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        $scope.loadingAccountCurrencyLimits = true;
        $scope.editingAccountCurrencyLimits = false;
        vm.updatedAccountCurrencyLimit = {};
        $scope.accountCurrencyLimitsParams = {
            tx_type: 'Credit',
            type: 'Maximum'
        };
        $scope.txTypeOptions = ['Credit','Debit'];
        $scope.typeOptions = ['Maximum','Maximum per day','Maximum per month','Minimum','Overdraft'];

        vm.getCurrencyObjFromCurrenciesList = function(){
            $scope.currencyObj = vm.currenciesList.find(function(element){
                return element.code == vm.currencyCode;
            });
        };
        vm.getCurrencyObjFromCurrenciesList();

        $scope.toggleAccountCurrencyLimitEditView = function(accountCurrencyLimit){
            if(accountCurrencyLimit) {
                vm.getAccountCurrencyLimit(accountCurrencyLimit);
            } else {
                $scope.editAccountCurrencyLimit = {};
                $scope.getAccountCurrencyLimits();
            }
            $scope.editingAccountCurrencyLimits = !$scope.editingAccountCurrencyLimits;
        };

        vm.getAccountCurrencyLimit = function (accountCurrencyLimit) {
            $scope.loadingAccountCurrencyLimits = true;
            $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/' + accountCurrencyLimit.id +'/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingAccountCurrencyLimits = false;
                if (res.status === 200) {
                    $scope.editAccountCurrencyLimit = res.data.data;
                    $scope.editAccountCurrencyLimit.value = currencyModifiers.convertFromCents($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility);
                    $scope.editAccountCurrencyLimit.tx_type == 'credit' ? $scope.editAccountCurrencyLimit.tx_type = 'Credit' : $scope.editAccountCurrencyLimit.tx_type = 'Debit';
                }
            }).catch(function (error) {
                $scope.loadingAccountCurrencyLimits = false;
                if(error.status == 403){
                    errorHandler.handle403();
                    return
                }
                errorToasts.evaluateErrors(error.data);
            });
        };

        $scope.getAccountCurrencyLimits = function(){
            if(vm.token) {
                $scope.loadingAccountCurrencyLimits = true;
                $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencyLimits = false;
                    if (res.status === 200) {
                       $scope.accountCurrencyLimitsList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAccountCurrencyLimits = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        $scope.getAccountCurrencyLimits();

        $scope.addAccountCurrencyLimit = function(accountCurrencyLimitsParams){
            if(accountCurrencyLimitsParams.value){
                if(currencyModifiers.validateCurrency(accountCurrencyLimitsParams.value,$scope.currencyObj.divisibility)){
                    accountCurrencyLimitsParams.value = currencyModifiers.convertToCents(accountCurrencyLimitsParams.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                accountCurrencyLimitsParams.value = 0;
            }
            if(vm.token) {
                $scope.loadingAccountCurrencyLimits = true;
                accountCurrencyLimitsParams.tx_type = accountCurrencyLimitsParams.tx_type.toLowerCase();
                accountCurrencyLimitsParams.type = accountCurrencyLimitsParams.type == 'Maximum' ? 'max': accountCurrencyLimitsParams.type == 'Maximum per day' ? 'day_max':
                    accountCurrencyLimitsParams.type == 'Maximum per month' ? 'month_max': accountCurrencyLimitsParams.type == 'Minimum' ? 'min': 'overdraft';

                $http.post(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/',accountCurrencyLimitsParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencyLimits = false;
                    if (res.status === 201) {
                        toastr.success('Limit added successfully.');
                        $scope.accountCurrencyLimitsParams = {
                            tx_type: 'Credit',
                            type: 'Maximum'
                        };
                        $scope.getAccountCurrencyLimits();
                    }
                }).catch(function (error) {
                    $scope.accountCurrencyLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum'
                    };
                    $scope.loadingAccountCurrencyLimits = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        $scope.accountCurrencyLimitChanged = function(field){
            vm.updatedAccountCurrencyLimit[field] = $scope.editAccountCurrencyLimit[field];
        };

        $scope.updateAccountCurrencyLimit = function(){
            if($scope.editAccountCurrencyLimit.value){
                if(currencyModifiers.validateCurrency($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility)){
                    vm.updatedAccountCurrencyLimit.value = currencyModifiers.convertToCents($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedAccountCurrencyLimit.value = 0;
            }

            if(vm.token) {
                $scope.loadingAccountCurrencyLimits = true;
                $scope.editingAccountCurrencyLimits = !$scope.editingAccountCurrencyLimits;
                vm.updatedAccountCurrencyLimit.tx_type ? vm.updatedAccountCurrencyLimit.tx_type = vm.updatedAccountCurrencyLimit.tx_type.toLowerCase() : '';
                vm.updatedAccountCurrencyLimit.type ? vm.updatedAccountCurrencyLimit.type = vm.updatedAccountCurrencyLimit.type == 'Maximum' ? 'max': vm.updatedAccountCurrencyLimit.type == 'Maximum per day' ? 'day_max':
                    vm.updatedAccountCurrencyLimit.type == 'Maximum per month' ? 'month_max': vm.updatedAccountCurrencyLimit.type == 'Minimum' ? 'min': 'overdraft' : '';

                $http.patch(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/' + $scope.editAccountCurrencyLimit.id +'/',vm.updatedAccountCurrencyLimit,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencyLimits = false;
                    if (res.status === 200) {
                        toastr.success('Limit updated successfully');
                        $scope.accountCurrencyLimitsParams = {
                            tx_type: 'Credit',
                            type: 'Maximum'
                        };
                        vm.updatedAccountCurrencyLimit = {};
                        $scope.getAccountCurrencyLimits();

                    }
                }).catch(function (error) {
                    $scope.accountCurrencyLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum'
                    };
                    vm.updatedAccountCurrencyLimit = {};
                    $scope.getAccountCurrencyLimits();
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        vm.findIndexOfAccountCurrencyLimit = function(element){
            return this.id == element.id;
        };

        $scope.openAccountCurrencyLimitsModal = function (page, size,accountCurrencyLimit) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AccountCurrencyLimitsModalCtrl',
                scope: $scope,
                resolve: {
                    accountCurrencyLimit: function () {
                        return accountCurrencyLimit;
                    },
                    currencyCode: function () {
                        return vm.currencyCode
                    },
                    reference: function () {
                        return vm.reference
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyLimit){
                var index = $scope.accountCurrencyLimitsList.findIndex(vm.findIndexOfAccountCurrencyLimit,accountCurrencyLimit);
                $scope.accountCurrencyLimitsList.splice(index, 1);
            }, function(){
            });
        };


    }
})();
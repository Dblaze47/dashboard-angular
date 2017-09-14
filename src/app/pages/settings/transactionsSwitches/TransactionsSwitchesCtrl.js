(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.transactionsSwitches')
        .controller('TransactionsSwitchesCtrl', TransactionsSwitchesCtrl);

    function TransactionsSwitchesCtrl($scope,environmentConfig,$uibModal,$rootScope,toastr,$http,_,
                                      sharedResources,cookieManagement,errorToasts,$window) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingTransactionsSwitches = true;
        $scope.loadingSubtypes = false;
        $scope.transactionsSwitches = {};
        vm.updatedTransactionsSwitch = {};
        $scope.transactionsSwitchParams = {
            tx_type: 'Credit',
            enabled: 'False',
            subtype: ''
        };
        $scope.transactionsSwitchesOptions = ['Credit','Debit'];
        $scope.boolOptions = ['True','False'];

        $scope.getSubtypesArray = function(params,editing){
            $scope.loadingSubtypes = true;
            if(!editing){
                params.subtype = '';
            } else if(!params.subtype && editing){
                params.subtype = '';
            }
            sharedResources.getSubtypes().then(function (res) {
                res.data.data = res.data.data.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res.data.data,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
            });
        };
        $scope.getSubtypesArray($scope.transactionsSwitchParams);

        $scope.toggleTransactionsSwitchesEditView = function(transactionsSwitch){
            if(transactionsSwitch) {
                vm.getTransactionsSwitch(transactionsSwitch);
            } else {
                $scope.editTransactionsSwitch.enabled == 'True' ? $scope.editTransactionsSwitch.enabled = true : $scope.editTransactionsSwitch.enabled = false;
                $scope.editTransactionsSwitch = {};
                vm.getTransactionsSwitches();
            }
            $scope.editingTransactionsSwitches = !$scope.editingTransactionsSwitches;
        };

        vm.getTransactionsSwitch = function (transactionsSwitch) {
            $scope.loadingTransactionsSwitches = true;
            $http.get(environmentConfig.API + '/admin/company/switches/' + transactionsSwitch.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingTransactionsSwitches = false;
                if (res.status === 200) {
                    $scope.editTransactionsSwitch = res.data.data;
                    $scope.editTransactionsSwitch.tx_type == 'credit' ? $scope.editTransactionsSwitch.tx_type = 'Credit' : $scope.editTransactionsSwitch.tx_type = 'Debit';
                    $scope.editTransactionsSwitch.enabled == true ? $scope.editTransactionsSwitch.enabled = 'True' : $scope.editTransactionsSwitch.enabled = 'False';
                    $scope.getSubtypesArray($scope.editTransactionsSwitch,'editing');
                }
            }).catch(function (error) {
                $scope.loadingTransactionsSwitches = false;
                errorToasts.evaluateErrors(error.data);
            });
        };

        vm.getTransactionsSwitches = function () {
            if(vm.token) {
                $scope.loadingTransactionsSwitches = true;
                $http.get(environmentConfig.API + '/admin/company/switches/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTransactionsSwitches = false;
                    if (res.status === 200) {
                        $scope.transactionsSwitchesList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTransactionsSwitches = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getTransactionsSwitches();

        $scope.addTransactionsSwitch = function (transactionsSwitchParams) {
            $window.scrollTo(0,0);
            transactionsSwitchParams.tx_type ? transactionsSwitchParams.tx_type = transactionsSwitchParams.tx_type.toLowerCase() : '';
            transactionsSwitchParams.enabled ? transactionsSwitchParams.enabled = transactionsSwitchParams.enabled == 'True' ? true: false : '';
            if(vm.token) {
                $scope.loadingTransactionsSwitches = true;
                $http.post(environmentConfig.API + '/admin/company/switches/', transactionsSwitchParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTransactionsSwitches = false;
                    if (res.status === 201) {
                        toastr.success('Successfully created the transactions switch!');
                        $scope.transactionsSwitchParams = {
                            tx_type: 'Credit',
                            enabled: 'False',
                            subtype: ''
                        };
                        $scope.getSubtypesArray($scope.transactionsSwitchParams);
                        vm.getTransactionsSwitches();
                    }
                }).catch(function (error) {
                    $scope.transactionsSwitchParams = {
                        tx_type: 'Credit',
                        enabled: 'False',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.transactionsSwitchParams);
                    $scope.loadingTransactionsSwitches = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        $scope.transactionsSwitchChanged = function(field){
            vm.updatedTransactionsSwitch[field] = $scope.editTransactionsSwitch[field];
        };

        $scope.updateTransactionsSwitch = function () {
            $window.scrollTo(0,0);

            if(!$scope.editTransactionsSwitch.subtype){
                vm.updatedTransactionsSwitch.subtype = '';
            }
            vm.updatedTransactionsSwitch.tx_type ? vm.updatedTransactionsSwitch.tx_type = vm.updatedTransactionsSwitch.tx_type.toLowerCase() : '';
            vm.updatedTransactionsSwitch.enabled ? vm.updatedTransactionsSwitch.enabled = vm.updatedTransactionsSwitch.enabled == 'True' ? true: false : '';
            if(vm.token) {
                $scope.loadingTransactionsSwitches = true;
                $http.patch(environmentConfig.API + '/admin/company/switches/' + $scope.editTransactionsSwitch.id + '/', vm.updatedTransactionsSwitch, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTransactionsSwitches = false;
                    if (res.status === 200) {
                        $scope.editingTransactionsSwitches = !$scope.editingTransactionsSwitches;
                        vm.updatedTransactionsSwitch = {};
                        toastr.success('Successfully updated the transactions switch!');
                        vm.getTransactionsSwitches();
                    }
                }).catch(function (error) {
                    vm.updatedTransactionsSwitch = {};
                    $scope.loadingTransactionsSwitches = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        vm.findIndexOfTransactionsSwitches = function(element){
            return this.id == element.id;
        };

        $scope.openTransactionsSwitchesModal = function (page, size,transactionsSwitches) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'TransactionsSwitchModalCtrl',
                scope: $scope,
                resolve: {
                    transactionsSwitches: function () {
                        return transactionsSwitches;
                    }
                }
            });

            vm.theModal.result.then(function(transactionsSwitches){
                var index = $scope.transactionsSwitchesList.findIndex(vm.findIndexOfTransactionsSwitches,transactionsSwitches);
                $scope.transactionsSwitchesList.splice(index, 1);
            }, function(){
            });
        };

    }
})();

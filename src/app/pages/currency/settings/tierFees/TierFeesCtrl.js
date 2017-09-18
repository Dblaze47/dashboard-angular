(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.settings.tierFees')
        .controller('TierFeesCtrl', TierFeesCtrl);

    /** @ngInject */
    function TierFeesCtrl($rootScope,$scope,cookieManagement,$http,environmentConfig,_,
                          sharedResources,$timeout,errorHandler,toastr,$uibModal,currencyModifiers) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.activeTabIndex = 0;
        $scope.loadingTierFees = true;
        $scope.loadingSubtypes = false;
        $scope.editingTierFees = false;
        vm.updatedTierFee = {};
        $scope.tierFeesParams = {
            tx_type: 'Credit',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];

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
        $scope.getSubtypesArray($scope.tierFeesParams);

        $rootScope.$watch('selectedCurrency',function(){
            if($rootScope.selectedCurrency && $rootScope.selectedCurrency.code) {
                $scope.getAllTiers();
            }
        });

        $scope.toggleTierFeeEditView = function(tierFee){
            if(tierFee) {
                vm.getTierFee(tierFee);
            } else {
                $scope.editTierFee = {};
                $scope.getAllTiers($scope.selectedTier.level);
            }
            $scope.editingTierFees = !$scope.editingTierFees;
        };

        vm.getTierFee = function (tierFee) {
            $scope.loadingTierFees = true;
            $http.get(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/fees/' + tierFee.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingTierFees = false;
                if (res.status === 200) {
                    $scope.editTierFee = res.data.data;
                    $scope.editTierFee.value = currencyModifiers.convertFromCents($scope.editTierFee.value,$rootScope.selectedCurrency.divisibility);
                    $scope.editTierFee.tx_type == 'credit' ? $scope.editTierFee.tx_type = 'Credit' : $scope.editTierFee.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editTierFee,'editing');
                }
            }).catch(function (error) {
                $scope.loadingTierFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierFees = true;
                $http.get(environmentConfig.API + '/admin/tiers/?currency=' + $rootScope.selectedCurrency.code, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        vm.unsortedTierLevelsArray = _.pluck(res.data.data ,'level');
                        vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                            return a - b;
                        });
                        $scope.tierLevelsForFees = vm.sortedTierLevelsArray;
                        $scope.allTiers = res.data.data.sort(function(a, b) {
                            return parseFloat(a.level) - parseFloat(b.level);
                        });
                        if(tierLevel){
                            $scope.selectTier(tierLevel);
                        } else {
                            $timeout(function(){
                                $scope.activeTabIndex = 0;
                            });
                            $scope.selectTier($scope.tierLevelsForFees[0]);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findIndexOfTier = function(element){
            return this == element.level;
        };

        $scope.selectTier = function(tierLevel){
            $scope.editingTierFees = false;
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierFees();
            }
        };

        $scope.getTierFees = function(){
            if(vm.token) {
                $scope.loadingTierFees = true;
                $http.get(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/fees/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        $scope.tiersFeesList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addTierFee = function(tierFeesParams){
            if(tierFeesParams.value){
                if(currencyModifiers.validateCurrency(tierFeesParams.value,$rootScope.selectedCurrency.divisibility)){
                    tierFeesParams.value = currencyModifiers.convertToCents(tierFeesParams.value,$rootScope.selectedCurrency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $rootScope.selectedCurrency.divisibility + ' decimal places');
                    return;
                }
            }

            if(!tierFeesParams.percentage){
                tierFeesParams.percentage = 0;
            }
            if(vm.token) {
                $scope.loadingTierFees = true;
                tierFeesParams.tx_type = tierFeesParams.tx_type.toLowerCase();
                $http.post(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/fees/',tierFeesParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 201) {
                        toastr.success('Fee added successfully to tier');
                        $scope.tierFeesParams = {
                            tx_type: 'Credit',
                            subtype: ''
                        };
                        $scope.getSubtypesArray($scope.tierFeesParams);
                        $scope.getAllTiers($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.tierFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.tierFeesParams);
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.tierFeeChanged = function(field){
            vm.updatedTierFee[field] = $scope.editTierFee[field];
        };

        $scope.updateTierFee = function(){

            if(!$scope.editTierFee.subtype){
                vm.updatedTierFee.subtype = '';
            }

            if($scope.editTierFee.value){
                if(currencyModifiers.validateCurrency($scope.editTierFee.value,$rootScope.selectedCurrency.divisibility)){
                    vm.updatedTierFee.value = currencyModifiers.convertToCents($scope.editTierFee.value,$rootScope.selectedCurrency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $rootScope.selectedCurrency.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedTierFee.value = 0;
            }

            if(!vm.updatedTierFee.percentage){
                vm.updatedTierFee.percentage = 0;
            }

            if(vm.token) {
                $scope.loadingTierFees = true;
                $scope.editingTierFees = !$scope.editingTierFees;
                vm.updatedTierFee.tx_type ? vm.updatedTierFee.tx_type = vm.updatedTierFee.tx_type.toLowerCase() : '';

                $http.patch(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/fees/' + $scope.editTierFee.id + '/',vm.updatedTierFee,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        toastr.success('Fee updated successfully');
                        $scope.tierFeesParams = {
                            tx_type: 'Credit',
                            subtype: ''
                        };
                        vm.updatedTierFee = {};
                        $scope.getAllTiers($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.tierFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    vm.updatedTierFee = {};
                    $scope.getAllTiers($scope.selectedTier.level);
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findIndexOfTierFee = function(element){
            return this.id == element.id;
        };

        $scope.openTierFeesModal = function (page, size,tierFee) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'TierFeesModalCtrl',
                scope: $scope,
                resolve: {
                    tierFee: function () {
                        return tierFee;
                    },
                    selectedTier: function () {
                        return $scope.selectedTier;
                    }
                }
            });

            vm.theModal.result.then(function(tierFee){
                var index = $scope.tiersFeesList.findIndex(vm.findIndexOfTierFee,tierFee);
                $scope.tiersFeesList.splice(index, 1);
            }, function(){
            });
        };

    }
})();

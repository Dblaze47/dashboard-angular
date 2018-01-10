(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierRequirements')
        .controller('TierRequirementsCtrl', TierRequirementsCtrl);

    /** @ngInject */
    function TierRequirementsCtrl($scope,$stateParams,cookieManagement,$http,environmentConfig,errorHandler,_,toastr,$window,$timeout) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.activeTabIndex = 0;
        $scope.loadingTierRequirements = true;
        $scope.tierRequirementFields = {};
        vm.updatedTierRequirements = {};

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierRequirements = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierRequirements = false;
                    if (res.status === 200) {
                        vm.unsortedTierLevelsArray = _.pluck(res.data.data ,'level');
                        vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                            return a - b;
                        });
                        $scope.tierLevelsForRequirements = vm.sortedTierLevelsArray;
                        $scope.allTiers = res.data.data.sort(function(a, b) {
                            return parseFloat(a.level) - parseFloat(b.level);
                        });
                        if(tierLevel){
                          $scope.selectTier(tierLevel);
                        } else {
                          $timeout(function(){
                              $scope.activeTabIndex = 0;
                            });
                          $scope.selectTier($scope.tierLevelsForRequirements[0]);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTierRequirements = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getAllTiers();

        vm.findIndexOfTier = function(element){
            return this == element.level;
        };

        $scope.selectTier = function(tierLevel){
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierRequirements();
            }
        };

        $scope.getTierRequirements = function(){
            if(vm.token) {
                $scope.loadingTierRequirements = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/requirements/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierRequirements = false;
                    if (res.status === 200) {
                        vm.checkRequirementsInTier(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.loadingTierRequirements = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.checkRequirementsInTier = function(requirementsArray){
            $scope.tierRequirementFields = {};
            requirementsArray.forEach(function(element){
                var fieldString = element.requirement.toLowerCase().trim();
                var fieldName = fieldString.replace(/ /g,'_');
                $scope.tierRequirementFields[fieldName] = true;
            });
        };

        $scope.toggleTierRequirements = function(fieldName){
            if(vm.updatedTierRequirements.hasOwnProperty(fieldName)){
                delete vm.updatedTierRequirements[fieldName];
            } else {
                vm.updatedTierRequirements[fieldName] = $scope.tierRequirementFields[fieldName];
            }
        };

        $scope.updateTierRequirements = function () {
            $scope.loadingTierRequirements = true;
            var fieldsArray = Object.keys(vm.updatedTierRequirements);
            for(var i = 0; i < fieldsArray.length; i++){
                if(vm.updatedTierRequirements[fieldsArray[i]]){
                    if(i == (fieldsArray.length - 1)){
                        $scope.saveTierRequirements(fieldsArray[i],'last');
                    } else {
                        $scope.saveTierRequirements(fieldsArray[i]);
                    }
                } else {
                    if(i == (fieldsArray.length - 1)){
                        $scope.deleteTierRequirements(fieldsArray[i],'last');
                    } else {
                        $scope.deleteTierRequirements(fieldsArray[i]);
                    }
                }
            }
            $scope.loadingTierRequirements = false;
            vm.updatedTierRequirements = {};
        };

        $scope.saveTierRequirements = function(fieldName,last){
            if(vm.token) {
                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/requirements/' , {"requirement": fieldName} ,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        if(last){
                            $scope.getAllTiers($scope.selectedTier.level);
                            toastr.success('Tier requirements updated successfully')
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findRequirementId =  function(fieldName){
            var requirementId;
            var capitalizedFieldName = fieldName.replace(/_/g,' ').replace(/\b\w/g, function(l){ return l.toUpperCase() });
            $scope.selectedTier.requirements.forEach(function(element){
                if(element.requirement == capitalizedFieldName){
                    requirementId = element.id;
                }
            });

            return requirementId;
        };

        $scope.deleteTierRequirements = function(fieldName,last){
            var requirementId = vm.findRequirementId(fieldName);
            if(vm.token) {
                $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/requirements/' + requirementId + '/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(last){
                            $scope.getAllTiers($scope.selectedTier.level);
                            toastr.success('Tier requirements updated successfully')
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();

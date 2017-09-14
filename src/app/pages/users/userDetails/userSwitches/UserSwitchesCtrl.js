(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userDetails')
        .controller('UserSwitchesCtrl', UserSwitchesCtrl);

    /** @ngInject */
    function UserSwitchesCtrl($scope,environmentConfig,$stateParams,$http,_,
                              sharedResources,cookieManagement,errorToasts,toastr,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.updatedUserSwitch = {};
        $scope.loadingUserSwitches = true;
        $scope.addingUserSwitches = false;
        $scope.loadingSubtypes = false;
        $scope.editingUserSwitches = false;
        $scope.userSwitchesOptions = ['Credit','Debit'];
        $scope.boolOptions = ['False','True'];
        $scope.userSwitchParams = {
            tx_type: 'Credit',
            enabled: 'False',
            subtype: ''
        };

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
        $scope.getSubtypesArray($scope.userSwitchParams);

        vm.getUserSwitches = function(){
            if(vm.token) {
                $scope.loadingUserSwitches = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserSwitches = false;
                    if (res.status === 200) {
                        $scope.userSwitchesList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserSwitches = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getUserSwitches();

        $scope.addUserSwitch = function(userSwitchParams){
            userSwitchParams.tx_type ? userSwitchParams.tx_type = userSwitchParams.tx_type.toLowerCase() : '';
            userSwitchParams.enabled ? userSwitchParams.enabled = userSwitchParams.enabled == 'True' ? true: false : '';
            if(vm.token) {
                $scope.loadingUserSwitches = true;
                $http.post(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/', userSwitchParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.addingUserSwitches = false;
                        toastr.success('Successfully created the user switch!');
                        $scope.userSwitchParams = {
                            tx_type: 'Credit',
                            enabled: 'False',
                            subtype: ''
                        };
                        $scope.getSubtypesArray($scope.userSwitchParams);
                        vm.getUserSwitches();
                    }
                }).catch(function (error) {
                    $scope.userSwitchParams = {
                        tx_type: 'Credit',
                        enabled: 'False',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.userSwitchParams);
                    $scope.loadingUserSwitches = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        $scope.toggleAddUserSwitchesView = function(){
            $scope.addingUserSwitches = !$scope.addingUserSwitches;
        };

        $scope.toggleUserSwitchesEditView = function(userSwitch){
            if(userSwitch) {
                vm.getUserSwitch(userSwitch);
            } else {
                $scope.editUserSwitch.enabled == 'True' ? $scope.editUserSwitch.enabled = true : $scope.editUserSwitch.enabled = false;
                $scope.editUserSwitch = {};
                vm.getUserSwitches();
            }
            $scope.editingUserSwitches = !$scope.editingUserSwitches;
        };

        vm.getUserSwitch = function (userSwitch) {
            $scope.loadingUserSwitches = true;
            $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/' + userSwitch.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingUserSwitches = false;
                if (res.status === 200) {
                    $scope.editUserSwitch = res.data.data;
                    $scope.editUserSwitch.tx_type == 'credit' ? $scope.editUserSwitch.tx_type = 'Credit' : $scope.editUserSwitch.tx_type = 'Debit';
                    $scope.editUserSwitch.enabled == true ? $scope.editUserSwitch.enabled = 'True' : $scope.editUserSwitch.enabled = 'False';
                    $scope.getSubtypesArray($scope.editUserSwitch,'editing');
                }
            }).catch(function (error) {
                $scope.loadingUserSwitches = false;
                errorToasts.evaluateErrors(error.data);
            });
        };

        $scope.userSwitchChanged = function(field){
            vm.updatedUserSwitch[field] = $scope.editUserSwitch[field];
        };

        $scope.updateUserSwitch = function () {

            if(!$scope.editUserSwitch.subtype){
                vm.updatedUserSwitch.subtype = '';
            }

            vm.updatedUserSwitch.tx_type ? vm.updatedUserSwitch.tx_type = vm.updatedUserSwitch.tx_type.toLowerCase() : '';
            vm.updatedUserSwitch.enabled ? vm.updatedUserSwitch.enabled = vm.updatedUserSwitch.enabled == 'True' ? true: false : '';
            if(vm.token) {
                $scope.loadingUserSwitches = true;
                $http.patch(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/' + $scope.editUserSwitch.id + '/', vm.updatedUserSwitch, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserSwitches = false;
                    if (res.status === 200) {
                        $scope.editingUserSwitches = !$scope.editingUserSwitches;
                        vm.updatedUserSwitch = {};
                        toastr.success('Successfully updated the user switch!');
                        vm.getUserSwitches();
                    }
                }).catch(function (error) {
                    vm.updatedUserSwitch = {};
                    $scope.loadingUserSwitches = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        vm.findIndexOfUserSwitches = function (element) {
            return this.id == element.id;
        };

        $scope.openUserSwitchesModal = function (page, size,userSwitches) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserSwitchModalCtrl',
                scope: $scope,
                resolve: {
                    userSwitches: function () {
                        return userSwitches;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(userSwitches){
                if(userSwitches){
                    var index = $scope.userSwitchesList.findIndex(vm.findIndexOfUserSwitches,userSwitches);
                    $scope.userSwitchesList.splice(index, 1);
                    vm.getUserSwitches();
                }
            }, function(){
            });
        };


    }
})();

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.permissions')
        .controller('PermissionsCtrl', PermissionsCtrl);

    /** @ngInject */
    function PermissionsCtrl($scope,$stateParams,environmentConfig,$http,cookieManagement,errorHandler,toastr,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.permissionGroupName = $stateParams.permissionGroupName;
        vm.checkedLevels = [];
        $scope.loadingPermissions = true;
        $scope.typeOptionsObj = {
            ACCOUNT : 'account',
            ACCOUNT_CURRENCY : 'accountcurrency',
            ACCOUNT_CURRENCY_LIMIT : 'accountcurrencylimit',
            ACCOUNT_CURRENCY_TRANSACTION_FEE : 'accountcurrencytransactionfee',
            ACCOUNT_CURRENCY_TRANSACTION_SWITCH : 'accountcurrencytransactionswitch',
            COMPANY : 'company',
            COMPANY_ADDRESS : 'companyaddress',
            COMPANY_BANK_ACCOUNT : 'companybankaccount',
            COMPANY_TRANSACTION_SWITCH : 'companytransactionswitch',
            USER_CRYPTO_ACCOUNT : 'cryptoaccount',
            CURRENCY : 'currency',
            CURRENCY_TIER : 'currencytier',
            CURRENCY_TIER_LIMIT : 'currencytierlimit',
            CURRENCY_TIER_REQUIREMENT : 'currencytierrequirement',
            CURRENCY_TIER_TRANSACTION_FEE : 'currencytiertransactionfee',
            CURRENCY_TIER_TRANSACTION_SWITCH : 'currencytiertransactionswitch',
            DOCUMENT : 'document',
            EMAIL_ADDRESS : 'emailaddress',
            GENERAL_WEBHOOK : 'generalwebhook',
            GLOBAL_SWITCH : 'globalswitch',
            MOBILE : 'mobile',
            NOTIFICATION : 'notification',
            PERMISSION : 'permission',
            COMPANY_PERMISSION_GROUP : 'companypermissiongroup',
            AUTH_TOKEN : 'authtoken',
            TRANSACTION : 'transaction',
            TRANSACTION_SUBTYPE : 'transactionsubtype',
            TRANSACTION_WEBHOOK : 'transactionwebhook',
            USER : 'user',
            USER_ADDRESS : 'useraddress',
            USER_BANK_ACCOUNT : 'userbankaccount',
            USER_TRANSACTION_SWITCH : 'usertransactionswitch'
        };

        $scope.typeOptions = [
                {type:'Account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Account currency',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Account currency limit',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Account currency transaction fee',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Account currency transaction switch',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Company',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Company address',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Company bank account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Company transaction switch',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'User crypto account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Currency',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Currency tier',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Currency tier limit',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Currency tier requirement',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Currency tier transaction fee',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Currency tier transaction switch',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Document',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Email address',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'General webhook',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Global switch',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Mobile',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Notification',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Permission',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Company permission group',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Auth token',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Transaction',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Transaction subtype',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'Transaction webhook',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'User',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'User address',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'User bank account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
                {type:'User transaction switch',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]}
            ];

        vm.getPermissions = function () {
            if(vm.token) {
                $scope.loadingPermissions = true;
                $http.get(environmentConfig.API + '/admin/permission-groups/' + vm.permissionGroupName + '/permissions/?page_size=200', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingPermissions = false;
                    if (res.status === 200) {
                        vm.checkforAllowedPermissions(res.data.data.results);
                    }
                }).catch(function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getPermissions();

        vm.checkforAllowedPermissions = function (permissions) {
            permissions.forEach(function (permission,index) {
                $scope.typeOptions.forEach(function (element,typeOptionsIndex) {
                    if(permission.type.toLowerCase() == element.type.toLowerCase()){
                        element.levels.forEach(function (level,levelIndex) {
                            if(permission.level == level.name){
                                $scope.typeOptions[typeOptionsIndex].levels[levelIndex].enabled = true;
                                $scope.typeOptions[typeOptionsIndex].levels[levelIndex].id = permissions[index].id;
                            }
                        })
                    }
                })
            });
        };

        $scope.trackPermissions = function (typeOption,level) {

            //using id as a flag to see whether they have come from the backend or not

            var findIndexOfLevel = function () {
                var index;
                if(vm.checkedLevels.length == 0){
                    return -1;
                }

                index = vm.checkedLevels.findIndex(function (element) {
                    return (element.type == typeOption.type && element.level == level.name)
                });

                return index;
            };

            //level.enabled && level.id means they were ticked from before

            if(level.enabled && level.id){
                var index = findIndexOfLevel();
                if(index > -1){
                    vm.checkedLevels.splice(index,1);
                    return
                } else {
                    vm.checkedLevels.push({type: typeOption.type,level: level.name,id: level.id});
                    return
                }
            } else if(!level.enabled && level.id){
                var index = findIndexOfLevel();
                if(index > -1){
                    vm.checkedLevels.splice(index,1);
                    return
                } else {
                    vm.checkedLevels.push({type: typeOption.type,level: level.name,id: level.id});
                    return
                }
            }

            //only level.enabled means they were ticked from before

            if(level.enabled){
                vm.checkedLevels.push({type: typeOption.type,level: level.name});
            } else {
                var index = findIndexOfLevel();
                vm.checkedLevels.splice(index,1);
            }
        };

        $scope.savePermissionsProcess = function(){

            vm.checkedLevels.forEach(function(element,idx,array){
                var type;
                type = element.type.toUpperCase();
                type = type.replace(/ /g, '_');
                if(idx === array.length - 1){
                    if(element.id){
                        vm.deletePermission(element,'last')
                    } else {
                        vm.addPermissions({type: $scope.typeOptionsObj[type],level: element.level},'last');
                    }

                    return false;
                }

                if(element.id){
                    vm.deletePermission(element)
                } else {
                    vm.addPermissions({type: $scope.typeOptionsObj[type],level: element.level});
                }

            });
        };

        vm.addPermissions = function (newPermissionObj,last) {
            if(vm.token) {
                $scope.loadingPermissions = true;
                $http.post(environmentConfig.API + '/admin/permission-groups/' + vm.permissionGroupName + '/permissions/', newPermissionObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        if(last){
                            vm.resetTypeOptions();
                        }
                    }
                }).catch(function (error) {
                    vm.checkedLevels = [];
                    $scope.permissionParams = {
                        type: 'Account'
                    };
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.deletePermission = function (permission,last) {
            if(vm.token) {
                $scope.deletingPermission = true;
                $http.delete(environmentConfig.API + '/admin/permission-groups/' + vm.permissionGroupName + '/permissions/' + permission.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(last){
                            vm.resetTypeOptions();
                        }
                    }
                }).catch(function (error) {
                    $scope.deletingPermission = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.resetTypeOptions = function () {
            $scope.typeOptions.forEach(function (element,idx,array) {
                if(idx === array.length - 1){
                    element.levels = [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}];
                    vm.finishSavingPermissionsProcess();
                    return false;
                }

                element.levels = [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}];
            });
        };

        vm.finishSavingPermissionsProcess = function () {
            $scope.loadingPermissions = false;
            vm.checkedLevels = [];
            toastr.success('Permissions successfully saved');
            vm.getPermissions();
        };


    }
})();

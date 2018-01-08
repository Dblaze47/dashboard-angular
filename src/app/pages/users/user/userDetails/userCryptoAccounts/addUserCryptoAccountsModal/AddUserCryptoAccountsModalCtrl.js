(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserCryptoAccountsModalCtrl', AddUserCryptoAccountsModalCtrl);

    function AddUserCryptoAccountsModalCtrl($scope,$uibModalInstance,toastr,$stateParams,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userCryptoAccountParams = {
            crypto_type: 'Bitcoin',
            user: vm.uuid,
            address: '',
            metadata: '',
            status: 'Pending'
        };
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.addUserCryptoAccount = function(userCryptoAccountParams){
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                userCryptoAccountParams.crypto_type = userCryptoAccountParams.crypto_type.toLowerCase();
                userCryptoAccountParams.status = userCryptoAccountParams.status.toLowerCase();
                $http.post(environmentConfig.API + '/admin/users/crypto-accounts/',userCryptoAccountParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        toastr.success('Crypto account successfully added');
                        $scope.userCryptoAccountParams = {
                            crypto_type: 'Bitcoin',
                            user: vm.uuid,
                            address: '',
                            metadata: '',
                            status: 'Pending'
                        };
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
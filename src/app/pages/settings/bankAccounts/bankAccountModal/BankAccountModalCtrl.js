(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('BankAccountModalCtrl', BankAccountModalCtrl);

    function BankAccountModalCtrl($scope,$uibModalInstance,bankAccount,toastr,$http,environmentConfig,cookieManagement,errorToasts) {

        var vm= this;

        $scope.bankAccount = bankAccount;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.deletingBankAccount = false;


        $scope.deleteBankAccount = function () {
            $scope.deletingBankAccount = true;
            $http.delete(environmentConfig.API + '/admin/bank-accounts/' + $scope.bankAccount.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingBankAccount = false;
                if (res.status === 200) {
                    toastr.success('Bank account successfully deleted');
                    $uibModalInstance.close($scope.bankAccount);
                }
            }).catch(function (error) {
                $scope.deletingBankAccount = false;
                errorToasts.evaluateErrors(error.data);
            });
        };



    }
})();

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencyFees')
        .controller('AccountCurrencyFeesModalCtrl', AccountCurrencyFeesModalCtrl);

    function AccountCurrencyFeesModalCtrl($scope,$uibModalInstance,accountCurrencyFee,currencyCode,reference,toastr,$http,environmentConfig,cookieManagement,errorToasts) {

        var vm = this;
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        $scope.accountCurrencyFee = accountCurrencyFee;
        $scope.deletingAccountCurrencyFees = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteAccountCurrencyFee = function () {
            $scope.deletingAccountCurrencyFees = true;
            $http.delete(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/' + $scope.accountCurrencyFee.id +'/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingAccountCurrencyFees = false;
                if (res.status === 200) {
                    toastr.success('Account currency fee successfully deleted');
                    $uibModalInstance.close($scope.accountCurrencyFee);
                }
            }).catch(function (error) {
                $scope.deletingAccountCurrencyFees = false;
                errorToasts.evaluateErrors(error.data);
            });
        };



    }
})();

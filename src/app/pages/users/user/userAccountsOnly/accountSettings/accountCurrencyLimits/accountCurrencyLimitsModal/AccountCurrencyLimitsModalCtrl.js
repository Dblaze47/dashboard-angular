(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('AccountCurrencyLimitsModalCtrl', AccountCurrencyLimitsModalCtrl);

    function AccountCurrencyLimitsModalCtrl($scope,$uibModalInstance,accountCurrencyLimit,currencyCode,reference,toastr,$http,
                                            environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        $scope.accountCurrencyLimit = accountCurrencyLimit;
        $scope.deletingAccountCurrencyLimits = false;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.deleteAccountCurrencyLimit = function () {
            $scope.deletingAccountCurrencyLimits = true;
            $http.delete(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/' + $scope.accountCurrencyLimit.id +'/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingAccountCurrencyLimits = false;
                if (res.status === 200) {
                    toastr.success('Account currency limit successfully deleted');
                    $uibModalInstance.close($scope.accountCurrencyLimit);
                }
            }).catch(function (error) {
                $scope.deletingAccountCurrencyLimits = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();

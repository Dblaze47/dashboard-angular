(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencySwitches')
        .controller('AccountCurrencySwitchesModalCtrl', AccountCurrencySwitchesModalCtrl);

    function AccountCurrencySwitchesModalCtrl($scope,$uibModalInstance,accountCurrencySwitch,currencyCode,reference,toastr,$http,environmentConfig,cookieManagement,errorToasts) {

        var vm = this;
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        $scope.accountCurrencySwitch = accountCurrencySwitch;
        $scope.deletingAccountCurrencySwitches = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteAccountCurrencySwitch = function () {
            $scope.deletingAccountCurrencySwitches = true;
            $http.delete(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/switches/' + $scope.accountCurrencySwitch.id +'/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingAccountCurrencySwitches = false;
                if (res.status === 200) {
                    toastr.success('Account currency switch successfully deleted');
                    $uibModalInstance.close($scope.accountCurrencySwitch);
                }
            }).catch(function (error) {
                $scope.deletingAccountCurrencySwitches = false;
                errorToasts.evaluateErrors(error.data);
            });
        };



    }
})();

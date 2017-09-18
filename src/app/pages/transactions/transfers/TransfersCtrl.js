(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.transfers')
        .controller('TransfersCtrl', TransfersCtrl);

    /** @ngInject */
    function TransfersCtrl($rootScope,$scope,typeaheadService,$http,environmentConfig,cookieManagement,toastr,errorHandler,currencyModifiers) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.transferData = {
            user: null,
            amount: null,
            recipient: "",
            currency: null
        };

        $scope.getUsersTypeahead = typeaheadService.getUsersTypeahead();

        $scope.onGoingTransaction = false;
        $scope.showView = 'createTransfer';

        $rootScope.$watch('selectedCurrency',function(){
            if($rootScope.selectedCurrency && $rootScope.selectedCurrency.code){
                $scope.transferData.currency = $rootScope.selectedCurrency.code;
            }
        });

        $scope.goToView = function(view){
            if($scope.transferData.amount){
                var validAmount = currencyModifiers.validateCurrency($scope.transferData.amount,$rootScope.selectedCurrency.divisibility);
                if(validAmount){
                    $scope.showView = view;
                } else {
                    toastr.error('Please input amount to ' + $rootScope.selectedCurrency.divisibility + ' decimal places');
                }
            } else{
                $scope.showView = view;
            }
        };

        $scope.toggleTransferView = function() {
            $scope.transferData = {
                user: null,
                amount: null,
                recipient: null,
                currency: $rootScope.selectedCurrency.code
            };

            $scope.goToView('createTransfer');
        };

        $scope.createTransfer = function () {

            var sendTransactionData = {
                user: $scope.transferData.user,
                amount: currencyModifiers.convertToCents($scope.transferData.amount,$rootScope.selectedCurrency.divisibility),
                recipient: $scope.transferData.recipient,
                currency: $scope.transferData.currency
            };

            $scope.onGoingTransaction = true;
            $http.post(environmentConfig.API + '/admin/transactions/transfer/',sendTransactionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.onGoingTransaction = false;
                if (res.status === 201) {
                    toastr.success('You have successfully transferred the money!');
                    $scope.goToView('completeTransfer');
                }
            }).catch(function (error) {
                $scope.onGoingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }

    }
})();

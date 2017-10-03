(function () {
    'use strict';

    angular.module('BlurAdmin.pages.home')
        .controller('CurrenciesCtrl', CurrenciesCtrl);

    /** @ngInject */
    function CurrenciesCtrl($rootScope,$scope,$location,cookieManagement,environmentConfig,$http,errorHandler,$window,_) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingCurrencies = true;

        vm.getCompanyCurrencies = function(){
            if(vm.token) {
              $scope.loadingCurrencies = true;
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencies = res.data.data.results;
                        $scope.currencies.forEach(function(element,idx,array){
                            if(idx === array.length - 1){
                                vm.getCurrencyOverview(element,'last');
                                return false;
                            }
                            vm.getCurrencyOverview(element);
                        })
                    }
                }).catch(function (error) {
                  $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.getCurrencyOverview = function (currency,last) {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                $http.get(environmentConfig.API + '/admin/currencies/' + currency.code + '/overview/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencies.forEach(function (element,index) {
                            if(element.code == currency.code){
                                _.extendOwn(element,res.data.data);
                            }
                        });
                        if(last){
                            $scope.loadingCurrencies = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToView = function(path){
            $location.path(path);
        };

        $scope.goToAddCurrency = function(){
            $location.path('/currency/add');
        }
    }
})();

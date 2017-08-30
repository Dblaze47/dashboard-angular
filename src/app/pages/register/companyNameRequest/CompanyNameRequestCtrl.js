(function () {
    'use strict';

    angular.module('BlurAdmin.pages.companyNameRequest')
        .controller('CompanyNameRequestCtrl', CompanyNameRequestCtrl);

    /** @ngInject */
    function CompanyNameRequestCtrl($rootScope,$scope,$http,toastr,cookieManagement,
                                    errorHandler,environmentConfig,$location,errorToasts,userVerification) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.$pageFinishedLoading = false;
        $scope.company = {
            name: ''
        };

        vm.getCompanyInfo = function () {
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data && res.data.data.name){
                            $rootScope.haveCompanyName = true;
                            $rootScope.companyName = res.data.data.name;
                            userVerification.verify(function(err,verified){
                                if(verified){
                                    $rootScope.userVerified = true;
                                    $location.path('currency/add/initial');
                                } else {
                                    $location.path('/verification');
                                    toastr.error('Please verify your account','Message');
                                    $rootScope.$pageFinishedLoading = true;
                                }
                            });
                        } else {
                            $rootScope.$pageFinishedLoading = true;
                        }
                    }
                }).catch(function (error) {
                    $rootScope.$pageFinishedLoading = true;
                    if(error.status == 403){
                        errorHandler.handle403();
                        return
                    }
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getCompanyInfo();

        $scope.updateCompanyInfo = function () {
            $rootScope.$pageFinishedLoading = false;
            $http.patch(environmentConfig.API + '/admin/company/',{name: $scope.company.name}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $rootScope.haveCompanyName = true;
                    $rootScope.companyName = res.data.data.name;
                    userVerification.verify(function(err,verified){
                        if(verified){
                            $rootScope.userVerified = true;
                            toastr.success('You have successfully updated the company info!');
                            $location.path('currency/add/initial');
                        } else {
                            $location.path('/verification');
                            toastr.error('Please verify your account','Message');
                            $rootScope.$pageFinishedLoading = true;
                        }
                    });
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                if(error.status == 403){
                    errorHandler.handle403();
                    return
                }
                errorToasts.evaluateErrors(error.data);
            });
        };

    }
})();

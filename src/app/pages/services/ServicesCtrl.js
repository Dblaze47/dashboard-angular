(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services')
        .controller('ServicesCtrl', ServicesCtrl);

    /** @ngInject */
    function ServicesCtrl($scope,$location,$http,environmentConfig,errorToasts,cookieManagement) {

        $scope.defaultImageUrl = "https://clariturehealth.com/wp-content/uploads/2016/09/Hexagon-Gray.png";

        $scope.loadingServices = true;

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.getServices = function(){
          $scope.loadingServices = true;
            $http.get(environmentConfig.API + '/admin/services/?active=true', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
              $scope.loadingServices = false;
                if (res.status === 200) {
                  $scope.servicesList =  res.data.data.results;
                }
            }).catch(function (error) {
              $scope.loadingServices = false;
                errorToasts.evaluateErrors(error.data);
            });
        };
        $scope.getServices();

        $scope.addService = function(){
            $location.path('/services/add');
        };

        $scope.goToService = function(service) {
          cookieManagement.setCookie('SERVICEURL',service.url);
          var serviceNameArray = service.name.split(' ');
          var pathName = serviceNameArray[0].toLowerCase();
          $location.path('/services/' + pathName);
        }
    }
})();

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.products')
        .directive('productsColumnFilters', productsColumnFilters);

    /** @ngInject */
    function productsColumnFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productsService/products/productsColumnFilters/productsColumnFilters.html'
        };
    }
})();
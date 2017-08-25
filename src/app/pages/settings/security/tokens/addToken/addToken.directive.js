(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.security')
        .directive('addTokenView', addTokenView);

    /** @ngInject */
    function addTokenView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/settings/security/tokens/addToken/addToken.html'
        };
    }
})();

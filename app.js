(function (angular) {
    'use strict';

    var app = angular.module('grimoire', [
        //'ngRoute',
        'ui.bootstrap',
        'ui.slimscroll',
        'zeroclipboard',
        'grimoire.controller',
        ]);

    app.config(['uiZeroclipConfigProvider', function(uiZeroclipConfigProvider) {
        uiZeroclipConfigProvider.setZcConf({
        swfPath: 'bower_components/zeroclipboard/dist/ZeroClipboard.swf'
        });
    }]);

/*
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/grimoire', {
            templateUrl: 'grimoire.html',
            controller: 'grimoireController',
            controllerAs: 'grimoire',
        }).otherwise({
            redirectTo: '/grimoire'
        });
    }]).config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
*/

}(window.angular));
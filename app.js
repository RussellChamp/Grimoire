(function (angular) {
    'use strict';

    var app = angular.module('grimoire', [
        'ngRoute',
        'grimoire.controller',
        ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/grimoire', {
            templateUrl: 'grimoire.html',
            controller: 'grimoireController',
            controllerAs: 'grimoire',
        }).otherwise({
            redirectTo: '/grimoire'
        });
    }]);

}(window.angular));
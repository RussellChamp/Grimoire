(function (angular) {
    'use strict';

    angular.module('grimoire.controller', ['ui.bootstrap']);

    function GrimoireController() {
        /*jshint validthis: true */
        this.welcome = 'Welcome to the Grimoire App!';
        console.log("LOADED CONTROLLER");
    }

    angular
        .module('grimoire.controller')
        .controller('GrimoireController', [GrimoireController]);

}(window.angular));
(function (angular) {
    'use strict';

    angular.module('grimoire.controller', ['ui.bootstrap']);

    function GrimoireController() {
        /*jshint validthis: true */
        this.welcome = 'Welcome to the Grimoire App!';
        this.sources = [
        {
            'name': 'Core Rule Book',
            'sources': ['Armor', 'Weapons', 'Wondrous Items'],
        },
        {
            'name': 'Advanced Player\'s Guide',
            'sources': ['Armor', 'Weapons', 'Wondrous Items'],
        },
        {
            'name': 'Core Rule Book',
            'sources': ['Armor', 'Weapons', 'Wondrous Items'],
        },
        {
            'name': 'Advanced Player\'s Guide',
            'sources': ['Armor', 'Weapons', 'Wondrous Items'],
        },
        {
            'name': 'Core Rule Book',
            'sources': ['Armor', 'Weapons', 'Wondrous Items'],
        },
        {
            'name': 'Advanced Player\'s Guide',
            'sources': ['Armor', 'Weapons', 'Wondrous Items'],
        },
        ];
        this.itemLists = [
        {
            'timestamp': new Date() - 100000,
            'items': [
            {
                'name': '+2 super cool sword',
                'worth': 5000,
                'url': 'http://www.google.com'
            },
            {
                'name': 'nifty hat',
                'worth': 2000,
                'url': ''
            }
            ],
        },
        {
            'timestamp': new Date(),
            'items': [
            {
                'name': '+3 super cool sword',
                'worth': 5000,
                'url': 'http://www.google.com'
            },
            {
                'name': 'nifty boots',
                'worth': 2000,
                'url': ''
            }
            ],
        }];

        this.copyToClipboard = function(list) {
            console.log(list);
        }
    }

    angular
        .module('grimoire.controller')
        .controller('GrimoireController', [GrimoireController]);

}(window.angular));
/*global _:false */
/*global Grimoire:false, Weapons:false, Potions:false, Rings:false, Scrolls:false, Wands:false, Rods:false, Staves:false, WondrousItems:false, Intelligence:false*/
/*jshint forin: false */
(function (angular) {
    'use strict';

    angular.module('grimoire.controller', ['ui.bootstrap']);

    function GrimoireController() {
        /*jshint validthis: true */
        var self = this;
        this.welcome = 'Welcome to the Grimoire App!';
        this.itemCount = [1,1,1];

        this.sources = [
        {
            'name': 'Core Rule Book',
            'shortName': 'CRB',
            'sources': ['Armors and Shields', 'Weapons', 'Potions', 'Rings', 'Rods', 'Scrolls', 'Staves', 'Wands', 'Wondrous Items'],
            'selected': true,
        },
        {
            'name': 'Advanced Player\'s Guide',
            'shortName': 'APG',
            'sources': ['Wondrous Items'],
            'selected': true,
        },
        ];
        this.selected = false;
        this.checkSource = function(source) {
            if(source.selected === true) {
                //uncheck the radio button
                self.radio = false;
            }
        };
        this.radio = 0;
        this.checkRadio = function() {
            //uncheck all the source checkboxes
            for( var idx in self.sources) {
                var source = self.sources[idx];
                source.selected = false;
            }
        };

        this.itemLists = [];

        this.copyToClipboard = function(list) {
            var text = "~~" + new Date(list.timestamp).toJSON() + "~~<br>";
            for(var idx in list.items) {
                text += "* " + list.items[idx].name + "," + list.items[idx].cost + "," + list.items[idx].url + "\n";
            }
            text += "----\n" + list.items.notes;

            return text;
        };

        this.generateItem = function(type, quality, source) {
            var item;
            switch(type) { //the radio selected type
                case "Armors and Shields": item = Grimoire.getArmorOrShield(quality); break;
                case "Weapons": item = Weapons.getWeapon(quality); break;
                case "Potions": item = Potions.getPotion(quality); break;
                case "Rings": item = Rings.getRing(quality); break;
                case "Scrolls": item = Scrolls.getScroll(quality); break;
                case "Wands": item = Wands.getWand(quality); break;
                case "Wondrous Items": item = WondrousItems.getItem(quality, source); break;
                case "Rods": item = Rods.getRod(quality); break;
                case "Staves": item = Staves.getStaff(quality); break;
            }
            if(item === undefined) {
                item = {
                    'name': "ERROR in generating " + String(quality) + " " + String(type),
                };
            }
            return item;
        };

        this.generateItems = function() {
            var itemList = {};
            itemList.items = [];

            if(self.radio) {
                //console.log("Generating item from " + self.radio);
                var source = self.radio.split("|");
                var types = ["minor", "medium", "major"];
                for(var idx in types) { //for each item level
                    for(var i = 0; i < self.itemCount[idx]; i++) {
                        itemList.items.push(self.generateItem(source[1], types[idx]));
                        }
                    }
                }
            else {
                var ss = "";
                for( var idx in self.sources) {
                    var source = self.sources[idx];
                    if(source.selected) {
                        ss += source.shortName + " ";
                    }
                }
                if(ss) {
                    //console.log("Generating items from " + ss);
                    itemList.items = Grimoire.getItems(self.itemCount[0], self.itemCount[1], self.itemCount[2]);
                }
                else {
                    console.log("Error: No sources selected");
                }
            }
            itemList.timestamp = new Date();
            self.addItemList(itemList);
        };

        this.generateIntelligence = function(cost) {
            var list = {};
            var stats = Intelligence.getItemIntelligence(cost).print().split(";");
            list.notes = "";
            for(var s in stats) {
                var stat = stats[s].split(":");
                //list.notes += "<strong>" + stat[0] + ":</strong> " + stat[1] + "<br>";
                list.notes += stat[0] + ": " + stat[1] + "\n";
            }

            list.timestamp = new Date();
            self.itemLists.push(list);
        };

        this.addItemList = function(list) {
            self.itemLists.push(list);
            self.scrollItemsBottom();
        };

        this.scrollItemsBottom = function() {
            //BAD BAD ANGULAR FORM!
            //The slimscroll item didn't allow for a way to bind to an object
            //I'm not sure how to do this correctly
            $('#itemScroll').slimScroll({ scrollBy: 99999}); //just all the way
            //I couldn't get {start: 'bottom'} to work right
        };

    }

    angular
        .module('grimoire.controller')
        .controller('GrimoireController', [GrimoireController]);

}(window.angular));
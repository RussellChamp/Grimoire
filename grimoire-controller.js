/*global _:false */
/*global Grimoire:false, Weapons:false, Potions:false, Rings:false, Scrolls:false, Wands:false, Rods:false, Staves:false, WondrousItems:false, Intelligence:false, Spells:false*/
/*jshint forin: false */
(function (angular) {
    'use strict';

    angular.module('grimoire.controller', ['ui.bootstrap']);

    function GrimoireController() {
        /*jshint validthis: true */
        var self = this;
        this.welcome = 'Welcome to the Grimoire App!';
        this.itemCount = [1,1,1];
        this.spellLevel = 0;
        this.spellType = "arcane";
        this.casterLevel = 1;
        this.baseCost = 1000;

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
            setTimeout(function() { self.scrollItemsBottom(); }, 200);
            //otherwise the scroll will get ahead of the add
        };

        this.scrollItemsBottom = function() {
            //BAD BAD ANGULAR FORM!
            //The slimscroll item didn't allow for a way to bind to an object
            //I'm not sure how to do this correctly
            //$('#itemScroll').slimScroll({ scrollBy: 99999}); //just all the way
            //I couldn't get {start: 'bottom'} to work right
            //$('#itemScroll').slimScroll({ start: 'bottom'});
            var height = $('#itemScroll').prop('scrollHeight') + 'px';
            $('#itemScroll').slimScroll({ scrollTo: height});
        };

        this.getValue = function(list) {
            var sum = 0;
            _.forEach(list, function(item) { sum += item.cost;});
            return sum;
        };

        this.getDeity = function() {
            self.itemLists.push({
                timestamp: new Date(),
                items: [
                {
                    name: "Deity: " + Grimoire.getDeity()
                }
                ],
            });
        };

        this.getEnergyType = function() {
            self.itemLists.push({
                timestamp: new Date(),
                items: [
                {
                    name: "Energy Type: " + Grimoire.getEnergyResistance()
                }
                ],
            });
        };

        this.getSpell = function(type, level) {
            //console.log(String(type) + " " + String(level));
            if(type && level > -1) {
                var itemList = {};
                itemList.spells = [];
                itemList.spells.push(Spells.getLevelSpell(level, type));
                itemList.timestamp = new Date();
                console.log(itemList);
                self.itemLists.push(itemList);
            }
        };

        this.generateSpellbook = function(casterLevel) {
            if(casterLevel) {
                casterLevel = _.min([casterLevel, 20]);
                var itemList = {};
                itemList.spells = [];
                //there's really no precident for this.
                //I'm just going to assume Wizard only.
                //Assume ALL cantrips
                //Wizards know 3 + Int level 1 spells at level 1
                //Ever level, a wizard adds two new spells to his book
                //The minimum CL for a spell is (spell * 2 - 1)
                //We will just take a shot and say the following
                //Level 1 spells: 3 + 1/2 CL
                //Level 2 spells: 
                var slvl = [2,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
                //console.log("At Caster Level " + String(casterLevel) + " you get:");
                for(var spellLevel = 1; spellLevel <= 9; spellLevel++) {
                    var numSpells = 0;
                    if(casterLevel >= spellLevel * 2 - 1) { //minimum requirement
                        numSpells = slvl[casterLevel - (spellLevel*2-1)];
                        if(spellLevel === 1) {
                            numSpells += 4; //since you start with 3 + Int first level spells
                        }
                        //console.log(String(numSpells) + " level " + String(spellLevel) + " spells");
                        for(var i = 0; i < numSpells; i++) {
                            var newSpell = {};
                            do {
                                newSpell = Spells.getLevelSpell(spellLevel, 'arcane');
                            } while(itemList.spells.indexOf(newSpell) !== -1); //duplicate
                            itemList.spells.push(newSpell);
                        }
                    }
                    else
                        break; //no point checking the higher levels
                }

                itemList.timestamp = new Date();
                self.itemLists.push(itemList);
            }
        };

    }

    angular
        .module('grimoire.controller')
        .controller('GrimoireController', [GrimoireController]);

}(window.angular));
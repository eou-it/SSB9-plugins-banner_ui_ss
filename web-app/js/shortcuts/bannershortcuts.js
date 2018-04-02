/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

(function () {
    'use strict';
    var listOfBannerShortcuts = [];
    angular.module('keyboardshortcut', ['cfp.hotkeys', 'xe-ui-components'])
        .config(function (hotkeysProvider) {
            /*hotkeysProvider.includeCheatSheet = true;
             hotkeysProvider.cheatSheetHotkey = "ctrl+2";*/
            //var listOfBannerShortcuts = [];
        })

        //service
        // add method which will internally call hotkeys.add method
        .service('keyshortcut', ['hotkeys', function (hotkeys) {
            this.shortcutObj = function (combination, description, callback) {
                let shortcut = {};
                //  combination = this.symbolize(combination);
                if (combination.indexOf('+') >= 0) {
                    var addSplCombination = this.addingSpecial(combination);
                    combination = addSplCombination.split('+');
                } else {
                    var specialKeys = this.symbolize(combination);
                    var newArr = this.createArray(specialKeys);
                    combination = newArr;
                }
                shortcut.combo = combination;
                shortcut.description = description;
                shortcut.callback = callback;
                return shortcut;
            };

            this.createArray = function (combo) {
                var arr = [];
                arr.push(combo);
                return arr;
            };

            this.map = {
                command: '\u2318',     // ?
                /*shift     : '\u21E7',*/     // ?
                left: '\u2190',     // ?
                right: '\u2192',     // ?
                up: '\u2191',     // ?
                down: '\u2193',     // ?
                'return': '\u23CE',
                pgUp: 'pgUp',// ?
                backspace: '\u232B'      // ?
            };

            this.symbolize = function (combo) {
                if (combo.split('+') >= 0) {
                    for (var i = 0; i < combo.length; i++) {
                        combo[i] = this.map[combo[i]] || combo[i];
                    }
                    return combo.join(' + ');
                } else if (combo.split('/').length > 1) {
                    var testcombo = combo.split('/');
                    for (var i = 0; i < testcombo.length; i++) {
                        testcombo[i] = this.map[testcombo[i]] || testcombo[i];
                    }
                    return testcombo.join('/');
                } else {
                    combo = this.map[combo] || combo;
                    return combo;
                }
            };

            this.addingSpecial = function (combo) {
                combo = combo.split('+');

                for (var i = 0; i < combo.length; i++) {
                    combo[i] = this.map[combo[i]] || combo[i];
                }
                return combo.join(' + ');
            };

            /*this.addToHotkeys = function (combo, description, callback) {
             this.addToList(combo, description, callback);
             };*/

            this.addBannerShortcut = function (sectionHeading, shortcutList) {
                let bannerObj = {};
                bannerObj.sectionHeading = sectionHeading;
                bannerObj.shortcutList = shortcutList;

                var sectionHeadList = listOfBannerShortcuts.map(function (listOfBannerShortcut, index, array) {
                    return listOfBannerShortcut.sectionHeading;
                });
                let index = sectionHeadList.indexOf(sectionHeading);
                if (index < 0) {
                    listOfBannerShortcuts.unshift(bannerObj);
                } else {
                    listOfBannerShortcuts[index].shortcutList = listOfBannerShortcuts[index].shortcutList.concat(shortcutList);
                }

            };

            this.addSectionShortcuts = function (sectionHeading, shortcutList) {
                for (let i = 0; i < shortcutList.length - 1; i++) {
                    this.addToList(shortcutList[i].combo.toString(), shortcutList[i].description, shortcutList[i].callback);
                }
                this.addBannerShortcut(sectionHeading, shortcutList);
            };

            this.getBannerShortcutList = function () {
                return listOfBannerShortcuts;
            };


            /*this.getList = function () {
             return hotkeys.listOfitems;
             };*/

            this.isMac = function () {
                var isMac = false;
                if (window.navigator.platform.indexOf('Mac') >= 0) {
                    isMac = true;
                } else {
                    isMac = false;
                }
                return isMac;
            };

            this.addToList = function (combo, description, callback) {
                if (callback) {
                    hotkeys.add({
                        combo: combo,
                        description: description,
                        callback: callback
                    });

                } else {
                    hotkeys.add({
                        combo: combo,
                        description: description
                    });
                }
            };
        }])
        .controller('shortcutModal', ['$scope', 'keyshortcut', '$http', '$document', function ($scope, keyshortcut, $http, $document) {

            function populateEntireDialog(objToIterate, keyshortcutService) {
                Object.keys(objToIterate).forEach(function (key, index) {
                    var shortcutList = objToIterate[key];
                    var tempList = [];
                    for (let i = 0; i < shortcutList.length; i++) {
                        var temp1 = keyshortcutService.shortcutObj(shortcutList[i].combination, shortcutList[i].description);
                        tempList.push(temp1);
                    }
                    keyshortcutService.addSectionShortcuts(key, tempList);
                });
            }

            $document.bind('keydown', function (event) {
                if (event.ctrlKey && event.shiftKey && event.keyCode === 191) {
                    $scope.toggleshortcut();
                    $scope.$apply();
                    event.preventDefault();
                    return false;
                }
                /*else{
                 return true;
                 }*/
            });


            //for printing the overlay
            $scope.printdiv = function (printpage) {
                var headstr = "<html><head><title></title></head><body>";
                var footstr = "</body>";
                var newstr = document.all.item(printpage).innerHTML;
                var oldstr = document.body.innerHTML;
                var myWindow = window.open('', 'printpage');
                myWindow.document.write(headstr + newstr + footstr);
                window.print();
                document.body.innerHTML = oldstr;
                return false;
            };

            $scope.banner_shortcut_0 = true;

            $scope.showDescription = function (event) {
                var displayBlock = angular.element(event.target).closest('div');
                var descBlock = angular.element(displayBlock).find('div.banner-shortcut').attr('id');
                $scope[descBlock] = !$scope[descBlock];
            };

            $scope.toggleshortcut = function () {
                $scope.modalShown = !$scope.modalShown;
                var listExists = keyshortcut.getBannerShortcutList();
                if (listExists.length === 0) {
                    $http({
                        method: "GET",
                        url: "shortcut/data"
                    }).then(function mySuccess(response) {
                        $scope.messageList = response.data;
                        if (keyshortcut.isMac()) {
                            //MAC
                            $scope.macMessageList = $scope.messageList.mac;
                            populateEntireDialog($scope.macMessageList, keyshortcut)

                        } else {
                            //Windows
                            $scope.windowsMessageList = $scope.messageList.windows;
                            populateEntireDialog($scope.windowsMessageList, keyshortcut)
                        }
                        $scope.shortcutObj = keyshortcut.getBannerShortcutList();
                    }, function myError(response) {
                        console.log("Error Occurred reading message keys from message.properties file");
                    });
                }
            };

        }]);
})();
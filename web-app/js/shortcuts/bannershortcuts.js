/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

(function () {
    'use strict';
    var listOfBannerShortcuts = [];
    angular.module('keyboardshortcut', ['bannerBindkeys', 'xe-ui-components'])
        //service
        .service('keyshortcut', ['hotkeys', function (hotkeys) {
            this.shortcutObj = function (combination, description, callback,bindingScope) {
                let shortcut = {};
                if (combination.indexOf('+') >= 0) {
                    let addSplCombination = this.addingSpecial(combination);
                    combination = addSplCombination.split('+');
                } else {
                    let specialKeys = this.symbolize(combination);
                    let newArr = this.createArray(specialKeys);
                    combination = newArr;
                }
                shortcut.combo = combination;
                shortcut.description = description;
                shortcut.callback = callback;
                shortcut.scopeToBind=bindingScope;
                return shortcut;
            };

            this.createArray = function (combo) {
                let arr = [];
                arr.push(combo);
                return arr;
            };

            this.map = {
                command: '\u2318',     // ?
                left: '\u2190',     // ?
                right: '\u2192',     // ?
                up: '\u2191',     // ?
                down: '\u2193',     // ?
                'return': '\u23CE',
                backspace: '\u232B'      // ?
            };

            this.symbolize = function (combo) {
                if (combo.split('+') >= 0) {
                    for (let i = 0; i < combo.length; i++) {
                        combo[i] = this.map[combo[i]] || combo[i];
                    }
                    return combo.join(' + ');
                } else if (combo.split('/').length > 1) {
                    let testcombo = combo.split('/');
                    for (let i = 0; i < testcombo.length; i++) {
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

                for (let i = 0; i < combo.length; i++) {
                    combo[i] = this.map[combo[i]] || combo[i];
                }
                return combo.join(' + ');
            };

            this.addBannerShortcut = function (sectionHeading, shortcutList) {
                let bannerObj = {};
                bannerObj.sectionHeading = sectionHeading;
                bannerObj.shortcutList = shortcutList;

                var sectionHeadList = listOfBannerShortcuts.map(function (listOfBannerShortcut, index, array) {
                    return listOfBannerShortcut.sectionHeading;
                });
                let index = sectionHeadList.indexOf(sectionHeading);
                if (index < 0) {
                    listOfBannerShortcuts.push(bannerObj);
                } else {
                    listOfBannerShortcuts[index].shortcutList = listOfBannerShortcuts[index].shortcutList.concat(shortcutList);
                }

            };

            this.addSectionShortcuts = function (sectionHeading, shortcutList) {
                for (let i = 0; i < shortcutList.length - 1; i++) {
                    this.addToList(shortcutList[i].combo.toString(), shortcutList[i].description, shortcutList[i].callback,shortcutList[i].scopeToBind);
                }
                this.addBannerShortcut(sectionHeading, shortcutList);
            };

            this.getBannerShortcutList = function () {
                return listOfBannerShortcuts;
            };

            this.addToHotkeys = function (combo, description, callback,passingScope) {
                this.addToList(combo, description, callback,passingScope);
            };


            this.isMac = function () {
                var isMac = false;
                if (window.navigator.platform.indexOf('Mac') >= 0) {
                    isMac = true;
                }
                return isMac;
            };

            this.addToList = function (combo, description, callback,scopeToBind) {
                if (callback) {
                    if (!scopeToBind) {
                        hotkeys.add({
                            combo: combo,
                            description: description,
                            callback: callback
                        });
                    } else {
                        hotkeys.bindTo(scopeToBind).add({
                            combo: combo,
                            description: description,
                            callback: callback
                        })
                    }
                } else {
                    hotkeys.add({
                        combo: combo,
                        description: description
                    });
                }
            };
        }])
        .controller('shortcutModal', ['$scope', 'keyshortcut', '$http', '$document', '$timeout', function ($scope, keyshortcut, $http, $document, $timeout) {

            function populateEntireDialog(objToIterate, keyshortcutService) {

                Object.keys(objToIterate).sort().forEach(function (key, index) {
                    var shortcutList = objToIterate[key];
                    var tempList = [];
                    for (let i = 0; i < shortcutList.length; i++) {
                        let temp1 = keyshortcutService.shortcutObj(shortcutList[i].combination, shortcutList[i].description);
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
                    event.stopPropagation();
                    return false;
                }
            });

            var regionSpan1 = angular.element('<span></span>');
            regionSpan1.attr('role', 'status');
            regionSpan1.attr('aria-live', 'assertive');
            regionSpan1.attr('class', 'keyboard-hidden-screen-reader');
            angular.element(document.body).append(regionSpan1);

            var regionSpan2 = angular.element('<span></span>');
            regionSpan2.attr('role', 'status');
            regionSpan2.attr('aria-live', 'assertive');
            regionSpan2.attr('class', 'keyboard-screen-reader-opens');
            angular.element(document.body).append(regionSpan2);

            $scope.banner_shortcut_0 = true;

            $scope.backendCalled =false;

            $scope.showDescription = function (event) {
                if (event.type === "click" || (event.type = "keydown" && event.keyCode === 13)) {
                    let displayBlock = angular.element(event.target).closest('div');
                    let descBlock = angular.element(displayBlock).find('div.banner-shortcut').attr('id');
                    $scope[descBlock] = !$scope[descBlock];
                    $timeout(function () {
                        if ($scope[descBlock]) {
                            $scope.ariaExpandCollpaseContent(event);
                        } else {
                            $scope.ariaExpandCollpaseContent(event);
                        }
                    }, 10);
                }
            };

            $scope.ariaExpandCollpaseContent = function (event) {
                let headerName = angular.element(event.target).text();
                let expandedClass = angular.element(event.target).closest('div').hasClass('shortcut-container-expanded');
                if (expandedClass) {
                    headerName = headerName + " " + $.i18n.prop("platform.shortcut.aria.instructnavigate");
                    angular.element(".keyboard-hidden-screen-reader").text(headerName);
                } else {
                    headerName = headerName + " "+ $.i18n.prop("platform.shortcut.aria.collapsed");
                    angular.element(".keyboard-hidden-screen-reader").text(headerName);
                }
            };

            function defaultAriaAccessibility(shortcutListObj) {
                angular.element('.xe-popup-mask').attr('tabindex', 0).focus();
                angular.element("#banner_shortcut_0").prev().prev().focus();
                for (let i = 0; i <= shortcutListObj.length - 1; i++) {
                    angular.element("#banner_shortcut_" + i).prev().prev().attr('aria-live', 'polite');
                    let contentHeading = shortcutListObj[i].sectionHeading;
                    let contentDisplay = $.i18n.prop("platform.shortcut.aria.sectionheading") + contentHeading + "." +$.i18n.prop("platform.shortcut.aria.focussed");
                    angular.element("#banner_shortcut_" + i).prev().prev().attr('aria-label', contentDisplay);
                }
                let headingName = angular.element("#banner_shortcut_0").prev().prev().text();
                let expandedClass = angular.element("#banner_shortcut_0").prev().prev().hasClass('shortcut-container-expanded');
                if (expandedClass) {
                    headingName = headingName + " "+ $.i18n.prop("platform.shortcut.aria.collapsed");
                } else {
                    headingName = headingName + " "+ $.i18n.prop("platform.shortcut.aria.expanded");
                }
                angular.element(".keyboard-hidden-screen-reader").text($.i18n.prop("platform.shortcut.aria.dialog.description"));
                angular.element(".keyboard-screen-reader-opens").text(headingName);
            }


            $scope.toggleshortcut = function () {
                $scope.modalShown = !$scope.modalShown;
                let listExists = keyshortcut.getBannerShortcutList();
                if (!$scope.backendCalled) {
                var backendURL = $('meta[name=menuBaseURL]').attr("content");
                    $http({
                        method: "GET",
                        url: backendURL+"/shortcut/data",
                        cache:true
                    }).then(function mySuccess(response) {
                        $scope.messageList = response.data;
                        $scope.backendCalled=true;
                        if (keyshortcut.isMac()) {
                            $scope.macMessageList = $scope.messageList.mac;
                            populateEntireDialog($scope.macMessageList, keyshortcut)
                        } else {
                            $scope.windowsMessageList = $scope.messageList.windows;
                            populateEntireDialog($scope.windowsMessageList, keyshortcut)
                        }
                        $scope.shortcutObj = keyshortcut.getBannerShortcutList();
                        $timeout(function () {
                            defaultAriaAccessibility(listExists);
                        }, 10);
                    }, function myError(response) {
                        console.log("Error Occurred reading message keys from message.properties file");
                    });
                } else {
                  $timeout(function () {
                        defaultAriaAccessibility(listExists);
                    }, 10);
                }
            };

        }]);
})();
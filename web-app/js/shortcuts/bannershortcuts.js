/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

(function () {
    'use strict';
    var _listOfBannerShortcuts = [];
    angular.module('keyboardshortcut', ['bannerBindkeys', 'xe-ui-components'])
        //service
        .service('keyshortcut', ['hotkeys', function (hotkeys) {
            this.shortcutObj = function (combination, description, callback, bindingScope) {
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
                shortcut.scopeToBind = bindingScope;
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
                //combining the shortcuts if the same sectionHeading is been used by App Team
                let sectionHeadList = this.getBannerShortcutList().map(function (listOfBannerShortcut, index, array) {
                    return listOfBannerShortcut.sectionHeading;
                });
                let index = sectionHeadList.indexOf(sectionHeading);
                if (index < 0) {
                    _listOfBannerShortcuts.push(bannerObj);
                } else {
                    _listOfBannerShortcuts[index].shortcutList = _listOfBannerShortcuts[index].shortcutList.concat(shortcutList);
                }

            };

            this.addSectionShortcuts = function (sectionHeading, shortcutList) {
                for (let i = 0; i < shortcutList.length - 1; i++) {
                    this.addToList(shortcutList[i].combo.toString(), shortcutList[i].description, shortcutList[i].callback, shortcutList[i].scopeToBind);
                }
                this.addBannerShortcut(sectionHeading, shortcutList);
            };

            this.getBannerShortcutList = function () {
                return _listOfBannerShortcuts;
            };

            this.addToHotkeys = function (combo, description, callback, passingScope) {
                this.addToList(combo, description, callback, passingScope);
            };

            this.isMac = function () {
                var isMac = false;
                if (window.navigator.platform.indexOf('Mac') >= 0) {
                    isMac = true;
                }
                /*return isMac;*/
                return true;
            };

            this.addToList = function (combo, description, callback, scopeToBind) {
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

            $document.bind('keydown', function (event) {
                if (event.ctrlKey && event.shiftKey && event.keyCode === 191) {
                    $scope.toggleshortcut();
                    $scope.$apply();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            });

            // This is Aria Span's used to hold values to be read with JAWS
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


            $scope.backendCalled = false;

            $scope.showDescription = function (event) {
                if (event.type === "click" || (event.type = "keydown" && event.keyCode === 13)) {
                    let displayBlock = angular.element(event.target).closest('div');
                    let descBlock = angular.element(displayBlock).find('div.banner-shortcut').attr('id');
                    $scope[descBlock] = !$scope[descBlock];
                    $timeout(function () {
                        $scope.ariaExpandCollpaseContent(event);
                        event.preventDefault();
                        return false;
                    }, 10);
                } else if (event.shiftKey && event.keyCode === 9) {
                    let prevHeader = angular.element(event.target).closest('div').prev();
                    prevHeader = angular.element(prevHeader).find('span.content-heading-shortcut').text();
                    if (prevHeader) {
                        let expandedClass = angular.element(event.target).closest('div').prev().hasClass('shortcut-container-expanded');
                        if (expandedClass) {
                            angular.element(".keyboard-screen-reader-opens").text(prevHeader + " " + $.i18n.prop("platform.shortcut.aria.expanded"));
                            prevHeader = prevHeader + ". " + $.i18n.prop("platform.shortcut.aria.instructnavigate");
                            angular.element(".keyboard-hidden-screen-reader").text(prevHeader);
                        } else {
                            angular.element(".keyboard-screen-reader-opens").text(prevHeader + " " + $.i18n.prop("platform.shortcut.aria.collapsed"));
                            prevHeader = prevHeader + " " + $.i18n.prop("platform.shortcut.aria.collapsed");
                            angular.element(".keyboard-hidden-screen-reader").text(prevHeader);
                        }
                    }
                    return true;
                } else if (event.keyCode === 9) {
                    let nextHeader = angular.element(event.target).closest('div').next();
                    nextHeader = angular.element(nextHeader).find('span.content-heading-shortcut').text();
                    if (nextHeader) {
                        let expandedClass = angular.element(event.target).closest('div').next().hasClass('shortcut-container-expanded');
                        if (expandedClass) {
                            angular.element(".keyboard-screen-reader-opens").text(nextHeader + " " + $.i18n.prop("platform.shortcut.aria.expanded"));
                            nextHeader = nextHeader + ". " + $.i18n.prop("platform.shortcut.aria.instructnavigate");
                            angular.element(".keyboard-hidden-screen-reader").text(nextHeader);
                        } else {
                            angular.element(".keyboard-screen-reader-opens").text(nextHeader + " " + $.i18n.prop("platform.shortcut.aria.collapsed"));
                            nextHeader = nextHeader + " " + $.i18n.prop("platform.shortcut.aria.collapsed");
                            angular.element(".keyboard-hidden-screen-reader").text(nextHeader);
                        }
                    }
                    return true;
                } else {
                    return true;
                }
            };

            $scope.ariaExpandCollpaseContent = function (event) {
                let headerName = angular.element(event.target).text();
                let expandedClass = angular.element(event.target).closest('div').hasClass('shortcut-container-expanded');
                if (expandedClass) {
                    angular.element(".keyboard-screen-reader-opens").text(headerName + " " + $.i18n.prop("platform.shortcut.aria.expanded"));
                    headerName = headerName + ". " + $.i18n.prop("platform.shortcut.aria.instructnavigate");
                    angular.element(".keyboard-hidden-screen-reader").text(headerName);
                } else {
                    angular.element(".keyboard-screen-reader-opens").text(headerName + " " + $.i18n.prop("platform.shortcut.aria.collapsed"));
                    headerName = headerName + " " + $.i18n.prop("platform.shortcut.aria.collapsed");
                    angular.element(".keyboard-hidden-screen-reader").text(headerName);
                }
            };

            function defaultAriaAccessibility(shortcutListObj) {
                angular.element('.xe-popup-mask').attr('tabindex', 0).focus();
                angular.element(".banner_aria-shortcut_0").find('span.content-heading-shortcut').focus();
                for (let i = 0; i <= shortcutListObj.length - 1; i++) {
                    angular.element(".banner_aria-shortcut_" + i).find('span.content-heading-shortcut').attr('aria-live', 'polite');
                    let contentHeading = shortcutListObj[i].sectionHeading;
                    let contentDisplay = $.i18n.prop("platform.shortcut.aria.sectionheading") + " " + contentHeading + ". " + $.i18n.prop("platform.shortcut.aria.focussed");
                    angular.element(".banner_aria-shortcut_" + i).find('span.content-heading-shortcut').attr('aria-label', contentDisplay);
                }
                let headingName = angular.element(".banner_aria-shortcut_0").find('span.content-heading-shortcut').text();
                const expandedClass = angular.element(".banner_aria-shortcut_0").hasClass('shortcut-container-expanded');
                if (expandedClass) {
                    headingName = headingName + " " + $.i18n.prop("platform.shortcut.aria.expanded");
                } else {
                    headingName = headingName + " " + $.i18n.prop("platform.shortcut.aria.collapsed");
                }
                angular.element(".keyboard-hidden-screen-reader").text($.i18n.prop("platform.shortcut.aria.dialog.description"));
                angular.element(".keyboard-screen-reader-opens").text(headingName);
            }

            function sortAscendingShortcutList(listToBeSorted) {
                listToBeSorted.sort(function (a, b) {
                    if (a.sectionHeading > b.sectionHeading) return 1;
                    if (a.sectionHeading < b.sectionHeading) return -1;
                    return 0;
                });
                return listToBeSorted;
            }

            $scope.populateEntireDialog = function (objToIterate) {
                Object.keys(objToIterate).forEach(function (key, index) {
                    var shortcutList = objToIterate[key];
                    var tempList = [];
                    for (let i = 0; i < shortcutList.length; i++) {
                        let temp1 = keyshortcut.shortcutObj(shortcutList[i].combination, shortcutList[i].description);
                        tempList.push(temp1);
                    }
                    keyshortcut.addSectionShortcuts(key, tempList);
                });
            };


            $scope.toggleshortcut = function () {
                $scope.modalShown = !$scope.modalShown;
                let shortcutList = keyshortcut.getBannerShortcutList();
                if (!$scope.backendCalled) {
                    var backendURL = $('meta[name=menuBaseURL]').attr("content");
                    $http({
                        method: "GET",
                        url: backendURL + "/shortcut/data",
                        cache: true
                    }).then(function success(response) {
                        let jsonShortcutList = response.data;
                        $scope.backendCalled = true;
                        if (keyshortcut.isMac()) {
                            let macMessageList = jsonShortcutList.mac;
                            $scope.populateEntireDialog(macMessageList);
                        } else {
                            let windowsMessageList = jsonShortcutList.windows;
                            $scope.populateEntireDialog(windowsMessageList);
                        }
                        $scope.shortcutObj = sortAscendingShortcutList(keyshortcut.getBannerShortcutList());
                        $timeout(function () {
                            /*let derivedScope = angular.element("#shortcut_module_added").scope();
                            let firstShortcutScope = angular.element(".banner_shortcut_0").scope();
                            let createId = "banner_shortcut_" + firstShortcutScope.$id;
                            derivedScope[createId] = false;*/
                            defaultAriaAccessibility(shortcutList);
                        }, 10);
                    }, function error(error) {
                        console.log("Error Occurred reading message keys from message.properties file");
                        console.log("Status " + error.status + " Error Message is " + error.statusText);
                    });
                } else {
                    $scope.shortcutObj = sortAscendingShortcutList(keyshortcut.getBannerShortcutList());
                    $timeout(function () {
                        defaultAriaAccessibility(shortcutList);
                    }, 10);
                }
            };

        }]);
})();
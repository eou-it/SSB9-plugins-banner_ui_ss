/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

(function(){
    'use strict';
    angular.module('keyboardshortcut', ['cfp.hotkeys'])
        .config(function(hotkeysProvider) {
            hotkeysProvider.includeCheatSheet = true;
        })

        //service
        // add method which will internally call hotkeys.add method
        .service('keyshortcut',['hotkeys' ,function(hotkeys) {
           // var scope = angular.element(document.getElementById('shortcut_module_added')).scope();
            this.name="HEllo;";
            this.addToHotkeys = function(scope,combo,description,callback){
              //  scope.addToHotkeys(combo,description,callback);
                hotkeys.add({
                    combo: 'up',
                    description: 'Up key Pressed 1 2 3'
                });
                scope.addthis(combo,description,callback);
            }
        }])
        .controller('shortcutModal',[ '$scope', 'hotkeys' ,'$timeout', function($scope, hotkeys,$timeout ){

            hotkeys.add({
                combo: 'ctrl+alt+home',
                description: 'ctrl+alt+home Pressed'
            });

            $scope.addthis = function(combo,description,callback){
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
            var scope = angular.element(document.getElementById('shortcut_module_added')).scope();

            /*scope.$$prevSibling.$watch("helpVisible", function (newVal, oldVal) {
                if(newVal === true){
                    scope.title="Banner shortcuts Navigation";
                    $timeout(function () {
                        angular.element(document.getElementById('shortcut_module_added')).find('tr:first td:first').select().focus();

                        angular.element(document.getElementById('shortcut_module_added')).find('tr:first td:first').on('keydown',function(event) {
                            if (event.shiftKey && event.keyCode === 9) {
                                angular.element(document.getElementById('shortcut_module_added')).find('div.cfp-hotkeys-close').focus();
                                event.preventDefault();
                                return false;
                            } else {
                                return true;
                            }
                        });


                        angular.element(document.getElementById('shortcut_module_added')).find('tr:last td:first').on('keydown',function(event){
                            if(!event.shiftKey && event.keyCode === 9){
                                angular.element(document.getElementById('shortcut_module_added')).find('div.cfp-hotkeys-close').focus();
                                event.preventDefault();
                                return false;
                            }else{
                                return true;
                            }
                        });

                        angular.element(document.getElementById('shortcut_module_added')).find('div.cfp-hotkeys-close').on('keydown',function(event){
                            if(!event.shiftKey && event.keyCode === 9){
                                angular.element(document.getElementById('shortcut_module_added')).find('tr:first td:first').select().focus();
                                event.preventDefault();
                                return false;
                            }else if(event.shiftKey && event.keyCode === 9){
                                angular.element(document.getElementById('shortcut_module_added')).find('tr:last td:first').select().focus();
                                event.preventDefault();
                                return false;
                            }else if(event.keyCode === 13){
                                scope.helpVisible = false;
                                scope.$apply();
                            }
                            else{
                                return true;
                            }
                        });

                    },100);
                }
                });*/



            scope.$watch("helpVisible", function (newVal, oldVal) {
                if(newVal === true){
                    var scope = angular.element(document.getElementById('shortcut_module_added')).scope();
                    scope.title="Banner shortcuts Navigation111";
                    $timeout(function () {
                        angular.element(document.getElementById('shortcut_module_added')).find('tr:first td:first').select().focus();

                        angular.element(document.getElementById('shortcut_module_added')).find('tr:first td:first').on('keydown',function(event) {
                            if (event.shiftKey && event.keyCode === 9) {
                                angular.element(document.getElementById('shortcut_module_added')).find('div.cfp-hotkeys-close').focus();
                                event.preventDefault();
                                return false;
                            } else if(event.keyCode === 27){
                                scope.helpVisible = false;
                                scope.$digest();
                            } else {
                                return true;
                            }
                        });


                        angular.element(document.getElementById('shortcut_module_added')).find('tr:last td:first').on('keydown',function(event){
                            if(!event.shiftKey && event.keyCode === 9){
                                angular.element(document.getElementById('shortcut_module_added')).find('div.cfp-hotkeys-close').focus();
                                event.preventDefault();
                                return false;
                            }else{
                                return true;
                            }
                        });

                        angular.element(document.getElementById('shortcut_module_added')).find('div.cfp-hotkeys-close').on('keydown',function(event){
                            if(!event.shiftKey && event.keyCode === 9){
                                angular.element(document.getElementById('shortcut_module_added')).find('tr:first td:first').select().focus();
                                event.preventDefault();
                                return false;
                            }else if(event.shiftKey && event.keyCode === 9){
                                angular.element(document.getElementById('shortcut_module_added')).find('tr:last td:first').select().focus();
                                event.preventDefault();
                                return false;
                            }else if(event.keyCode === 13){
                                scope.helpVisible = false;
                                scope.$apply();
                            }
                            else{
                                return true;
                            }
                        });

                    },100);
                }
            });

            $scope.testing = function(){
                hotkeys.add({
                    combo: 'alt+m',
                    description: 'Toggle Tools Menu'
                });
            };

        }]);
})();
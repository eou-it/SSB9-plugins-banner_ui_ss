/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

(function(){
    'use strict';
    angular.module('testModule', ['keyboardshortcut'])
        .config(function(hotkeysProvider) {
            hotkeysProvider.includeCheatSheet = true;
        })

        //service
        // add method which will internally call hotkeys.add method
        .controller('testingCtrlModal',[ '$scope','keyshortcut', function($scope,keyshortcut ){
            var testing = function(){
                alert("Inn");
            };

            var scope = angular.element(document.getElementById('shortcut_module_added')).scope();
            if(!scope) {
                angular.element(document.getElementById('shortcut_module_added')).ready(function () {
                    angular.bootstrap(document.getElementById('shortcut_module_added'), ['keyboardshortcut']);
                    scope = angular.element(document.getElementById('shortcut_module_added')).scope();
                    keyshortcut.addToHotkeys(scope,'down',"HERE IT COMES FROM",testing);
                    scope.$apply();
                });
            }

        }]);
})();
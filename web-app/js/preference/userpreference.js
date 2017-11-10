/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

(function(){
    'use strict';
    angular.module('userPreference', ['xe-ui-components'])
        .controller('PopupCtrl',[ '$scope','$timeout','$http', function($scope, $timeout, $http ){
            $scope.modalShown = false;
            if($('meta[name=menuBaseURL]').attr("content")){
                var backendlocale = $('meta[name=menuBaseURL]').attr("content");
            }
            $scope.togglepopup = function() {
                $scope.modalShown = !$scope.modalShown;
                $timeout(function () {
                    angular.element('#xeModalMask').attr('tabindex', 0).focus();
                    // To Fetch all Locales from DB
                    $http.get(backendlocale+"/userPreference/locales").then(function (response) {
                        var localesFromDB = response.data["locales"];
                        if(undefined!=response.data["selectedLocale"]){
                            $scope.language.selected = response.data["selectedLocale"];
                            $scope.disableButton = true;
                        }
                        $scope.localeList = localesFromDB;

                    },function (data, status, headers, config) {
                        //alert("error");
                    });
                });
            };
            $scope.popupTitle = $.i18n.prop('userpreference.popup.language.heading');
            $scope.localeList=[];
            $scope.disableButton = true;

            $scope.$watch("language.selected", function(newVal, oldVal) {
                if (undefined != $scope.language.selected && null!=$scope.language.selected){
                    $scope.disableButton = false;
                }
            });


            // To pass the selected Locale to backend and set in DB
            $scope.saveLocale = function(){
                $http({
                    method: 'POST',
                    url: backendlocale+"/userPreference/saveLocale",
                    data: $scope.language.selected
                }).then(function (response, status) {
                    $scope.togglepopup();
                    var successmessage = $.i18n.prop('userpreference.notification.success.message');
                    var successNotification = new Notification({
                        message: successmessage,
                        type: "success",
                        component: successNotification,
                        elementToFocus: successNotification
                    });
                    notifications.addNotification(successNotification);
                },function (data, status, headers, config) {
                    $scope.togglepopup();
                    var errorMessage = $.i18n.prop('userpreference.notification.failure.message');
                    var errorNotification = new Notification({
                        message: errorMessage,
                        type: "error",
                        component: errorNotification,
                        elementToFocus: errorNotification
                    });
                    notifications.addNotification(errorNotification);
                });
            };
            $scope.language = {};

        }]);
})();
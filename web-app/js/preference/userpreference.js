/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

(function(){
    'use strict';
    angular.module('userPreference', ['xe-ui-components'])
        .controller('PopupCtrl',[ '$scope','$timeout','$http', function($scope, $timeout, $http ){
            $scope.modalShown = false;
            $scope.disableButton = true;
            if($('meta[name=menuBaseURL]').attr("content")){
                var backendlocale = $('meta[name=menuBaseURL]').attr("content");
            }
            $scope.prevSelected={};
            $scope.togglepopup = function() {
                notifications.clearNotifications();
                $scope.modalShown = !$scope.modalShown;
                delete $scope.language.selected;
                $timeout(function () {
                    angular.element('#xeModalMask').attr('tabindex', 0).focus();
                    angular.element('#preference').find('input')[1].focus();
                    // To Fetch all Locales from DB
                    $http.get(backendlocale+"/userPreference/locales").then(function (response) {
                        var localesFromDB = response.data["locales"];
                        if(undefined!=response.data["selectedLocale"]){
                            $scope.language.selected = response.data["selectedLocale"];
                            $scope.prevSelected = response.data["selectedLocale"];
                        }
                        $scope.disableButton = true;
                        $scope.localeList = localesFromDB;

                    },function (data, status, headers, config) {
                        $scope.closePopup();
                        errorNotification();
                    });
                });
            };

            $scope.closePopup = function() {
                $scope.modalShown = !$scope.modalShown;
            };

            $scope.popupTitle = $.i18n.prop('userpreference.popup.language.heading');
            $scope.localeList=[];

            $scope.$watch("language.selected", function (newVal, oldVal) {
                if (undefined != $scope.prevSelected && undefined != $scope.language.selected && $scope.language.selected.locale === $scope.prevSelected.locale) {
                    $scope.disableButton = true;
                } else if (newVal != oldVal) {
                    $scope.disableButton = false;
                }
            });

            // To pass the selected Locale to backend and set in DB
            $scope.saveLocale = function(){
                $scope.closePopup();
                /*setTimeout(function() { angular.element("#saveLanguage").focusout(); }, 10);*/
                /*$scope.disableButton = true;*/
                $http({
                    method: 'POST',
                    url: backendlocale+"/userPreference/saveLocale",
                    data: $scope.language.selected,
                    cache: false
                }).then(function (response, status) {
                    successNotification();
                },function (data, status, headers, config) {
                    errorNotification();
                });
            };


            $scope.errorMessage = function(){
                $scope.closePopup();
                errorNotification();
            };

            $scope.language = {};

            function successNotification(){
                notifications.clearNotifications();
                /*var element1 = angular.element("#notification-center").find('a:first');*/
                var successmessage = $.i18n.prop('userpreference.notification.success.message');
                var successNotification = new Notification({
                    message: successmessage,
                    type: "success",
                    flash: true
                    /*elementToFocus: element1*/
                });
                notifications.addNotification(successNotification);
            }

            function errorNotification(){
                notifications.clearNotifications();
                var element1 = angular.element("#notificationCenterAriaInfo").find('ul.error-container:first');
                /*var element1 = angular.element("#notification-center").find('a:first');*/
                var errorMessage = $.i18n.prop('userpreference.notification.failure.message');
                var errorNotification = new Notification({
                    message: errorMessage,
                    type: "error"
                    /*component: errorNotification*/
                    /*elementToFocus: element1*/
                });
                notifications.addNotification(errorNotification);
            }

        }]);
})();
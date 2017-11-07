(function(){
    'use strict';
    angular.module('userPreference', ['xe-ui-components'])
        .controller('PopupCtrl',[ '$scope','$timeout','$http', function($scope, $timeout, $http ){
            $scope.modalShown = false;
            $scope.togglepopup = function() {
                $scope.modalShown = !$scope.modalShown;
                $timeout(function () {
                    angular.element('#xeModalMask').attr('tabindex', 0).focus();
                });
            };

            $scope.title =$.i18n.prop('userpreference.popup.language.heading');

            $scope.selectedLang ={};
            $scope.localeList=[];

            $http.post("userPreference/locales").then(function (response) {
               /* var localeData = response.data["locales"];
                $(localeData).each(function(ind,ele){
                    console.log(ele)
                });
                if(undefined!=response.data["selectedLocale"]){
                    $scope.selectedLang = response.data["selectedLocale"];
                    $scope.locale.selected = $scope.localeList[1];
                }

                $scope.localeList = localeData;*/
                console.log("LOCALE GOT");

            },function (data, status, headers, config) {
                alert("error");
            });


            $scope.saveLocale = function(){
                var optionSelected = angular.element("#preference").find('span.select2-chosen').text();
                $scope.selectedLang.description=optionSelected;
                for(var i=0;i<$scope.localeList.length;i++){
                    if($scope.localeList[i].description ===optionSelected){
                        $scope.selectedLang.locale =$scope.localeList[i].locale;
                    }
                }
                console.log($scope.selectedLang);
                /* $http.post("userPreference/saveLocale", $scope.selectedLang).then(function (response, status) {
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
                });*/


            };

            $scope.localeList = [
                {id:"ar",name:"Arabic"},
                {id:"en_AU",name:"English Australia"},
                {id:"en_GB",name:"English United Kingdom"},
                {id:"en_IE",name:"English Ireland"},
                {id:"en_IN",name:"English India"},
                {id:"es",name:"Spanish"},
                {id:"fr",name:"French"},
                {id:"fr_CA",name:"French Canada"},
                {id:"pt",name:"Portuguese"},
                {id:"es_MX",name:"Spanish (Mexico)"},
                {id:"es_PE",name:"Spanish (Peru)"},
                {id:"es_CO",name:"Spanish (Colombia)"},
                {id:"es_DO",name:"Spanish (Dominican Republic)"},
                {id:"es_PR",name:"Spanish (Puerto Rico)"},
                {id:"es_VE",name:"Spanish (Venezuela)"},
                {id:"es_CL",name:"Spanish (Canary Islands)"},
                {id:"es_EC",name:"Spanish (Ecuador)"},
                {id:"es_CR",name:"Spanish (Costa Rica)"},
                {id:"es_PA",name:"Spanish (Panama)"},
                {id:"es_GT",name:"Spanish (Guatemala)"},
                {id:"es_AR",name:"Spanish (Argentina)"},
                {id:"ar_SA",name:"Arabic (Saudi Arabia)"}
            ];

            $scope.locale = {};
            /*$scope.locale.selected = $scope.localeList[1];*/

        }]);
})();
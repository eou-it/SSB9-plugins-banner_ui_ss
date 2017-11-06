(function(){
    'use strict';
    angular.module('userPreference', ['xe-ui-components'])
        .controller('PopupCtrl',[ '$scope','$timeout','$http', function($scope, $timeout, $http){
            $scope.modalShown = false;
            $scope.togglepopup = function() {
                $scope.modalShown = !$scope.modalShown;
                $timeout(function () {
                    angular.element('#xeModalMask').attr('tabindex', 0).focus();
                });
            };

            $scope.title ="Preference Language ";
            $scope.selectedLang ={};

           /* $scope.get('configUserPreference/fetch',function(){

            });*/
            $scope.testing = function(){
                var optionSelected = angular.element("#preference").find('span.select2-chosen').text();
                $scope.selectedLang.name=optionSelected;
                for(var i=0;i<$scope.localeList.length;i++){
                    if($scope.localeList[i].name ===optionSelected){
                        $scope.selectedLang.id =$scope.localeList[i].id;
                    }
                }
                console.log($scope.selectedLang);

                $http.post("userPreference/saveLocale", $scope.selectedLang).then(function (data, status, headers, config) {
                    alert("success");
                },function (data, status, headers, config) {
                    alert("error");
                });


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
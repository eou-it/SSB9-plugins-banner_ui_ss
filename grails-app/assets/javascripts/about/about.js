/*********************************************************************************
 Copyright 2016-2019 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
(function(){
    'use strict';
    angular.module('dialogApp', ['xe-ui-components'])
        .config(['aboutServiceProvider',function(aboutServiceProvider) {
            aboutServiceProvider.setMethod('GET');
            var menuBaseURL = $('meta[name=menuBaseURL]').attr("content");
            var aboutUrl = $('meta[name=aboutUrl]').attr("content");
            var aboutUrlContextPath = $('meta[name=aboutUrlContextPath]').attr("content");
            if(aboutUrl == ""){
                aboutUrl = aboutUrlContextPath + "/about/data?callback=JSON_CALLBACK";
            }
            aboutServiceProvider.setBackendUrl(aboutUrl);
        }])
        .controller('ModalCtrl',['$scope','$timeout', function($scope, $timeout){
            $scope.modalShown = false;
            $scope.toggleModal = function() {
                $scope.modalShown = !$scope.modalShown;
                $timeout(function () {
                    angular.element('#xeModalContainer').attr('tabindex', 0).focus();
                });
            };
            $scope.aboutApi = {
                title: 'api.title',
                name: 'about.banner.application.name',
                version: 'about.banner.application.version',
                platformVersion: 'about.banner.platform.version',
                general: 'about.banner.tab.general',
                plugin: 'about.banner.plugins',
                otherPlugin: 'about.banner.other.plugins',
                copyright: 'about.banner.copyright',
                close : 'api.close',
                copyrightLegalNotice: 'about.banner.copyrightLegalNotice'
            };
        }]);
})();
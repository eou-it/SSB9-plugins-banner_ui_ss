(function(){
    'use strict';
    angular.module('dialogApp', ['xe-ui-components'])
        .config(function(aboutServiceProvider) {
            aboutServiceProvider.setMethod('GET');
            var menuBaseURL = $('meta[name=menuBaseURL]').attr("content");
            var aboutUrl = $('meta[name=aboutUrl]').attr("content");
            var aboutUrlContextPath = $('meta[name=aboutUrlContextPath]').attr("content");
            if(aboutUrl == ""){
                aboutUrl = aboutUrlContextPath + "/about/data?callback=JSON_CALLBACK";
            }
            aboutServiceProvider.setBackendUrl(aboutUrl);
        })
        .controller('ModalCtrl', function($scope){
            $scope.modalShown = false;
            $scope.toggleModal = function() {
                $scope.modalShown = !$scope.modalShown;
            };
            $scope.aboutApi = {
                title: 'api.title',
                name: 'about.banner.application.name',
                version: 'about.banner.application.version',
                general: 'about.banner.tab.general',
                plugin: 'about.banner.plugins',
                otherPlugin: 'about.banner.other.plugins',
                copyright: 'about.banner.copyright'
            };
        });
})();
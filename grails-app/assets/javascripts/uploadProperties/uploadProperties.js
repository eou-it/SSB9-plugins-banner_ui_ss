/*******************************************************************************
 Copyright 2017-2020 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

function clickEvent(element){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    var isChecked = element.getAttribute("aria-checked")== 'true';
    element.setAttribute("aria-checked",!isChecked);
    if(keycode == 32 || keycode==13){
        element.click();
        event.preventDefault();
    }
}

/* global notifications */
(function() {
    'use strict';

    window.console = window.console || { log: function() {} }; //IE9 console.log polyfill stub

    var uploadPropApp = angular.module("uploadProperties", ["extensibility"]);

    var uploadPropCtrl = function($scope, $http, $timeout) {
        var propFiles = [],uploadProperties = 'uploadProperties',uploadedFile;
        $scope.lanProperties = [
                {language : $.i18n.prop("upload.properties.language.primary"), code : ""}
            ].concat([
                {language : $.i18n.prop("upload.properties.language.englishus"),
                    code : "en"},
                {language : $.i18n.prop("upload.properties.language.englishgb"),
                    code : "en_GB"},
                {language : $.i18n.prop("upload.properties.language.englishin"),
                    code : "en_IN"},
                {language : $.i18n.prop("upload.properties.language.englishie"),
                    code : "en_IE"},
                {language : $.i18n.prop("upload.properties.language.englishau"),
                    code : "en_AU"},
                {language : $.i18n.prop("upload.properties.language.frenchfr"),
                    code : "fr"},
                {language : $.i18n.prop("upload.properties.language.frenchca"),
                    code : "fr_CA"},
                {language : $.i18n.prop("upload.properties.language.spanishla"),
                    code : "es"},
                {language : $.i18n.prop("upload.properties.language.portuguesebr"),
                    code : "pt"},
                {language : $.i18n.prop("upload.properties.language.arabic"),
                    code : "ar"}
            ].sort(function(a,b) { return a.language.localeCompare(b.language)} ));
        $scope.fileLoc = 'root';

        $scope.getFiles = function() {
            $http.get(uploadProperties + '/list').then( function(response) {
                $scope.propFiles = response.data;
                console.log( 'Files : ', $scope.templates, $scope );
            }).catch(function (error, status) {
                var errorNotification = new Notification({
                    message:$.i18n.prop("upload.properties.language.fetchFail") ,
                    type: "error",
                    flash: true});
                notifications.addNotification(errorNotification);
                console.log(error);
            })
        }

        $scope.selectCheckbox = function(){
            var selectedData = $scope.selectedLanguage;
            if(selectedData) {
                $("input[name='checkboxInput']").each(function () {
                    if ($(this).val() == selectedData) {
                        $(this).parent().hide();
                        $(this).prop('checked', false);
                    } else {
                        $(this).parent().show();
                        if ($(this).val() == 'enUS') {
                            $(this).prop('checked', true);
                        }
                    }
                })
            }
        }

        $scope.uploadFiles = function(){

            var filesSaved=0, textSaved=0;
            var localList = $scope.getInitcheckedlocales();
            var propList =$scope.propFiles;
            $.each(propList, function(index, item){
                var request = {
                    method: 'POST',
                    url: uploadProperties + '/save',
                    cache: false,
                    data: $scope.getfileData(item,localList),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                $http(request)
                    .then(function (response) {
                        filesSaved= filesSaved+1;
                        textSaved= textSaved+response.data.count;
                        $scope.filesSaved = filesSaved;
                        $scope.textSaved = textSaved;
                        $scope.uploadedFile = response.data;
                        $("#count"+response.data.id).text(response.data.count)
                        console.log( 'Files : ', $scope.templates, $scope );
                    })
                    .catch(function (error, status) {
                        var errorNotification = new Notification({
                            message:$.i18n.prop("upload.properties.language.uploadFail",[item.basename]) ,
                            type: "error"});
                        notifications.addNotification(errorNotification);
                        console.log(error);
                    })
                })
            }

        $scope.getInitcheckedlocales = function(){
            var localeList=[];
            $("input[name='checkboxInput']:checked").each(function () {
                var locales={};
                locales.enabled = true;
                locales.description= $(this).text();
                locales.code= $(this).val();
                localeList.push(locales);
            });
            return localeList;
        }

        $scope.uploadcheckedfiles = function(){
            var filesSaved=0, textSaved=0;
            var localeList = $scope.getInitcheckedlocales();
            var data ={};
            $("input[name='checkboxTable']:checked").each(function () {
                    data.id=$(this).attr('dataId');
                    data.basename=$(this).val();
                    var request = {
                        method: 'POST',
                        url: uploadProperties + '/save',
                        cache: false,
                        data: $scope.getfileData(data,localeList),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    $http(request)
                        .then(function (response) {
                            filesSaved= filesSaved+1;
                            textSaved= textSaved+response.data.count;
                            $scope.filesSaved = filesSaved;
                            $scope.textSaved = textSaved;
                            $scope.uploadedFile = response.data;
                            $("#count"+response.data.id).text(response.data.count)
                            console.log( 'Files : ',  $scope );
                        })
                        .catch(function (error, status) {
                            var errorNotification = new Notification({
                                message:$.i18n.prop("upload.properties.language.uploadFail",[request.data.basename]) ,
                                type: "error"});
                            notifications.addNotification(errorNotification);
                            console.log(error);
                        })
            });
        }

        $scope.resetfiles = function(){
            $("input[name='checkboxTable']:checked").each(function () {
                    $(this).attr('checked',false);
            });
        }
        $scope.getfileData = function(data, localList){
            var dataList={};
            dataList.id = data.id;
            dataList.sourceLocale = $scope.selectedLanguage;
            dataList.count=0;
            dataList.basename = data.basename;
            dataList.enableTranslation = true;
            dataList.locales=localList
            return dataList;
        }
        $scope.getFiles();
    };
    uploadPropApp.controller('uploadPropCtrl', ['$scope', '$http', '$timeout', uploadPropCtrl]);

    uploadPropApp.config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 12 DEC 2016 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);



})();

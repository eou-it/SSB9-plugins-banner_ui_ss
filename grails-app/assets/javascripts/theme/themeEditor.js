/*******************************************************************************
 Copyright 2016-2019 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
/* global notifications */
(function() {
    'use strict';

    window.console = window.console || { log: function() {} }; //IE9 console.log polyfill stub

    //SASS mix function
    //TODO - find a equivalent tinycolor method
    //TODO - Move this inside Scss file and work on Sass compiler
    var mix = function (color_1, color_2, weight) {
        function d2h(d) {
            return d.toString(16);
        } // convert a decimal value to hex
        function h2d(h) {
            return parseInt(h, 16);
        } // convert a hex value to decimal

        weight = (typeof (weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

        var color = "#";

        for (var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
            var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
                v2 = h2d(color_2.substr(i, 2)),

                // combine the current pairs from each source color, according to the specified weight
                val = d2h(Math.round(v2 + (v1 - v2) * (weight / 100.0))); // Exact SASS value

            while (val.length < 2) {
                val = '0' + val;
            } // prepend a '0' if val results in a single digit

            color += val; // concatenate val to our new color string
        }

        return color; // PROFIT!
    };

    var themeEditorApp = angular.module("themeEditor", ["color.picker", "extensibility"]);

    var themeEditorCtrl = function($scope, $http, $timeout) {
        var themePath = 'theme',
            themeEditorPath = 'themeEditor',
            themes = [],
            templates = [],
            variables = {
                'name': 'string',
                'color1': 'color',
                'color2': 'color',
                'color3': 'color',
                'logo': 'image',
                'favicon': 'image',
                'css': 'url'
            },
            colors = [],
            fieldnames = [],
            generated_lightness = [.25, .9],
            shades = [.1, .2, .35, .5, .8, .99],
            saveError = 'saveError';
        $scope.isDisabled=true;

        var init = function() {
            console.log("theme init");

            for ( var f in variables ) {
                fieldnames.push( f );
                console.log( "init " + f + '/' + variables[f] );
                if ( variables[f] == 'color' ) {
                    colors.push( f );
                    watchColor( f );
                    fieldnames.push(f + '_text');
                    fieldnames.push(f + '_dark');
                    fieldnames.push(f + '_dark_text');
                    fieldnames.push(f + '_light');
                    fieldnames.push(f + '_light_text');

                    for ( var i = 0; i < shades.length; i++ ) {
                        fieldnames.push( f + '-' + i );
                    }
                }
            }
            fieldnames.push('color1-active');
            fieldnames.push('color3-hover');
            fieldnames.push('color3-active');
            fieldnames.push('color3-light');

            $scope.newTheme();

            $scope.color1 = '#5353D1';
            $scope.color2 = '#51ABFF';
            $scope.color3 = '#026BC8';
        }

        var setTextColor = function( $scope, name, value ) {
            $scope[ name + '_text' ] = tinycolor.
            mostReadable( value, ['#393939', '#888888', '#333333', '#cccccc'], { includeFallbackColors: true }).toHexString();
        }

        var shade = function( color, lum ) {
            var hsl = tinycolor( color ).toHsl();
            console.log( 'shade', color, lum, hsl.l );
            hsl.l = lum;
            return tinycolor( hsl ).toHexString();
        }

        var isValid6DigitColor = function( value ) {
            var FULL_HEX_STRING_LENGTH = 6,
                tc = tinycolor( value );
            return ( tc.isValid() &&
                (tc._format !== 'hex' || tc._originalInput.length >= FULL_HEX_STRING_LENGTH ));
        }

        var updateTheme = function( text, values ) {
            $scope['color1-active'] = mix("151618", $scope.color1.substr(1), 40)
            $scope['color3-hover'] = mix("151618", $scope.color3.substr(1), 20)
            $scope['color3-active'] = mix("151618", $scope.color3.substr(1), 40)
            $scope['color3-light'] = mix("FFFFFF", $scope.color3.substr(1), 95)

            console.log( 'updateTheme ', values );
            var rx, newText;
            for ( var k in values ) {
                if ( values[k] ) {
                    // this regex may behave strangely if k has special regex characters
                    rx = new RegExp( '(/\\*' + k + '\\*/\\s*)#?([-._a-zA-Z0-9]+)?', 'g' );
                    newText = text.replace( rx, '$1' + values[k] );
                    text = newText;
                }
            }
            return text;
        }

        var updatePreview = function(data) {
            //TODO: Manipulating DOM in controller - should be in a theme-editor-style directive

            // Work with style tag in container so we can replace the correct element
            // and replace the whole style element because replacing just the content
            // doesn't work reliably
            var preview = $('#style-container>style');
            var parent = preview.parent();
            var style = '<style>';
            var newPreview = $( style );
            var text = preview.text();
            var newText = updateTheme( text, data);

            newPreview.text( newText );
            preview.replaceWith( newPreview );
            return newText;
        }

        var watchColor = function( name ) {
            $scope.$watch( name, function( newValue, oldValue ) {
                if ( isValid6DigitColor( newValue )) {
                    console.log( "watchColor:", name, newValue, $scope[name] );
                    setTextColor( $scope, name, newValue );

                    var darkColor = shade( newValue, generated_lightness[0] );
                    var darkName = name + '_dark';
                    $scope[ darkName ] = darkColor;
                    setTextColor( $scope, darkName, darkColor );

                    var lightColor = shade( newValue, generated_lightness[1] );
                    var lightName = name + '_light';
                    $scope[ lightName ] = lightColor;
                    setTextColor( $scope, lightName, lightColor );

                    var shade_i, i, shadeName;
                    for ( i = 0; i < shades.length; i++ ) {
                        shadeName = name + '-' + i;
                        shade_i = shade( newValue, shades[i] );
                        $scope[ shadeName ] = shade_i;
                    }

                    updatePreview( getData( $scope ));
                }
            });
        }

        var getData = function($scope) {
            var data = {};
            for ( var i = 0; i < fieldnames.length; i++ ) {
                var f = fieldnames[i];
                data[f] = $scope[ f ];
            }
            return data;
        }

        var hueDistance = function( hue1, hue2 ) {
            return Math.abs((hue1 - hue2) % 360);
        }

        /**
         * Derive color3 as the triad of color1 that is most different from the hue of color2
         */
//         var deriveColor3 = function() {
//             var c1 = tinycolor( $scope.color1 ),
//                 c2 = tinycolor( $scope.color2 );
//             if ( isValid6DigitColor( c1 ) && isValid6DigitColor( c2 )) {
// // triad off color1, pick triad color farthest from color2
// //                var triad = c1.triad(),
// //                    color3 = triad[1],
// //                    hueColor2 = c2.toHsl().h,
// //                    hueA = triad[1].toHsl().h,
// //                    hueB = triad[2].toHsl().h;
// //                if ( Math.abs( hueColor2 - hueB ) > Math.abs( hueColor2 - hueA )) {
// //                    color3 = triad[2];
// //                }
// //                color3.l=.5;
// //                $scope.color3 = color3.toHexString();
//
// // pick color3 as equally far from color1 as color2 is
// //                var hsl3 = tinycolor( c1 ).toHsl(),
// //                    h1 = c1.toHsl().h,
// //                    h2 = c2.toHsl().h;
// //
// //                hsl3.h = (h1 + (h1-h2)) % 360;
// //                console.log( 'deriveColor3', h1, h2, hsl3.h, (h1-h2), (hsl3.h - h1));
// //
// //                $scope.color3 = tinycolor(hsl3).toHexString();
//
// // pick color3 as 10% off of complement, farthest from color2
//                 var hsl3 = tinycolor( c1 ).toHsl(),
//                     h1 = c1.toHsl().h,
//                     h2 = c2.toHsl().h,
//                     delta = 36,
//                     hA = (h1 + 180 + delta) % 360,
//                     hB = (h1 + 180 - delta) % 360;
//                 hsl3.h = hA;
//                 if ( hueDistance( h2, hB ) > hueDistance( h2, hA )) {
//                     hsl3.h = hB;
//                 }
//             console.log( 'deriveColor3', 'h1', h1, 'h2', h2, 'h3', hsl3.h, hueDistance(h2, hA), hueDistance(h2, hB), c1.complement().toHsl().h);
//
//                 $scope.color3 = tinycolor(hsl3).toHexString();
//             }
//         }

            //$scope.$watchGroup(['color1', 'color2'], deriveColor3);

        var autoReload = function( name ) {
                return '&reload=' + new Date().getTime();
            }

        $scope.loadTheme = function( name ) {
            console.log( 'loadTheme ' + name );

            var newLink = document.createElement( 'link' );
            newLink.rel = 'stylesheet';
            newLink.type = 'text/css';
            newLink.href = themePath + '/getTheme?name=' + name + autoReload();

            document.getElementsByTagName("head")[0].appendChild( newLink );

            $('#theme-logo-image').css({'background-color': $scope.color1, 'background-image' : 'url(' + $scope.logo + ')'});
            $('#theme-favicon-image').css({ 'background-image' : 'url(' + $scope.favicon + ')'});

            changeFavicon();
            updatePreview( getData( $scope ));
        }

        $scope.setTheme = function( name ) {
            $http.get( themePath + "/get?name=" + name + autoReload() ).success( function( response ) {
                var data = {};
                for ( var i in fieldnames ) {
                    var f = fieldnames[i];
                    $scope[f] = response[f];
                }

                if ( response['color3'] ) {
                    $timeout( function() { $scope.color3 = response['color3'] }, 0 ); // after $watch has adjusted color3
                }
                $scope.loadTheme( name );
            }).error( function( response ) {
                console.log( "failed to load theme " + name, response );
            });
        }

        $scope.newTheme = function() {
            console.log("newTheme");

            for ( var i in fieldnames ) {
                var f  = fieldnames[i];
                $scope[f] = '';
            }
        }

        $scope.getThemes = function() {
            $http.get(themePath + '/list').success( function(response) {
                $scope.themes = response;
                console.log( 'themes: ', $scope.themes, $scope );
            }).error( function(response) {
                console.log( 'Unable to load existing themes', response.status );
            });
        }

        $scope.getTemplates = function() {
            $http.get(themePath + '/listTemplates').success( function(response) {
                $scope.templates = response;
                console.log( 'templates: ', $scope.templates, $scope );
            }).error( function(response) {
                console.log( 'Unable to load existing templates', response.status );
            });
        }

        $scope.saveTheme = function() {
            console.log("saveTheme:", $scope);
            var data = getData($scope);
            console.log("saving data:", data);
            if(!data.name){
                var errorNotification  = notifications.addNotification(new Notification({
                    message: $.i18n.prop("js.notification.upload.error"),
                    type: "error",
                    id: saveError
                }))
                return
            }

            return $http.post( themeEditorPath + "/save", data)
                .success( function() {
                    console.log("success");
                    $scope.getThemes();
                    $scope.loadTheme($scope.name);
                })
                .success(function(data) {
                    var errorNotification =  notifications.get('saveError');
                    if (errorNotification) {
                        notifications.remove(errorNotification);
                    }
                    notifications.addNotification(new Notification({
                        message: $.i18n.prop("js.notification.success"),
                        type: "success",
                        flash: true
                    }))
                })
                .error( function(response) {
                    console.log( "failed to save theme: ", response.status );
                    var errorNotification  = notifications.addNotification(new Notification({
                        message: $.i18n.prop("js.notification.upload.error"),
                        type: "error",
                        id: saveError
                    }))

                });
        }

        $scope.deleteTheme = function( name ) {
            console.log("deleteTheme:", name);
            //!! TODO: RESTFUL
            return $http.post( themeEditorPath + "/deleteTheme?name=" + name )
                .success( function() {
                    console.log("delete success");
                    $scope.getThemes();
                })
                .error( function(response) {
                    console.log( response );
                    console.log( "failed to delete theme: ", response.status );
                });
        }

        $scope.deleteTemplate = function( name ) {
            console.log("deleteTemplate:", name);
            //!! TODO: RESTFUL
            return $http.post( themeEditorPath + "/deleteTemplate?name=" + name )
                .success( function() {
                    console.log("delete success");
                    $scope.getTemplates();
                })
                .error( function(response) {
                    console.log( response );
                    console.log( "failed to delete template: ", response.status );
                });
        }

        var formdata = new FormData();
        $scope.uploadFiles = function() {
            var dispMsg = document.getElementById("uploadMsg");
            console.log("upload file:", $scope);
            var data = formdata;
            var request = {
                method: 'POST',
                url: themeEditorPath + '/upload',
                cache: false,
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };

            // SEND THE FILES.
            return $http(request)
                .success(function (d) {
                    var errorPresent =  notifications.get(saveError);
                    if (errorPresent) {
                        notifications.remove(errorPresent);
                    }
                    if(d=='invalidFormat'){
                        var errorNotification = new Notification({
                            message:$.i18n.prop("js.notification.upload.type") ,
                            type: "error",
                            flash: true
                        });
                        notifications.addNotification(errorNotification);
                    }else if(d=='largeData') {
                        var errorNotification = new Notification({
                            message:$.i18n.prop("js.notification.upload.size") ,
                            type: "error",
                            flash: true});
                        notifications.addNotification(errorNotification);
                    }
                    else if(d=='noData') {
                        var errorNotification = new Notification({
                            message:$.i18n.prop("js.notification.upload.nodata") ,
                            type: "error",
                            flash: true});
                        notifications.addNotification(errorNotification);
                    }else if(d=='error') {
                        var errorNotification = new Notification({
                            message:$.i18n.prop("js.notification.upload.error") ,
                            type: "error",
                            id: saveError});
                        notifications.addNotification(errorNotification);
                    }else{
                        notifications.addNotification(new Notification({
                            message: $.i18n.prop("js.notification.upload.success"),
                            type: "success",
                            flash: true
                        }))

                        $scope.getThemes();
                        $scope.getTemplates();
                    }
                })
                .error(function () {
                    var errorNotification  = notifications.addNotification(new Notification({
                        message: $.i18n.prop("js.notification.upload.error"),
                        type: "error",
                        id: saveError
                    }))
                })['finally'](function() {
                angular.element("input[type='file']").val(null);
                $scope.isDisabled=true;
            });

        }

        $scope.getTheFiles = function ($files) {
            formdata=new FormData();
            angular.forEach($files, function (value, key) {
                formdata.append('file', value);
            });
        };
        $scope.uploadfilechange = function (values){
            if(values.value !=""){
                $scope.$apply(function() {
                    $scope.isDisabled=false;
                });
            }else{
                $scope.$apply(function() {
                    $scope.isDisabled=true;
                });
            }
        }
        console.log( "starting get" );
        init();

        $scope.getThemes();
        $scope.getTemplates();
    };


    themeEditorApp.controller('themeEditorCtrl', ['$scope', '$http', '$timeout', themeEditorCtrl]);

    themeEditorApp.config(['$httpProvider', function($httpProvider) {
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

    /**
     * create an xe-onload directive to execute functions specified as xe-onload attributes
     * from http://stackoverflow.com/questions/17547917/angularjs-image-onload-event
     */
    angular.module('xeOnload', [])
        .directive('xeOnload', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var fn = $parse(attrs.xeOnload);
                    elem.on('load', function (event) {
                        scope.$apply(function() {
                            fn(scope, { $event: event });
                        });
                    });
                }
            };
        }]);
    themeEditorApp.directive('ngFiles', ['$parse', function ($parse) {
        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.ngFiles);
            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            });
        };

        return {
            link: fn_link
        }
    }])
})();

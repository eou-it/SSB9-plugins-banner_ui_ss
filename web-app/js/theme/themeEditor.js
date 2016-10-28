
/*******************************************************************************
Copyright 2016 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
(function() {
    'use strict';

    window.console = window.console || { log: function() {} }; //IE9 console.log polyfill stub

    var themeEditorApp = angular.module("themeEditor", ["color.picker"]);

    var themeEditorCtrl = function($scope, $http, $timeout) {
        var themePath = 'theme',
            themeEditorPath = 'themeEditor',
            themes = [],
            variables = {
                'name': 'string',
                'color1': 'color',
                'color2': 'color',
                'color3': 'color',
                'logo': 'image',
                'css': 'url'
            },
            colors = [],
            fieldnames = [],
            generated_lightness = [.25, .9],
            shades = [.1, .2, .35, .5, .8, .9];

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
            $scope.newTheme();

            $scope.color1 = '#206E9F';
            $scope.color2 = '#D68C3D';
            $timeout( function() { $scope.color3 = '#4F585F' }, 0 ); // after $watch has adjusted color3
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
        var deriveColor3 = function() {
            var c1 = tinycolor( $scope.color1 ),
                c2 = tinycolor( $scope.color2 );
            if ( isValid6DigitColor( c1 ) && isValid6DigitColor( c2 )) {
// triad off color1, pick triad color farthest from color2
//                var triad = c1.triad(),
//                    color3 = triad[1],
//                    hueColor2 = c2.toHsl().h,
//                    hueA = triad[1].toHsl().h,
//                    hueB = triad[2].toHsl().h;
//                if ( Math.abs( hueColor2 - hueB ) > Math.abs( hueColor2 - hueA )) {
//                    color3 = triad[2];
//                }
//                color3.l=.5;
//                $scope.color3 = color3.toHexString();

// pick color3 as equally far from color1 as color2 is
//                var hsl3 = tinycolor( c1 ).toHsl(),
//                    h1 = c1.toHsl().h,
//                    h2 = c2.toHsl().h;
//
//                hsl3.h = (h1 + (h1-h2)) % 360;
//                console.log( 'deriveColor3', h1, h2, hsl3.h, (h1-h2), (hsl3.h - h1));
//
//                $scope.color3 = tinycolor(hsl3).toHexString();

// pick color3 as 10% off of complement, farthest from color2
                var hsl3 = tinycolor( c1 ).toHsl(),
                    h1 = c1.toHsl().h,
                    h2 = c2.toHsl().h,
                    delta = 36,
                    hA = (h1 + 180 + delta) % 360,
                    hB = (h1 + 180 - delta) % 360;
                hsl3.h = hA;
                if ( hueDistance( h2, hB ) > hueDistance( h2, hA )) {
                    hsl3.h = hB;
                }
            console.log( 'deriveColor3', 'h1', h1, 'h2', h2, 'h3', hsl3.h, hueDistance(h2, hA), hueDistance(h2, hB), c1.complement().toHsl().h);

                $scope.color3 = tinycolor(hsl3).toHexString();
            }
        }

        $scope.$watchGroup(['color1', 'color2'], deriveColor3);

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

        $scope.saveTheme = function() {
            console.log("saveTheme:", $scope);
            var data = getData($scope);
            console.log("saving data:", data);

            return $http.post( themeEditorPath + "/save", data)
                .success( function() {
                    console.log("success");
                    $scope.getThemes();
                    $scope.loadTheme($scope.name, data);
                })
                .error( function(response) {
                    console.log( response );
                    console.log( "failed to save theme: ", response.status );
                });
        }

        $scope.deleteTheme = function( name ) {
            console.log("deleteTheme:", name);
            //!! TODO: RESTFUL
            return $http.post( themeEditorPath + "/delete?name=" + name )
                .success( function() {
                    console.log("delete success");
                    $scope.getThemes();
                })
                .error( function(response) {
                    console.log( response );
                    console.log( "failed to delete theme: ", response.status );
                });
        }

        console.log( "starting get" );
        init();

        $scope.getThemes();
    };


    themeEditorApp.controller('themeEditorCtrl', ['$scope', '$http', '$timeout', themeEditorCtrl]);

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
})();
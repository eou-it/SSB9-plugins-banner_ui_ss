/** *****************************************************************************
 Copyright 2009-2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.common


import spock.lang.Specification
import spock.lang.Unroll


class ThemeScssGeneratorSpec extends Specification {
    def themeScssGenerator = new ThemeScssGenerator()
    def scssFile = "${System.properties['base.dir']}/web-app/css/theme/banner-ui-ss.scss"


    def "test remove comments ()"() {
        expect:
        themeScssGenerator.removeCommentedStyles(inputCss) == desiredCss

        where:
        inputCss                                                                |   desiredCss

        "/* | */"                                                               |   ""
        "/* { */"                                                               |   ""
        "/* line1 \n * line2 \n * line3 \n */.class{color:red}"                 |   ".class{color:red}"
        ".class{/* line1 \n * line2 \n * line3 \n */color:red}"                 |   ".class{color:red}"
        ".class { color:blue;/*{identifier}*/ background-color:red;}"           |   ".class { color:blue; background-color:red;}"
        "/* Beginning comment */.class { color:blue; }/* Ending comment */"     |   ".class { color:blue; }"
        "/* Beginning } comment */.class { color:blue; }/* Ending { comment */" |   ".class { color:blue; }"
    }

    @Unroll
    def "test generateSCSS"() {
        expect:
        themeScssGenerator.generateSCSS(inputCss).replaceAll("\n", "") == desiredCss

        where:
        inputCss                                                                |   desiredCss

        ".class { color:blue;background-color:red;\n}"                          |   ".class  {    color: #0000FF;    background-color: #FF0000;}"
        "/* Beginning } comment */.class { color:blue; }/* Ending { comment */" |   ".class  {    color: #0000FF;}"
        "@media only screen and (min-width:768px){ .test { font-size: 1em }}"   |   ""
        "@media only screen and (min-width:768px){ .test { color: #ddd}}"       |   "@media only screen and (min-width:768px){ .test  {    color: #DDDDDD;}}"
        "@media only screen and (min-width:768px){ .test { border: 1px solid #999; font-size:1em }}" | "@media only screen and (min-width:768px){ .test  {    border-color: #999999;}}"
    }

    def "test generateThemeSCSSFile"() {
        expect:
        assert themeScssGenerator.checkFileExists(scssFile)
        cleanup:
        new File(scssFile).delete()
    }

    @Unroll
    def "get color from border css property ( )"() {
        expect:
        themeScssGenerator.getColorFromBorder(inputCss.split("\\s+")) == desiredCss

        where:
        inputCss                                                                |   desiredCss

        ""                                                                      |   ""
        "1px solid red"                                                         |   "red"
        "1px red solid"                                                         |   "red"
        "red 1px solid"                                                         |   "red"
        "solid 1px red"                                                         |   "red"
        "solid red 1px"                                                         |   "red"
        "red solid 1px"                                                         |   "red"
        "#ddd solid 1px"                                                        |   "#ddd"
        "solid 1px #ddd"                                                        |   "#ddd"
        "solid medium #ddd"                                                     |   "#ddd"
        "medium thin red"                                                       |   "red"
        "1px dotted rgba(0,10,12,0.1)"                                          |   "rgba(0,10,12,0.1)"
        "none"                                                                  |   ""
        "1px solid"                                                             |   ""
        "solid red"                                                             |   "red"
        "red solid"                                                             |   "red"
        "medium none"                                                           |   ""
        "medium none"                                                           |   ""
    }


    def "test filterCSSProperties ()"() {
        expect:
        themeScssGenerator.filterCSSProperties(inputCss).replaceAll("\\s+", "") == desiredCss
        where:
        inputCss                                                                |   desiredCss

        "font-family: 'lucidaGrande';\nfont-weight: normal;\n"                  |   ""
        "color: #ddd;font-weight: normal; "                                     |   "color:#DDDDDD;"
        "border: 1px solid #ccc"                                                |   "border-color:#CCCCCC;"
        "outline: 10px dotted #eee"                                             |   'outline-color:$themecolor1-4;/*#eee*/'
    }

    def "test formatStyle ()"() {
        expect:
        themeScssGenerator.formatStyleLine(styleName, styleProp, colorThemeVariable) == desiredCss
        where:
        styleName              |   styleProp    | colorThemeVariable            |   desiredCss

        "border-color"         |   "red"        |  '#FF0000'                    | "    border-color: #FF0000;\n"
        "color"                |   " #fff"      |  '$themecolor1_text'          | '    color: $themecolor1_text; /*#fff*/\n'
    }

    @Unroll
    def "test getColorFromBorder ()"() {
        expect:
        themeScssGenerator.getColorFromBorder(styleProp) == desiredCss
        where:
        styleProp                                       |   desiredCss
        ['1px', 'solid']                                |   ""
        ['1em', 'solid', '#eee']                        |   "#eee"
        ['-1em', 'solid', 'rgba(.5,15,255,0.3)']        |   "rgba(.5,15,255,0.3)"
        ['.3em', '#ffffff', 'dotted']                   |   "#ffffff"
        ['solid', 'red']                                |   "red"
        ['red', 'solid']                                |   "red"
        ['medium', 'none']                              |   ""
        ['medium', 'none']                              |   ""

    }

    @Unroll
    def "test getColorFromBackground ()"() {
        expect:
        themeScssGenerator.getColorFromBackground(styleProp) == desiredCss
        where:
        styleProp                                                               |   desiredCss
        ['url(test.png)', 'repeat', 'top', 'right']                             |   ""
        ['black', 'url(test.png)', 'repeat', 'top', 'right']                    |   "black"
        ['#eee', 'url(test.png)', 'no-repeat', 'top', 'right']                  |   "#eee"
        ['#eee', 'url(test.png)', 'repeat-x', '10%', '10%']                     |   "#eee"
        ['#eee', 'url(test.png)', 'repeat-y', '0.3em', '.1em']                  |   "#eee"
        ['rgb(.4,10,20)', 'url(test.png)', 'repeat-y', '0.3em', '.1em']         |   "rgb(.4,10,20)"
    }

    def "test checkForGradient ()"() {
        expect:
        themeScssGenerator.checkForGradient(styleProp) == returnValue
        where:
        styleProp                                                                               |   returnValue
        'url(\'images/primary_button_blue_left_hover.png\') no-repeat'                          |   false
        ' -webkit-linear-gradient(center bottom, #fff 85%, #eee 99%)'                           |   true
        'linear-gradient(to bottom, #fff 85%, #eee 99%) 0 0'                                    |   true
        '#ffffff'                                                                               |   false
    }

    def "test getThemeVariable()" () {
        expect:
        themeScssGenerator.getThemeVariable(color) == themeVariable
        where:
        color                              |   themeVariable
        '#206E9F'                          |   '$themecolor1'
    }
    def "test convertTo6DigitHexColor()" () {
        expect:
        themeScssGenerator.convertTo6DigitHexColor(color) == hexColor
        where:
        color                           |   hexColor
        '#206'                          |   '#220066'
        '#fff'                          |   '#ffffff'
    }
    def "test getHexColorFromRGB()" () {
        expect:
        themeScssGenerator.getHexColorFromRGB(color) == hexColor
        where:
        color                           |   hexColor
        'rgb(10, 20, 30)'               |   '#0a141e'
        'rgba(10, 20, 30, 0.4)'         |   '#0a141e'
        'RgB(10, 20, 30)'               |   '#0a141e'
    }
    def "test getHexColorFromNamedColor()" () {
        expect:
        themeScssGenerator.getHexColorFromNamedColor(colorName) == hexColor
        where:
        colorName           |   hexColor
        'red'               |   '#FF0000'
        'ReD'               |   '#FF0000'
        'DarkSeaGreen'      |   '#8FBC8F'
    }
}  
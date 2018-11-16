/** *****************************************************************************
 Copyright 2009-2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.common

import groovy.io.FileType
import groovy.util.FileNameFinder
import org.apache.log4j.Logger

/**
 * This class is a utility class used to take all the CSS files from *Resources.groovy file and transform into SCSS file
 */
class ThemeScssGenerator {
    private static final Logger log = Logger.getLogger( ThemeScssGenerator.class.name )
    static def baseDirPath = System.properties['base.dir']
    static def colorMap = [
            ALICEBLUE: '#F0F8FF',
            ANTIQUEWHITE: '#FAEBD7',
            AQUA: '#00FFFF',
            AQUAMARINE: '#7FFFD4',
            AZURE: '#F0FFFF',
            BEIGE: '#F5F5DC',
            BISQUE: '#FFE4C4',
            BLACK: '#000000',
            BLANCHEDALMOND: '#FFEBCD',
            BLUE: '#0000FF',
            BLUEVIOLET: '#8A2BE2',
            BROWN: '#A52A2A',
            BURLYWOOD: '#DEB887',
            CADETBLUE: '#5F9EA0',
            CHARTREUSE: '#7FFF00',
            CHOCOLATE: '#D2691E',
            CORAL: '#FF7F50',
            CORNFLOWERBLUE: '#6495ED',
            CORNSILK: '#FFF8DC',
            CRIMSON: '#DC143C',
            CYAN: '#00FFFF',
            DARKBLUE: '#00008B',
            DARKCYAN: '#008B8B',
            DARKGOLDENROD: '#B8860B',
            DARKGRAY: '#A9A9A9',
            DARKGREY: '#A9A9A9',
            DARKGREEN: '#006400',
            DARKKHAKI: '#BDB76B',
            DARKMAGENTA: '#8B008B',
            DARKOLIVEGREEN: '#556B2F',
            DARKORANGE: '#FF8C00',
            DARKORCHID: '#9932CC',
            DARKRED: '#8B0000',
            DARKSALMON: '#E9967A',
            DARKSEAGREEN: '#8FBC8F',
            DARKSLATEBLUE: '#483D8B',
            DARKSLATEGRAY: '#2F4F4F',
            DARKSLATEGREY: '#2F4F4F',
            DARKTURQUOISE: '#00CED1',
            DARKVIOLET: '#9400D3',
            DEEPPINK: '#FF1493',
            DEEPSKYBLUE: '#00BFFF',
            DIMGRAY: '#696969',
            DIMGREY: '#696969',
            DODGERBLUE: '#1E90FF',
            FIREBRICK: '#B22222',
            FLORALWHITE: '#FFFAF0',
            FORESTGREEN: '#228B22',
            FUCHSIA: '#FF00FF',
            GAINSBORO: '#DCDCDC',
            GHOSTWHITE: '#F8F8FF',
            GOLD: '#FFD700',
            GOLDENROD: '#DAA520',
            GRAY: '#808080',
            GREY: '#808080',
            GREEN: '#008000',
            GREENYELLOW: '#ADFF2F',
            HONEYDEW: '#F0FFF0',
            HOTPINK: '#FF69B4',
            INDIANRED: '#CD5C5C',
            INDIGO: '#4B0082',
            IVORY: '#FFFFF0',
            KHAKI: '#F0E68C',
            LAVENDER: '#E6E6FA',
            LAVENDERBLUSH: '#FFF0F5',
            LAWNGREEN: '#7CFC00',
            LEMONCHIFFON: '#FFFACD',
            LIGHTBLUE: '#ADD8E6',
            LIGHTCORAL: '#F08080',
            LIGHTCYAN: '#E0FFFF',
            LIGHTGOLDENRODYELLOW: '#FAFAD2',
            LIGHTGRAY: '#D3D3D3',
            LIGHTGREY: '#D3D3D3',
            LIGHTGREEN: '#90EE90',
            LIGHTPINK: '#FFB6C1',
            LIGHTSALMON: '#FFA07A',
            LIGHTSEAGREEN: '#20B2AA',
            LIGHTSKYBLUE: '#87CEFA',
            LIGHTSLATEGRAY: '#778899',
            LIGHTSLATEGREY: '#778899',
            LIGHTSTEELBLUE: '#B0C4DE',
            LIGHTYELLOW: '#FFFFE0',
            LIME: '#00FF00',
            LIMEGREEN: '#32CD32',
            LINEN: '#FAF0E6',
            MAGENTA: '#FF00FF',
            MAROON: '#800000',
            MEDIUMAQUAMARINE: '#66CDAA',
            MEDIUMBLUE: '#0000CD',
            MEDIUMORCHID: '#BA55D3',
            MEDIUMPURPLE: '#9370DB',
            MEDIUMSEAGREEN: '#3CB371',
            MEDIUMSLATEBLUE: '#7B68EE',
            MEDIUMSPRINGGREEN: '#00FA9A',
            MEDIUMTURQUOISE: '#48D1CC',
            MEDIUMVIOLETRED: '#C71585',
            MIDNIGHTBLUE: '#191970',
            MINTCREAM: '#F5FFFA',
            MISTYROSE: '#FFE4E1',
            MOCCASIN: '#FFE4B5',
            NAVAJOWHITE: '#FFDEAD',
            NAVY: '#000080',
            OLDLACE: '#FDF5E6',
            OLIVE: '#808000',
            OLIVEDRAB: '#6B8E23',
            ORANGE: '#FFA500',
            ORANGERED: '#FF4500',
            ORCHID: '#DA70D6',
            PALEGOLDENROD: '#EEE8AA',
            PALEGREEN: '#98FB98',
            PALETURQUOISE: '#AFEEEE',
            PALEVIOLETRED: '#DB7093',
            PAPAYAWHIP: '#FFEFD5',
            PEACHPUFF: '#FFDAB9',
            PERU: '#CD853F',
            PINK: '#FFC0CB',
            PLUM: '#DDA0DD',
            POWDERBLUE: '#B0E0E6',
            PURPLE: '#800080',
            REBECCAPURPLE: '#663399',
            RED: '#FF0000',
            ROSYBROWN: '#BC8F8F',
            ROYALBLUE: '#4169E1',
            SADDLEBROWN: '#8B4513',
            SALMON: '#FA8072',
            SANDYBROWN: '#F4A460',
            SEAGREEN: '#2E8B57',
            SEASHELL: '#FFF5EE',
            SIENNA: '#A0522D',
            SILVER: '#C0C0C0',
            SKYBLUE: '#87CEEB',
            SLATEBLUE: '#6A5ACD',
            SLATEGRAY: '#708090',
            SLATEGREY: '#708090',
            SNOW: '#FFFAFA',
            SPRINGGREEN: '#00FF7F',
            STEELBLUE: '#4682B4',
            TAN: '#D2B48C',
            TEAL: '#008080',
            THISTLE: '#D8BFD8',
            TOMATO: '#FF6347',
            TURQUOISE: '#40E0D0',
            VIOLET: '#EE82EE',
            WHEAT: '#F5DEB3',
            WHITE: '#FFFFFF',
            WHITESMOKE: '#F5F5F5',
            YELLOW: '#FFFF00',
            YELLOWGREEN: '#9ACD32'
    ]
/* Example theme.json with standard starting colors

eds2 color generation
The *-1 becomes *-active, *-2 becomes *-hover, and *-5 becomes *-light (much less saturated)
"color1":"#5353D1","color1-hover":"#4747ac","color1-active":"#3a3b87","color1-light":"#f6f6fd","color1_text":"#ffffff",
"color1_dark":"#3a3b87","color1_dark_text":"#ffffff","color1_light":"#f6f6fd","color1_light_text":"#151618",
"color1-0":"#0b0b28","color1-1":"#3a3b87","color1-2":"#4747ac","color1-3":"#3636c9","color1-4":"#afafe9","color1-5":"#f6f6fd",

"color2":"#51ABFF","color2-hover":"#458dd1","color2-active":"#396fa3","color2-light":"#f6fbff","color2_text":"#151618",
"color2_dark":"#396fa3","color2_dark_text":"#ffffff","color2_light":"#f6fbff","color2_light_text":"#151618",
"color2-0":"#001a33","color2-1":"#396fa3","color2-2":"#458dd1","color2-3":"#0084ff","color2-4":"#99ceff","color2-5":"#f6fbff",

"color3":"#026BC8","color3-hover":"#065aa5","color3-active":"#0a4982","color3-light":"#f2f8fc","color3_text":"#ffffff",
"color3_dark":"#0a4982","color3_dark_text":"#ffffff","color3_light":"#f2f8fc","color3_light_text":"#151618",
"color3-0":"#011b32","color3-1":"#0a4982","color3-2":"#065aa5","color3-3":"#0387fc","color3-4":"#9acffe","color3-5":"#f2f8fc",

// old color generation

"color1":"#5353D1","color1_text":"#ffffff",
"color1-0":"#0b0b28","color1-1":"#161650","color1-2":"#26268d","color1-3":"#3636c9","color1-4":"#afafe9","color1-5":"#d7d7f4",
"color1_dark":"#1b1b65","color1_dark_text":"#cccccc","color1_light":"#d7d7f4","color1_light_text":"#333333",

"color2":"#51ABFF","color2_text":"#333333",
"color2-0":"#001a33","color2-1":"#003566","color2-2":"#005cb3","color2-3":"#0084ff","color2-4":"#99ceff","color2-5":"#cce6ff",
"color2_dark":"#004280","color2_dark_text":"#cccccc","color2_light":"#cce6ff","color2_light_text":"#333333",

"color3":"#026BC8", "color3_text":"#ffffff",
"color3-0":"#011b32", "color3-1":"#013665", "color3-2":"#025fb1", "color3-3":"#0387fc", "color3-4":"#9acffe", "color3-5":"#cde7fe",
"color3_dark":"#01447e", "color3_dark_text":"#cccccc", "color3_light":"#cde7fe", "color3_light_text":"#333333",
*/

    static def themeColorVariablesMap = [
        // map colors used in our applications to the appropriate theme color variables.

        // When mapping EDS2 compliant applications to themecolors, each color should be used
        // consistently with the correct meaning. Non-standard colors listed below should be
        // replaced with a theme color that gives a similar brightness and saturation.

        // Colors used in Banner Platform w/ EDS2 Phase 1 in ETE updated color generation, -1 =
        // -active, -2 = -hover, -5 =-light using the numbers here allows older theme editors to
        // work with the templates, even if colors aren't exactly the same.

        // colors in comments come from sample EDS2 theme above

        '#5353d1': '$themecolor1',
        '#4845B8': '$themecolor1-1', //-active
        '#51ABFF': '$themecolor2',
        '#81C8FF': '$themecolor2-4', //#99ceff
        '#026BC8': '$themecolor3',
        '#0A4982': '$themecolor3-1', //-active
        '#065AA5': '$themecolor3-2', //-hover
        '#EFF4F8': '$themecolor1-5', //#f6f6fd ** slightly under-saturated and brighter, but OK


        // also retain support for legacy colors used in banner applications so the generator can be
        // used with any version of our apps

        // When using the user-selected themecolorN values, as opposed to the derived colors as a
        // background or foreground color, the opposing foreground or background color must be
        // specified as themecolorN-text to ensure sufficient contrast. This may require entries in
        // the -patch file.

        // Strong colors should be mapped to colors of similar brightness to preserve contrast.
        // "Dark" colors are 0-3, and should be paired with a "light" text color.  4-5 are "light"
        // colors and need a dark text color.

        // Very light colors may not show their hue unless compared against a similar background on
        // a good monitor! (e.g., the blue of #EFF4F8 may not be easily apparent, but shows up
        // against #f4f4f4). These may be replaced with a corresponding -light/-5 color, or it may
        // be more appropriate to make them a grey by averaging the hex values.

        // If the application is not consistent in its use of color, it may require entries in the
        // -patch file to correct the color mapping for specific elements, or possibly addition of
        // colors to the mapping below (comment the source of the colors).

        // Our older applications also used a lot of slightly-different shades throughout the
        // UI. The theme colors will thus necessarily map many different colors to the shame
        // variable. This reduces color variation in the UI.  Conversely, some of the older color
        // shades may not be appropriate to replace any of the colors identified in the
        // applications.

        // Text should generally be black or white (or close), but not a strong hue.

        '#206E9F': '$themecolor1',
        '#194F85': '$themecolor1-1', //#3a3b87
        '#005C96': '$themecolor1-1',
        '#0C4E8C': '$themecolor1-1',

        '#1B6496': '$themecolor1-2', //#4747ac
        '#13689E': '$themecolor1-2',
        '#11679D': '$themecolor1-2',
        '#1B6496': '$themecolor1-2',

        '#3875D7': '$themecolor1-3', //#3636c9
        '#0C60A6': '$themecolor1-3',
        '#3875D7': '$themecolor1-3',
        '#337AB7': '$themecolor1-3',
        '#336699': '$themecolor1-3',
        '#2A6496': '$themecolor3-1', // bootstrap link hover/focus
        '#3A87AD': '$themecolor1-3',
        '#3276B1': '$themecolor1-3',
        '#357EBD': '$themecolor1-3',
        '#357EBD': '$themecolor1-3',
        '#225A85': '$themecolor1-3',
        '#2E6EBE': '$themecolor1-3',
        '#0989D7': '$themecolor1-3',
        '#3A87AD': '$themecolor1-3',

        '#4282B3': '$themecolor1-3', //#3636c9 These were 1-4, but not enough contrast with light text
        '#477B9C': '$themecolor1-3',
        '#477B9C': '$themecolor1-3',
        '#2477C1': '$themecolor1-3',
        '#3071A9': '$themecolor1-3',
        '#0C8CB4': '$themecolor1-3',

        '#7FADCA': '$themecolor1-4', //#afafe9 was 1-2, but that doesn't have enough contrast with dark text
        '#46B8DA': '$themecolor1-4', //#afafe9 these were 1-3, but not enough contrast with dark text
        '#39B3D7': '$themecolor1-4',
        '#39B3D7': '$themecolor1-4',

        '#5897FB': '$themecolor1-4', //#afafe9
        '#B0DEEC': '$themecolor1-4',
        '#5897FB': '$themecolor1-4',
        '#428BCA': '$themecolor3', //bootstrap link color
        '#66AFE9': '$themecolor1-4',
        '#5BC0DE': '$themecolor1-4',
        '#428BCA': '$themecolor1-4',
        '#31B0D5': '$themecolor1-4',
        '#BCE8F1': '$themecolor1-4',
        '#A6E1EC': '$themecolor1-4',
        '#B0DEEC': '$themecolor1-4',
        '#B2DEEB': '$themecolor1-4',

        '#E1EFFD': '$themecolor1-5', //#f6f6fd
        '#F3FCFF': '$themecolor1-5',
        '#D9E7EF': '$themecolor1-5',

        '#0084D5': '$themecolor2-3', //#0084ff
        '#0099FF': '$themecolor2-3',

        '#9ECAED': '$themecolor3-4', //#9acffe
        '#9ECAED': '$themecolor3-4',


        // these are near-grey or medium-brightness colors that should probably just be mapped to
        // grey rather than introduce strong colors from EDS2.  These are judgement calls.

        '#41566F': '#575757',
        '#4F585F': '#585858',
        '#515A61': '#595959',
        '#557287': '#656565',
        '#719CAC': '#939393',
        '#778FA0': '#8c8c8c',
        '#778FA0': '#a2a2a2',
        '#7F9AAD': '#979797',
        '#869FB1': '#9c9c9c',
        '#98AEBE': '#aeaeae',
        '#9AC0D2': '#b9b9b9',
        '#9FBED4': '#bbbbbb',
        '#B1CEE0': '#cacaca',
        '#B2CEDE': '#cacaca',
        '#B2CEDF': '#cacaca',
        '#BECCD7': '#cbcbcb',
        '#CAD5DE': '#d5d5d5',
        '#CCDFE9': '#dcdcdc',
        '#D0DBDE': '#d5d5d5',
        '#DEE5E7': '#e3e3e3',
        '#E0E6EB': '#e5e5e5',
        '#E3E6E8': '#e6e6e6',
        '#F3F7F8': '#f5f5f5'

    ]

    static {
        def newMap = [:]
        themeColorVariablesMap.each { key, value ->
            newMap[ key.toUpperCase() ] = value
        }
        themeColorVariablesMap = newMap
        log.debug themeColorVariablesMap
    }

    def checkFileExists(file) {
        new File(file).exists() ? true : false
    }

    def removeCommentedStyles(css) {
        css = css.toString().replaceAll("(?s)/\\*.*?\\*/", "")
        return css
    }

    def appendToScssFile(scss, scssFileName, sourceCSSFile) {
        File file = new File(scssFileName)
        def sourceFileComment = "\n/* "+sourceCSSFile.getName()+" */\n"
        file.append(sourceFileComment)
        file.append(scss)
    }

    def createCSSEntryFromDSL(CSS_DSL) {
        int numberOfCss = CSS_DSL.size()
        int cssCounter = 0;
        StringBuilder cssEntry = new StringBuilder()
        CSS_DSL.each { DSLEntryCSS ->
            cssEntry.append(DSLEntryCSS["CLASS_NAME"] + " {\n")
            cssEntry.append(DSLEntryCSS["CSS"])
            cssEntry.append("}")
            cssCounter++
        }
        return cssEntry.toString();
    }

    def getCSSDSL(srcText) {

        def safeText = srcText
        def CSSClasses = safeText.split("}")
        def CSSDSL = []

        CSSClasses.each { fs ->
            def secondSplit = fs.toString().split("\\{")
            if (secondSplit.length > 1) {
                def DSLEntry = [:]
                DSLEntry.put("CLASS_NAME", secondSplit[0])
                if (secondSplit[1].trim().isEmpty()) {
                    DSLEntry.put("CSS", secondSplit[1].trim())
                }
                else {
                    DSLEntry.put("CSS", secondSplit[1].trim())
                }
                CSSDSL.add(DSLEntry)
            }

        }
        return CSSDSL;
    }

    List getMediaQueries(srcText) {
        def mediaQueryRegExp = /(?m)@media[\S\s]*?}[\s]*[*\/]*[\s]*}/
        List mediaQueryList = new ArrayList()

        srcText.eachMatch(mediaQueryRegExp) { match ->
            mediaQueryList.add(match)
        }
        return mediaQueryList
    }

    String removeMediaQueriesFromSource(srcText, List mediaQueries) {
        int numberOfMediaQueries = mediaQueries.size()

        String textFileWithoutMediaQueries = srcText;
        for(int counter = 0; counter < numberOfMediaQueries; counter++) {
            textFileWithoutMediaQueries = textFileWithoutMediaQueries.replace(mediaQueries.get(counter), "")
        }
        return textFileWithoutMediaQueries
    }

    String filterMediaQueriesCSS(List mediaQueries) {
        int numberOfMediaQueries = mediaQueries.size();
        StringBuilder mediaQueryCss = new StringBuilder()

        for(int counter = 0; counter < numberOfMediaQueries; counter++) {
            String mediaQuery = mediaQueries[counter];

            def matcher = mediaQuery =~ /@media[\S\s]*?\{/
            String mediaLine = matcher[0]
            String mediaQueryCssStr = mediaQueries[counter].replace(mediaLine, "")
            def CSS_DSL = getCSSDSL(mediaQueryCssStr)
            def filteredCSSDSL = filterCSSDSL(CSS_DSL)
            if(filteredCSSDSL) {
                StringBuilder filteredCss = new StringBuilder(mediaLine)
                filteredCss.append(createCSSEntryFromDSL(filteredCSSDSL))
                filteredCss.append("\n")
                filteredCss.append("}")
                filteredCss.append("\n")
                mediaQueryCss.append(filteredCss.toString())
            }
        }
        return mediaQueryCss.toString();
    }
    List filterCSSDSL(CSSDSL) {
        List filteredCSSDSL = []
        CSSDSL.each { DSLEntry ->
            def DSLEntryCSS = DSLEntry["CSS"]
            def newDSLEntryCSS = filterCSSProperties(DSLEntryCSS)
            if(newDSLEntryCSS) {
                def newDSLEntry = [:]
                newDSLEntry.put("CLASS_NAME", DSLEntry["CLASS_NAME"])
                newDSLEntry.put("CSS", newDSLEntryCSS)
                filteredCSSDSL.add(newDSLEntry)
            }
        }
        return filteredCSSDSL
    }

    def formatStyleLine(String styleName, String styleProp, String colorThemeVariable) {
        def styleLine = "    " + styleName.toString().trim() + ": "
        if(colorThemeVariable.contains('$themecolor')) {
            styleLine+= colorThemeVariable.toString().trim() + "; /*"+styleProp.trim()+"*/"
        } else {
            styleLine+= colorThemeVariable.toString().trim() + ";"
        }
        styleLine+="\n"
        return  styleLine
    }

    def getStyleArrayFromLine(String styleLine) {
        def positionOfColon = styleLine.indexOf(":")
        def styleName = ''
        def styleProp = ''
        String[] styleArray

        if (positionOfColon >= 0) {
            styleName = styleLine.substring(0, positionOfColon)
            styleProp = styleLine.substring(positionOfColon + 1, styleLine.length())
            styleArray = [styleName, styleProp]
        }
        else {
            styleArray = [styleName]
        }

        return styleArray
    }


    def getColorFromBorder(cssBorderValue) {
        /* borde property shorthand:
          <border-style>, <border-width>, <border-color>
          variation in the order would be there
         */
        def borderPropsRegex = ['medium', 'thin', 'thick', '\\d.*', '\\..*', '-.*', 'dotted', 'dashed', 'solid',
                                'double', 'groove', 'ridge', 'inset', 'outset', '0', 'none', 'auto', '^(?!rgb)'
        ]
        def colorPropVal
        colorPropVal = cssBorderValue.find {
            str -> !(borderPropsRegex.any{str.matches(it)})
        }
        return colorPropVal ? colorPropVal : ''
    }

    def getColorFromBackground(cssBackgroundValue) {
        /*  background property shorthand:
            <background-color>, <background-image>, <background-repeat>, <background-attachment>, <background-position>
            variation in the order would be there
        */
        def backgroundPropertiesRegex= ['none', '.*repeat.*', 'scroll', 'fixed', 'local', '\\d.*', '\\..*',
                                        '-.*', 'url.*', "right", 'left', 'top', 'bottom', 'center', '^(?!rgb)'
        ]
        def backgroundColorPropVal = cssBackgroundValue.find {
            str -> !(backgroundPropertiesRegex.any{str.matches(it)})
        }
        return backgroundColorPropVal ? backgroundColorPropVal : ''
    }
    def checkForGradient(cssProp) {
        cssProp.contains('-gradient') ? true: false
    }

    def filterCSSProperties(CSSEntry) {
        def styles = CSSEntry.toString().split(";")
        def newCSSEntry = "";
        def gradientReplaced

        styles.each { styleLine ->
            def style = getStyleArrayFromLine(styleLine)//styleLine.split(":")

            if (style.length > 1) {
                def styleName = style[0].trim()
                def styleProp = style[1].trim()
                def isImportant = styleProp.toLowerCase().contains("!important")
                def newStyleName
                def newStyleProp
                styleProp = styleProp.replaceAll(",\\s+", ",").minus("!important").trim() //Convert ", " to ","

                switch (styleName) {
                    case 'color':
                    case 'background-color':
                    case 'border-color':
                    case 'border-top-color':
                    case 'border-right-color':
                    case 'border-bottom-color':
                    case 'border-left-color':
                    case 'outline-color':
                    case 'text-decoration-color':
                    case 'column-rule-color':
                        newStyleName = styleName
                        newStyleProp = styleProp
                        break;
                    case 'border':
                    case 'border-top':
                    case 'border-right':
                    case 'border-bottom':
                    case 'border-left':
                    case 'outline':
                    case 'column-rule':
                        def stylePropSplit = styleProp.split("\\s+");
                        newStyleProp = getColorFromBorder(stylePropSplit)
                        if(newStyleProp) {
                            newStyleName = styleName + '-color'
                        }
                        break;
                    case 'background':
                        if(!gradientReplaced) {
                            if (checkForGradient(styleProp)) {
                                newStyleName = 'background-image'
                                newStyleProp = 'none'
                                gradientReplaced = true
                            } else {
                                def stylePropSplit = styleProp.split("\\s+");
                                newStyleProp = getColorFromBackground(stylePropSplit)
                                if (newStyleProp) {
                                    newStyleName = styleName + '-color'
                                }
                            }
                        }
                        break;
                    case 'background-image':
                        if (!gradientReplaced) {
                            if (checkForGradient(styleProp)) {
                                newStyleName = 'background-image'
                                newStyleProp = 'none'
                                gradientReplaced = true
                            }
                        }
                        break;
                    default:
                        break
                }
                def colorThemeVariable
                def newStyle
                if(newStyleName && newStyleProp) {
                    if(newStyleName!='background-image') {
                        colorThemeVariable = getThemeVariable(newStyleProp)
                    }
                    if(colorThemeVariable) {
                        if (isImportant) {
                            colorThemeVariable += " !important"
                        }
                        newStyle = formatStyleLine(newStyleName, newStyleProp, colorThemeVariable)

                        newCSSEntry += newStyle
                    }
                }
            }
        }
        return newCSSEntry
    }

    def getThemeVariable(String colorProp) {
        def cssPropsFilter = ['transparent', 'initial', 'inherit']
        def cssPropMatched = cssPropsFilter.any{
            colorProp.toLowerCase().contains(it)
        }
        colorProp = cssPropMatched ? '' : replaceWithThemeVariables(colorProp)
        return colorProp
    }

    def generateSCSS(srcText) {
        List mediaQueries = getMediaQueries(srcText)

        def textWithoutMediaQueries = removeMediaQueriesFromSource(srcText, mediaQueries)
        String mediaQueriesCSS
        if(mediaQueries) {
            mediaQueriesCSS = filterMediaQueriesCSS(mediaQueries)
        }

        textWithoutMediaQueries = removeCommentedStyles(textWithoutMediaQueries)
        def CSS_DSL = getCSSDSL(textWithoutMediaQueries)
        def NEW_CSS_DSL = filterCSSDSL(CSS_DSL)
        def css = createCSSEntryFromDSL( NEW_CSS_DSL ) + (
                mediaQueriesCSS ?  mediaQueriesCSS  : "" )

        return css
    }

    def getCSSFiles(dir) {
        def files = []

        log.debug "Looking for CSS files in ${dir}"
        dir.traverse(type: FileType.FILES, nameFilter: ~/.*Resources\.groovy/) { file ->

            def fileText = file.text

            def regexCSSResource = ~/resource url(.+?).css('|")/
            def regexDir = ~/dir:('|")(.+?)('|")/
            def regexPlugin = ~/plugin:('|")(.+?)('|")/
            def regexCssFile = ~/file:('|")(.+?)('|")/    /*' terminate string for highlighting */

            def matcherResource = regexCSSResource.matcher(fileText)
            def matcherDir
            def matcherPlugin
            def matcherCSSFile

            def resourceStr
            def directory
            def plugin
            def cssFile
            def fileTmpStr

            while(matcherResource.find()){
                resourceStr = matcherResource.group(0)
                if (!resourceStr.contains('rtl')) {
                    log.debug "Looking at resource ${resourceStr}"
                    resourceStr = resourceStr.replace(" ", "")
                    matcherDir = regexDir.matcher(resourceStr)
                    while (matcherDir.find()) {
                        directory = matcherDir.group(2)
                    }
                    plugin = null
                    matcherPlugin = regexPlugin.matcher(resourceStr)
                    while (matcherPlugin.find()) {
                        plugin = matcherPlugin.group(2).replace("-", "_") + '.git' + '/web-app/'
                        if(!baseDirPath.contains('/plugins')) {
                            plugin = checkFileExists(baseDirPath+"/plugins/"+plugin) ? plugin : plugin.replace("_", "-")
                        }else{
                            plugin = checkFileExists(baseDirPath) ? plugin : plugin.replace("_", "-")
                        }
                        log.debug "Identified plugin - translated ${matcherPlugin.group(2)} to ${plugin}"
                    }
                    matcherCSSFile = regexCssFile.matcher(resourceStr)
                    while (matcherCSSFile.find()) {
                        fileTmpStr = matcherCSSFile.group(2)
                        log.debug "Matched CSS file from ${resourceStr} found ${fileTmpStr}"
                    }
                }
                if(directory) {
                    fileTmpStr = directory+"/"+fileTmpStr
                }
                if(!baseDirPath.contains('/plugins')) {
                    cssFile = plugin ? "/plugins/" + plugin + fileTmpStr : '/web-app/' + fileTmpStr
                }else{
                    cssFile =  '/web-app/' + fileTmpStr
                }
                log.debug "Checking if file exists: ${cssFile}"
                if(checkFileExists(baseDirPath+cssFile)) {
                    files << ["file": new File(baseDirPath + cssFile)]
                    log.debug "Found CSS file: ${cssFile}"
                } else {
                    log.error "Cannot find CSS file: ${baseDirPath+cssFile}"
                }
            }
        }
        files
    }

    def orderCSSFiles(cssFiles) {
        def pluginOrder = ['sghe_aurora.git', 'i18n_core.git', 'banner_ui_ss.git']
        def orderedCSSFiles = []
        orderedCSSFiles.addAll(cssFiles.file.findAll{ File file ->
            file.toURI().toString().contains(pluginOrder[0])}
        )
        orderedCSSFiles.addAll(cssFiles.file.findAll{File file ->
            file.toURI().toString().contains(pluginOrder[1])}
        )
        orderedCSSFiles.addAll(cssFiles.file.findAll{File file ->
            file.toURI().toString().contains(pluginOrder[2])}
        )
        orderedCSSFiles.addAll(cssFiles.file.findAll{File file ->
            (file.toURI().toString().contains('/plugins/') && !pluginOrder.any{file.getAbsolutePath().contains(it)})
        })
        orderedCSSFiles.addAll(cssFiles.file.findAll{!it.toURI().toString().contains('/plugins/')})
        return orderedCSSFiles
    }

    def getHexColor(String color) {
        def hexColorCode
        color = color.trim()
        if(color.toLowerCase() ==~ /^rgb[^a].*/ ) { /* hex codes don't support alpha transparency, so keep them as rgba */
            hexColorCode = getHexColorFromRGB(color)
        } else {
            hexColorCode = getHexColorFromNamedColor(color)
        }
        return hexColorCode ? hexColorCode : ''
    }

    def getHexColorFromNamedColor(String namedColor) {
        def hexColorCode = colorMap[namedColor.toUpperCase()]
        return hexColorCode ? hexColorCode : ''
    }

    def getHexColorFromRGB(String color) {
        def rgbArray = (color =~ /\((.*?)\)/)[ 0 ][ 1 ].split(",")
        int red   = rgbArray[0].toInteger()
        int green = rgbArray[1].toInteger()
        int blue  = rgbArray[2].toInteger()
        def hexColor = String.format("#%02x%02x%02x", red, green, blue)
        return hexColor
    }

    def convertTo6DigitHexColor(String threeDigitHexColor) {
        String red = threeDigitHexColor.substring(1, 2)
        String green = threeDigitHexColor.substring(2, 3)
        String blue = threeDigitHexColor.substring(3, 4)
        String rgb = red.multiply(2) + green.multiply(2) + blue.multiply(2)
        String hexColor =  '#'+ rgb
        return hexColor
    }

    def replaceWithThemeVariables(String color) {
        def variable
        if(color.startsWith('#')) {
            if(color.length() == 4) {
                color = convertTo6DigitHexColor(color)
            }
        } else {
            color = getHexColor(color)
        }
        color = color.toUpperCase()
        variable = themeColorVariablesMap[color] ? themeColorVariablesMap[color]: color
        return variable
    }

    def appendFile(String fileStr, String SCSSFile) {
        File fileToAppend = new File(fileStr)
        if(fileToAppend.exists()) {
            log.debug "Appending patch file ${fileStr} at offset ${new File( SCSSFile ).length()}"
            appendToScssFile(fileToAppend.text, SCSSFile, fileToAppend)
        }
    }

    /**
     * appends the SCSSPatch file corresponding to a .CSS file
     */
    def appendSCSSPatchFile(String cssFileName, String outputFileName) {
        String patchFilename = cssFileName.substring(0, cssFileName.lastIndexOf('.'))+'-patch.scss'
        log.debug "Css: ${cssFileName} patch: ${patchFilename} out: ${outputFileName}"
        appendFile( patchFilename, outputFileName )
    }

    def appendCommonPatchFile( String scssFile ) {
        def names = new FileNameFinder().getFileNames(baseDirPath, '**/banner-theme-common-patch.scss' )
        if ( names ) {
            appendFile( names[0], scssFile )
            log.debug "Appended banner-theme-common-patch.scss file"
        }
    }

    def writeHeader( scssFile, appName, appVersion ) {
        def message = "/*\n  $scssFile.name\n  application: $appName\n  application version: $appVersion\n*/\n"
        scssFile.append( message )
    }

    public generateThemeSCSSFile(String SCSSFile, String appName, String appVersion) {
        def cssFiles = []
        def SCSS
        def scssFile = new File(SCSSFile)

        checkFileExists(SCSSFile) ? scssFile.delete() : scssFile.getParentFile().mkdirs()

        cssFiles.addAll(getCSSFiles(new File("${baseDirPath}/grails-app/conf/")))
        if (new File("${baseDirPath}/plugins/").exists()) {
            cssFiles.addAll(getCSSFiles(new File("${baseDirPath}/plugins/")))
        }
        cssFiles = cssFiles.unique()
        cssFiles = orderCSSFiles(cssFiles)
        if (cssFiles) {
            if(scssFile.getParentFile().exists()) {
                writeHeader( scssFile, appName, appVersion );
                cssFiles.each { File file ->
                    if(file.exists()) {
                        SCSS = generateSCSS(file.text)
                        if (SCSS) {
                            appendToScssFile(SCSS, SCSSFile, file)
                        }
                    }
                }
            }
        }
        appendCommonPatchFile(SCSSFile)
        appendSCSSPatchFile("web-app/css/theme/${appName}.scss", SCSSFile ) // allow SCSSFile to be in a different directory
        println "Generated theme '${SCSSFile}' from ${cssFiles.size()} CSS files"
    }
}

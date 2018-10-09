/** *****************************************************************************
 Copyright 2009-2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.common

import groovy.io.FileType
import groovy.util.FileNameFinder

/**
 * This class is a utility class used to take all the CSS files from *Resources.groovy file and transform into SCSS file
 */
class ThemeScssGenerator {
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
    static def themColorVariablesMap = [
            '#5353D1': '$themecolor1',
            '#4845B8': '$themecolor1-active',
            '#51ABFF': '$themecolor2',
            '#81C8FF': '$themecolor2-4',
            '#026BC8': '$themecolor3',
            '#0A4982': '$themecolor3-active',
            '#065AA5': '$themecolor3-hover',
            '#F2F8FC': '$themecolor3-light',
            '#EFF4F8': '$themecolor1-5',
            '#557287': '$themecolor1-2',
            '#BECCD7': '$themecolor1-4'
    ]
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

        //System.out.println "Looking for CSS files in ${dir}"
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
                    //System.out.println "Looking at resource ${resourceStr}"
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
                        //System.out.println "Identified plugin - translated ${matcherPlugin.group(2)} to ${plugin}"
                    }
                    matcherCSSFile = regexCssFile.matcher(resourceStr)
                    while (matcherCSSFile.find()) {
                        fileTmpStr = matcherCSSFile.group(2)
                        //System.out.println "Matched CSS file from ${resourceStr} found ${fileTmpStr}"
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
                //System.out.println "Checking if file exists: ${cssFile}"
                if(checkFileExists(baseDirPath+cssFile)) {
                    files << ["file": new File(baseDirPath + cssFile)]
                    //System.out.println "Found CSS file: ${cssFile}"
                } else {
                    System.err.println "Cannot find CSS file: ${baseDirPath+cssFile}"
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
        variable = themColorVariablesMap[color] ? themColorVariablesMap[color]: color
        return variable
    }

    def appendFile(String filename, String SCSSFile) {
        File fileToAppend = new File(filename)
        if(fileToAppend.exists()) {
            log.debug "Appending patch file ${filename} at offset ${new File( SCSSFile ).length()}"
            appendToScssFile(fileToAppend.text, SCSSFile, fileToAppend)
        }
    }

    def appendSCSSPatchFile(String SCSSFile) {
        String patchFilename = SCSSFile.substring(0, SCSSFile.indexOf('.scss'))+'-patch.scss'
        appendFile( patchFilename, SCSSFile )
    }

    def appendCommonPatchFile( String scssFile ) {
        def names = new FileNameFinder().getFileNames(baseDirPath, '**/banner-theme-common-patch.scss' )
        if ( names ) {
            appendFile( names[0], scssFile )
        }
    }

    public generateThemeSCSSFile(String SCSSFile) {
        def cssFiles = []
        def SCSS

        checkFileExists(SCSSFile) ? new File(SCSSFile).delete() : new File(SCSSFile).getParentFile().mkdirs()

        cssFiles.addAll(getCSSFiles(new File("${baseDirPath}/grails-app/conf/")))
        if (new File("${baseDirPath}/plugins/").exists()) {
            cssFiles.addAll(getCSSFiles(new File("${baseDirPath}/plugins/")))
        }
        cssFiles = cssFiles.unique()
        cssFiles = orderCSSFiles(cssFiles)
        if (cssFiles) {
            checkFileExists(SCSSFile) ? new File(SCSSFile).delete() : new File(SCSSFile).getParentFile().mkdirs()
            if(new File(SCSSFile).getParentFile().exists()) {
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
        appendSCSSPatchFile(SCSSFile)
        println "Generated theme '${SCSSFile}' from ${cssFiles.size()} CSS files"
    }
}

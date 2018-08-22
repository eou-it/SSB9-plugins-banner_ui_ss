/** *****************************************************************************
 Copyright 2009 - 2014 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.common


import java.util.regex.Pattern
import groovy.io.FileType

/**
 * This class is a utility class used to take as input a CSS file that is created to support left to right languages
 * and generate a right to left equivalent.
 */
class RtlCssGenerator {
    /* Need to move this out */


    def loadFile(fileName) {
        srcFile = new File(fileName)
    }


    def removeCommentedStyles(style) {
        style = style.toString().replaceAll("/\\*(.|[\r\n])*?\\*/", "")
        return style
    }


    def getCSSDSL(srcText) {
        // comments with { or } will mess up the splits below, because
        // comments will appear to span CSSClasses

        // $/ ... /$ - groovy "dollar slashy" string avoids need to escape backslash \
        //   /\* ... \*/ - CSS comment begin/end, with exact-match * character
        //     ((?!\*/).) - negative lookahead - match characters that aren't preceded by */
        //     [{}] match either { or }
        // collectively:
        //     match comment open
        //     all characters not preceded by comment close
        //     at least one { or }
        //     all characters not preceded by comment close
        //     comment close.
        String unsafeCommentPattern = $//\*((?!\*/).)*[{}]((?!\*/).)*\*//$
        Pattern unsafeComments = Pattern.compile( unsafeCommentPattern, Pattern.DOTALL )
        def safeText = unsafeComments.matcher( srcText ).replaceAll( '' )
        def CSSClasses = safeText.split("}")
        def CSSDSL = [];

        CSSClasses.each { fs ->
            def secondSplit = fs.toString().split("\\{")
            if (secondSplit.length > 1) {
                def DSLEntry = [:]
                secondSplit[1] = removeCommentedStyles(secondSplit[1])

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


    def formatStyleLine(styleName, styleProp) {
        "    " + styleName + ":" + styleProp + ";\n"
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



    def convertCSSToRTL(CSSEntry) {
        def styles = CSSEntry.toString().split(";(?=(?:[^()]*\\([^()]*\\))*[^()]*\$)")
        def newCSSEntry = "";

        styles.each { styleLine ->
            def style = getStyleArrayFromLine(styleLine)//styleLine.split(":")

            if (style.length > 1) {
                def styleName = style[0].trim()
                def styleProp = style[1].trim()
                def isImportant = styleProp.toLowerCase().contains("!important")
                styleProp = styleProp.minus("!important").trim()

                switch (styleName) {
                    case 'direction':
                        if (styleProp.toLowerCase() == 'rtl') {
                            styleProp = 'ltr';
                        }
                        else if (styleProp.toLowerCase() == 'ltr') {
                            styleProp = 'rtl';
                        }
                        break;
                    case 'float':
                        if (styleProp.toLowerCase() == 'left') {
                            styleProp = 'right';
                        }
                        else if (styleProp.toLowerCase() == 'right') {
                            styleProp = 'left';
                        }
                        break;
                    case 'margin':
                        def stylePropSplit = styleProp.split("\\s+");
                        if (stylePropSplit.length == 4) {
                            def right = stylePropSplit[1];
                            def left = stylePropSplit[3];
                            stylePropSplit[1] = left;
                            stylePropSplit[3] = right;
                        }
                        styleProp = stylePropSplit.join(" ");
                        break;
                    case 'margin-left':
                        styleName = 'margin-right';
                        break;
                    case 'margin-right':
                        styleName = 'margin-left';
                        break;
                    case 'padding':
                        def stylePropSplit = styleProp.split("\\s+");
                        if (stylePropSplit.length == 4) {
                            def right = stylePropSplit[1];
                            def left = stylePropSplit[3];
                            stylePropSplit[1] = left;
                            stylePropSplit[3] = right;
                        }
                        styleProp = stylePropSplit.join(" ");
                        break;
                    case 'padding-left':
                        styleName = 'padding-right';
                        break;
                    case 'padding-right':
                        styleName = 'padding-left';
                        break;
                    case 'text-align':
                        if (styleProp.toLowerCase() == 'left') {
                            styleProp = 'right';
                        }
                        else if (styleProp.toLowerCase() == 'right') {
                            styleProp = 'left';
                        }
                        break;
                    case 'left':
                        styleName = 'right';
                        break;
                    case 'right':
                        styleName = 'left';
                        break;
                /**
                 * border-left
                 */
                    case 'border-left':
                        styleName = 'border-right';
                        break;
                /**
                 * border-right
                 */
                    case 'border-right':
                        styleName = 'border-left';
                        break;
                    case 'background-position':
                        styleProp = styleProp.toLowerCase();
                        if (styleProp.toLowerCase().contains("right")) {
                            styleProp = styleProp.replace("right", "left")
                        }
                        else if (styleProp.toLowerCase().contains("left")) {
                            styleProp = styleProp.replace("left", "right")
                        }

                        break;
                    case 'background':
                        styleProp = styleProp.toLowerCase();
                        if (styleProp.toLowerCase().contains("right")) {
                            styleProp = styleProp.replace("right", "left")
                        }
                        else if (styleProp.toLowerCase().contains("left")) {
                            styleProp = styleProp.replace("left", "right")
                        }

                        break;
                /** **************************************
                 * SAFARI SPECIFIC STYLES
                 *************************************** */
                /**
                 * border-left-width
                 */
                    case 'border-left-width':
                        styleName = 'border-right-width';
                        break;
                /**
                 * border-right-width
                 */
                    case 'border-right-width':
                        styleName = 'border-left-width';
                        break;
                /**
                 * border-left-style
                 */
                    case 'border-left-style':
                        styleName = 'border-right-style';
                        break;
                /**
                 * border-right-style
                 */
                    case 'border-right-style':
                        styleName = 'border-left-style';
                        break;
                /**
                 * border-left-color
                 */
                    case 'border-left-color':
                        styleName = 'border-right-color';
                        break;
                /**
                 * border-right-color
                 */
                    case 'border-right-color':
                        styleName = 'border-left-color';
                        break;
                /** *************************************/
                    default:
                        break;
                }

                if (isImportant) {
                    styleProp += " !important"
                }
                def newStyle = formatStyleLine(styleName, styleProp)
                newCSSEntry += newStyle
            }
        }

        return newCSSEntry
    }


    List convertCSSDSLToRTL(CSSDSL) {
        List RTLCSSDSL = []
        CSSDSL.each { DSLEntry ->
            def DSLEntryCSS = DSLEntry["CSS"]
            def newDSLEntryCSS = convertCSSToRTL(DSLEntryCSS)
            def newDSLEntry = [:]
            newDSLEntry.put("CLASS_NAME", DSLEntry["CLASS_NAME"])
            newDSLEntry.put("CSS", newDSLEntryCSS)
            RTLCSSDSL.add(newDSLEntry)
        }
        return RTLCSSDSL
    }


    def createRTLCSSFile(destFileName, rtlCss ) {
        File destFile = new File(destFileName)
        destFile.delete()
        destFile.append( rtlCss )
    }

    def createCSSEntryFromDSL(CSS_DSL) {
        int numberOfCss = CSS_DSL.size();
        int cssCounter = 0;
        StringBuilder cssEntry = new StringBuilder();
        CSS_DSL.each { DSLEntryCSS ->
            cssEntry.append(DSLEntryCSS["CLASS_NAME"] + " {\n")
            cssEntry.append(DSLEntryCSS["CSS"])
            cssEntry.append("}")
            cssCounter++
        }
        return cssEntry.toString();
    }


    def getRTLFileName(file) {
        def absolutePathOfFile = file.absolutePath
        def fileName = absolutePathOfFile.substring(absolutePathOfFile.lastIndexOf(java.io.File.separator) + 1, absolutePathOfFile.length())
        def path = absolutePathOfFile.substring(0, absolutePathOfFile.lastIndexOf(java.io.File.separator))
        def rtlFile = path + java.io.File.separator + fileName.split("\\.css")[0] + "-rtl.css"
        return rtlFile
    }

    def transformCss( String srcText ) {
        List mediaQueries = getMediaQueries(srcText)

        def textWithoutMediaQueries = removeMediaQueriesFromSource(srcText, mediaQueries);
        String rtlMediaQueries = convertMediaQueriesToRTL(mediaQueries);

        def CSS_DSL = getCSSDSL(textWithoutMediaQueries)
        def RTL_CSS_DSL = convertCSSDSLToRTL(CSS_DSL)

        def rtlCss = createCSSEntryFromDSL( RTL_CSS_DSL ) + (
            rtlMediaQueries ? ( "\n/*** Media Query Section ***/\n" + rtlMediaQueries ) : "" )

        return rtlCss
    }

    def transformFile( File source, File target) {
        String rtlCss = transformCss( source.text )
        createRTLCSSFile( target.path, rtlCss )
    }

    List getMediaQueries(srcText) {
        def mediaQueryRegExp = /(?m)@media[\S\s]*?}[\s]*[*\/]*[\s]*}/;
        List mediaQueryList = new ArrayList();

        srcText.eachMatch(mediaQueryRegExp) { match ->
            mediaQueryList.add(match);
        }
        return mediaQueryList
    }

    String removeMediaQueriesFromSource(srcText, List mediaQueries) {
        int numberOfMediaQueries = mediaQueries.size();

        String textFileWithoutMediaQueries = srcText;
        for(int counter = 0; counter < numberOfMediaQueries; counter++) {
            textFileWithoutMediaQueries = textFileWithoutMediaQueries.replace(mediaQueries.get(counter), "");
        }
        return textFileWithoutMediaQueries
    }

    String convertMediaQueriesToRTL(List mediaQueries) {
        int numberOfMediaQueries = mediaQueries.size();
        StringBuilder RTLMediaQueryCss = new StringBuilder();

        for(int counter = 0; counter < numberOfMediaQueries; counter++) {
            String mediaQuery = mediaQueries[counter];

            def matcher = mediaQuery =~ /@media[\S\s]*?\{/
            String mediaLine = matcher[0];
            String mediaQueryCss = mediaQueries[counter].replace(mediaLine, "");
            def CSS_DSL = getCSSDSL(mediaQueryCss)
            def RTL_CSS_DSL = convertCSSDSLToRTL(CSS_DSL)

            StringBuilder rtlCss = new StringBuilder(mediaLine);
            rtlCss.append(createCSSEntryFromDSL(RTL_CSS_DSL))
            rtlCss.append("\n");
            rtlCss.append("}");
            rtlCss.append("\n");
            RTLMediaQueryCss.append(rtlCss.toString());
        }
        return RTLMediaQueryCss.toString();
    }


    def getFilesToTransformMapList(dir) {
        def files = []

        dir.traverse( type: FileType.FILES, nameFilter: ~/.*\.css/, excludeNameFilter: ~/.*rtl.*\.css/ ) { source ->
            def destPath = getRTLFileName(source)
            File target = new File( destPath );
            if (!target.exists() || (target.lastModified() < source.lastModified())) {
                files << [ "source": source, "target": target]
            }
        }

        return files
    }


    public generateRTLCss() {
        def includePluginsDir = true
        def filesToGenerate = []

        String currentWorkingDir = System.getProperty("user.dir")
        String requiredDir = new File(new File(currentWorkingDir).getParent()).getParent()

        if (includePluginsDir) {
            filesToGenerate.addAll( getFilesToTransformMapList( new File("$requiredDir/plugins/")) )
        }
        filesToGenerate.addAll( getFilesToTransformMapList( new File( "$requiredDir/grails-app/assets/stylesheets/")) )

        if (filesToGenerate) {
            filesToGenerate.each {
                transformFile( it.source, it.target )
            }

            println "Generated RTL version${filesToGenerate.size() > 1 ? "s" : "" } of ${filesToGenerate.source.canonicalFile}"
        }
    }

    //TODO: Remove it later but as of now keeping this as temproray solution
    public static void main(String[] args) {
        RtlCssGenerator rtlCssGenerator = new RtlCssGenerator()
        rtlCssGenerator.generateRTLCss()
    }

}

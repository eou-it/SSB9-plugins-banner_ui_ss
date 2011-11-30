/*********************************************************************************
 Copyright 2009-2011 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is limited
 solely to SunGard Higher Education licensees, and is further subject to the terms
 and conditions of one or more written license agreements between SunGard Higher
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/
package com.sungardhe.banner.common


import grails.util.BuildSettingsHolder
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


    def getCSSFileDSL(srcFile) {
        def CSSClasses = srcFile.text.split("}")
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
        def styles = CSSEntry.toString().split(";")
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


    def convertCSSDSLToRTL(CSSDSL) {
        def RTLCSSDSL = []
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


    def createRTLCSSFile(destFileName, RTLCSSDSL) {
        def destFile = new File(destFileName)
        destFile.delete()
        RTLCSSDSL.each { DSLEntryCSS ->
            destFile.append(DSLEntryCSS["CLASS_NAME"] + " {\n")
            destFile.append(DSLEntryCSS["CSS"])
            destFile.append("}")
        }
    }


    def getRTLFileName(file) {
        def absolutePathOfFile = file.absolutePath
        def fileName = absolutePathOfFile.substring(absolutePathOfFile.lastIndexOf(java.io.File.separator) + 1, absolutePathOfFile.length())
        def path = absolutePathOfFile.substring(0, absolutePathOfFile.lastIndexOf(java.io.File.separator))
        def rtlFile = path + java.io.File.separator + fileName.split("\\.css")[0] + "-rtl.css"
        return rtlFile
    }


    def transformFile( File source, File target) {
        def CSS_DSL = getCSSFileDSL(source)
        def RTL_CSS_DSL = convertCSSDSLToRTL(CSS_DSL)
        createRTLCSSFile(target.path, RTL_CSS_DSL)
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


    public generateRTLCss(includePluginsDir = null) {

        def filesToGenerate = []

        if (includePluginsDir) {
            filesToGenerate.addAll( getFilesToTransformMapList( BuildSettingsHolder.settings.projectPluginsDir ) )
        }

        filesToGenerate.addAll( getFilesToTransformMapList( new File( "${BuildSettingsHolder.settings.baseDir.absolutePath}/web-app/css/" )))

        if (filesToGenerate) {
            filesToGenerate.each {
                transformFile( it.source, it.target )
            }

            println "Generated RTL version${filesToGenerate.size() > 1 ? "s" : "" } of ${filesToGenerate.source.canonicalFile}"
        }
    }
}
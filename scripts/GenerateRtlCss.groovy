includeTargets << grailsScript("Init")
includeTargets << grailsScript("_GrailsInit")

/** Execution: grails generate-rtl-css **/

import groovy.io.FileType
import grails.util.BuildSettingsHolder

/* Need to move this out */
def loadFile (fileName) {
    srcFile = new File (fileName)
}

def removeCommentedStyles(style) {
    style = style.toString().replaceAll("/\\*(.|[\r\n])*?\\*/","")
    return style
}

def removeNewLineCharacter(style) {
    println style
    def t1 = style.toString().replaceAll(" ","");
    println t1
    def t2 = t1.replace('\n','')
    println t2
}

def getCSSFileDSL(srcFile){
    def CSSClasses = srcFile.text.split("}")
    def CSSDSL = [];

    CSSClasses.each { fs ->
        def secondSplit = fs.toString().split("\\{")
        if(secondSplit.length > 1) {
            def DSLEntry = [:]
            secondSplit[1] = removeCommentedStyles(secondSplit[1])

            DSLEntry.put ("CLASS_NAME" , secondSplit[0])
            if(secondSplit[1].trim().isEmpty()) {
                DSLEntry.put ("CSS", secondSplit[1].trim())
            }
            else {
                DSLEntry.put ("CSS", secondSplit[1].trim())
            }
            CSSDSL.add(DSLEntry)
        }

    }
    return CSSDSL;
}

def formatStyleLine(styleName, styleProp) {
    "    " + styleName + ":" + styleProp + ";\n"
}

def convertCSSToRTL(CSSEntry) {
    def styles = CSSEntry.toString().split(";")
    def newCSSEntry = "";

    styles.each { styleLine ->
        def style = styleLine.split(":")

        if(style.length > 1) {
            def styleName = style[0].trim()
            def styleProp = style[1].trim()
            def isImportant =  styleProp.toLowerCase().contains("!important")
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
                    if(styleProp.toLowerCase().contains("right")) {
                        styleProp = styleProp.replace("right","left")
                    }
                    else if(styleProp.toLowerCase().contains("left")) {
                        styleProp = styleProp.replace("left","right")
                    }

                    break;
                case 'background':
                    styleProp = styleProp.toLowerCase();
                    if(styleProp.toLowerCase().contains("right")) {
                        styleProp = styleProp.replace("right","left")
                    }
                    else if(styleProp.toLowerCase().contains("left")) {
                        styleProp = styleProp.replace("left","right")
                    }

                    break;
                /****************************************
                 * SAFARI SPECIFIC STYLES
                 ****************************************/
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
                /***************************************/
                default:
                    break;
            }

            if(isImportant) {
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
        def newDSLEntryCSS = convertCSSToRTL (DSLEntryCSS)
        def newDSLEntry = [:]
        newDSLEntry.put ("CLASS_NAME" , DSLEntry["CLASS_NAME"])
        newDSLEntry.put ("CSS", newDSLEntryCSS)
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

def transformAllFilesUnder(dir) {
     dir.traverse(
        type: FileType.FILES,
        nameFilter: ~/.*\.css/,
        excludeNameFilter: ~/.*rtl.*\.css/
    ) { srcFile ->
        println "Converting........." + srcFile.canonicalFile
        def destFile = getRTLFileName(srcFile)
        def CSS_DSL = getCSSFileDSL(srcFile)
        def RTL_CSS_DSL = convertCSSDSLToRTL(CSS_DSL)
        createRTLCSSFile(destFile, RTL_CSS_DSL)
    }
}
/* Need to move this out */


target(generateRtlCss: "Transform all CSS files to RTL version") {
    println "Start CSS Transformation"
    if (args) {
		def includePlugins = args.split("\n")[0]
        if(includePlugins) {
            transformAllFilesUnder (BuildSettingsHolder.settings.projectPluginsDir)
        }
    }

    /* Traverse Directories in current project */
    transformAllFilesUnder (BuildSettingsHolder.settings.baseDir)
    println "CSS Transformation Complete"
}

setDefaultTarget(generateRtlCss)

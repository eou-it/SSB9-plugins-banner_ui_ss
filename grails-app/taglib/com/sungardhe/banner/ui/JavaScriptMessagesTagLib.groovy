/** *****************************************************************************
 Copyright 2008-2011 SunGard Higher Education. All Rights Reserved.

 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is
 limited solely to SunGard Higher Education licensees, and is further subject
 to the terms and conditions of one or more written license agreements between
 SunGard Higher Education and the licensee in question. SunGard, Banner and
 Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 ****************************************************************************** */
package com.sungardhe.banner.ui

import java.util.zip.GZIPInputStream

/**
 * This class is built off the knowledge provided within the ResourceTagLib from
 * the resources plug-in.  It's goal is to scan the files that have been processed
 * for localication call outs and provide them in the i18n map on the client.
 */
class JavaScriptMessagesTagLib {
    def resourceService

     def encodeHTML( msg ) {
        msg = msg.replace("\"","&quot;")
        msg = msg.replace("<","&lt;")
        msg = msg.replace(">","&gt;")
        return msg;
    }

    def i18nJavaScript = { attrs ->

        if (request.resourceDependencyTracker) {
            Set keys = []

            // Search for any place where we are referencing message codes
            def regex = ~/\(*\.i18n.prop\(.*?[\'\"](.*?)[\'\"].*?\)/

            request.resourceDependencyTracker.each { name ->
                resourceService.getModule( name ).resources.findAll{ it.sourceUrlExtension == "js" }.each {

                    if (it.processedFile) {
                        def fileText

                        // Check to see if the file has been zipped.
                        if (it.processedFile.path.endsWith( ".gz" )) {
                            new GZIPInputStream(it.newInputStream()).withStream { stream ->
                                stream.eachLine { line ->
                                    if (!fileText) {
                                        fileText = line
                                    }
                                    else {
                                        fileText += "$line\n"
                                    }
                                }
                            }
                        }
                        else {
                            fileText = it.processedFile.text
                        }

                        def matcher = regex.matcher( fileText )
                        while (matcher.find()) {
                            keys << matcher.group(1)
                        }
                    }
                }
            }

            if (keys) {
                def javaScriptProperties = []
                keys.sort().each {
                    def msg = "${g.message( code: it )}"
                    msg = encodeHTML(msg)
                    javaScriptProperties << "\"$it\": \"$msg\""
                }

                out << '\$.i18n.map = {'
                out << javaScriptProperties.join( "," )
                out << '};'
            }
        }
    }
}
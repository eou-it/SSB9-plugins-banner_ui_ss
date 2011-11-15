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

/**
 * This class is built off the knowledge provided within the ResourceTagLib from
 * the resources plug-in.  It's goal is to scan the files that have been processed
 * for localication call outs and provide them in the i18n map on the client.
 */
class JavaScriptMessagesTagLib {
    def resourceService

    def i18nJavaScript = { attrs ->

        if (request.resourceDependencyTracker) {
            Set keys = []

            // Search for any place where we are referencing message codes
            def regex = ~/\(*\.i18n.prop\(.*?\"(.*?)\".*?\)/

            request.resourceDependencyTracker.each { name ->
                resourceService.getModule( name ).resources.findAll{ it.sourceUrlExtension == "js" }.each {
                    if (it.processedFile) {
                        def matcher = regex.matcher( it.processedFile.text )
                        while (matcher.find()) {
                            keys << matcher.group(1)
                        }
                    }
                }
            }

            if (keys) {
                def javaScriptProperties = []
                keys.sort().each {
                    javaScriptProperties << "\"$it\": \"${g.message( code: it ).encodeAsHTML()}\""
                }

                out << '<script type="text/javascript">'
                out << '\$.i18n.map = {'
                out << javaScriptProperties.join( "," )
                out << '};'
                out << '</script>'
            }
        }
    }
}
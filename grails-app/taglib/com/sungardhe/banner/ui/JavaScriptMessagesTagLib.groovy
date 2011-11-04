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

class JavaScriptMessagesTagLib {
    def resourceService

    def i18nJavaScript = { attrs ->

        if (request.resourceDependencyTracker) {
            Set keys = []

            request.resourceDependencyTracker.each { name ->
                resourceService.getModule( name ).resources.collect {
                    if (it.hasProperty( "localeKeys" )) {

                        println "resource in taglib=$it;  it.localeKeys=$it.localeKeys"

                        keys.addAll( it.localeKeys )
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
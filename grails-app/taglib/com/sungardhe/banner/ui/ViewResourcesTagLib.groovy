/** *****************************************************************************
 ? 2011 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
package com.sungardhe.banner.ui

import org.codehaus.groovy.grails.web.util.GrailsPrintWriter

/**
 * Provides the style and javascript hooks for those files following the same naming convention as the view.
 */
class ViewResourcesTagLib {
    /**
     * This will return a list of key, property pairs for the DataTable list.
     *
     * Look at http://datatables.net/examples/basic_init/language.html for more information.
     */

    def viewResources = { attrs ->

        def controller = attrs.controller ?: controllerName
        def action = attrs.action ?: actionName

        insertStylesheets(controller, action, out )

        if (resourceExists( "js/views/$controller/${action}.js" )) {
            out << g.javascript( library: "views/$controller/${action}" )
        }
	}

    private def insertStylesheets(controller, action, GrailsPrintWriter out) {
        if (resourceExists("css/views/$controller/${action}.css")) {
            out << "<style>@import \"${resource(dir: "css/views/$controller", file: "${action}.css")}\";</style>"
        }

        if (g.message(code: "default.language.direction") == "rtl") {
            if (resourceExists("css/views/$controller/${action}-rtl.css")) {
                out << "<style>@import \"${resource(dir: "css/views/$controller", file: "${action}-rtl.css")}\";</style>"
            }
        }
    }


    private resourceExists( resPath ) {
        return grailsApplication.parentContext.getResource(resPath) != null
    }
}

package com.sungardhe.banner.ui

import org.codehaus.groovy.grails.web.util.GrailsPrintWriter

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

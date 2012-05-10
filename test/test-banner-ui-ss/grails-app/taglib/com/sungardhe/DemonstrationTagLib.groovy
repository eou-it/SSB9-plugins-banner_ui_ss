package com.sungardhe

import org.codehaus.groovy.grails.web.taglib.exceptions.GrailsTagException

class DemonstrationTagLib {

    def widgetCode = { attrs ->

        def template      = attrs.template
        def templateClean = template.replace("/", "-").replace(".", "-")
        def titleCode     = attrs.containsKey("title") ? attrs.title : templateClean
        def model         = attrs.containsKey('model') ? attrs.model : [:]
        def quiet         = attrs.containsKey('quiet') ? attrs.quiet : false

        def title         = "<h2>${g.message(code: titleCode)}</h2>"
        def actualOpen    = "<div class=\"actual\">"
        def actualClose   = "</div>"
        def jsCodeOpen    = "<div class=\"code\"><pre class=\"brush: js;\">"
        def jsCodeClose   = "</pre></div>"
        def htmlCodeOpen  = "<div class=\"code\"><pre class=\"brush: html;\">"
        def htmlCodeClose = "</pre></div>"
        def showCode      = "<div class=\"widget-code show-code\">${g.message(code: "ui.catalog.showCode")}</div>"
        def hideCode      = "<div class=\"widget-code hide-code\">${g.message(code: "ui.catalog.hideCode")}</div>"

        def actualHtml = g.render(template: template, model: model)

        def js = getJavaScriptIfExists("js/views/${controllerName}/${template}.js")

        out << "<div id=\"${templateClean}\" class=\"code-demonstration ${templateClean}\" data-component=\"${templateClean}\" data-desc=\"${g.message(code: templateClean)}\">"
        out << title
        out << actualOpen
        out << actualHtml
        out << actualClose

        if (!quiet) {
            out << showCode + hideCode
            out << jsCodeOpen
            out << js
            out << jsCodeClose
            out << htmlCodeOpen
            out << actualHtml
            out << htmlCodeClose
        }

        out << "</div>"
    }

    private getJavaScriptIfExists( js ) {
        def jsFile = grailsApplication.parentContext.getResource(js).file

        jsFile.exists() ? jsFile.text : "Not Found: " + js + "\n\n"
    }
}

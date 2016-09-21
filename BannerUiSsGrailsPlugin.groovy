/*******************************************************************************
 Copyright 2009-2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

import org.apache.commons.logging.LogFactory
import org.apache.log4j.Logger
import net.hedtech.banner.i18n.DateConverterService
import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONObject
import javax.servlet.http.HttpServletRequest

/**
 * A Grails Plugin providing core UI framework for Self Service Banner application.
 * */
class BannerUiSsGrailsPlugin {

    def log = Logger.getLogger(this.getClass())

    String groupId = "net.hedtech"

    def version = "9.18.2"

    def grailsVersion = "2.2.1 > *"

    def dependsOn = [
            cacheHeaders: '1.1.5 => *',
            csv: '0.3.1 => *',
            feeds: '1.5 => *',
            bannerCore: '1.0.17 => *'
    ]

    def pluginExcludes = [
            "grails-app/views/error.gsp",
            // exclude UI catalog stuff
            "grails-app/controllers/net/hedtech/banner/ui/ss/**",
            "grails-app/views/index.gsp",
            "grails-app/views/layouts/mainManual.gsp",
            "grails-app/views/uiCatalog/**",
            "web-app/css/views/**",
            "web-app/js/views/**"
    ]

    def loadAfter = ["controllers", "converters"]

    def author = "SunGard Higher Education"
    def authorEmail = "horizon-support@sungardhe.com"
    def title = "SunGard Higher Education Banner UI Plugin"
    def description = '''Web user interface components for Banner Self-Service.'''

    def documentation = "http://sungardhe.com/development/horizon/plugins/banner-ui-ss"


    def doWithWebDescriptor = { xml ->
        //no-op

    }


    def doWithSpring = {
        //messageSource( BannerPluginAwareResourceBundleMessageSource ) {
        //    basename = "WEB-INF/grails-app/i18n/messages"
        //    cacheSeconds = -1
        //    propertiesPersister = new BannerPropertiesPersister()
        //}
    }


    def doWithDynamicMethods = { ctx ->
        // Explicitly inject the log into the resources plugin artifacts, to circumvent NPEs
        application.allClasses.each {
            if (it.name?.contains("plugin.resource")) {
                log.info "adding log property to $it"

                // Note: weblogic throws an error if we try to inject the method if it is already present
                if (!it.metaClass.methods.find { m -> m.name.matches("getLog") }) {
                    def name = it.name // needed as this 'it' is not visible within the below closure...
                    try {
                        it.metaClass.getLog = { LogFactory.getLog("$name") }
                    }
                    catch (e) { } // rare case where we'll bury it...
                }
            }
        }

        def getNewJSONMethod = {->
            def json
            def request = (HttpServletRequest) delegate
            json = request.getAttribute("JSON")
            if (json == null || json == JSONObject.NULL) {
                try {
                    json = JSON.parse(request)
                } catch (Exception e) {
                    log.info "Error when parsing the JSON"
                    json = JSONObject.NULL
                }
            }
            return json
        }
        def requestMc = GroovySystem.metaClassRegistry.getMetaClass(HttpServletRequest)

        requestMc.getJSON = getNewJSONMethod


        application.controllerClasses.each { controller ->
            def originalMap = controller.metaClass.getMetaMethod("render", [Map] as Class[])
            def originalString = controller.metaClass.getMetaMethod("render", [String] as Class[])

            if (originalMap) {
                controller.metaClass.originalRenderMap = originalMap

                controller.metaClass.render = { Map args ->
                    if (args?.model) {
                        def dateFields = controller.getPropertyValue("dateFields")

                        if (dateFields && !dateFields.isEmpty()) {

                            def dateConverterService = new DateConverterService()
                            args?.model.each { key, value ->
                                if (value != null) {
                                    args.model[key] = dateConverterService.formatDateInObjectsToDefaultCalendar(key, value, dateFields);
                                }
                            }
                        }
                    }
                    //originalRenderMap.invoke(delegate, args)
                    originalMap.invoke(delegate, args)
                }
            }

            if (originalString) {
                controller.metaClass.originalRenderString = originalString

                controller.metaClass.render = { String txt ->
                    try {
                        def dateConverterService = new DateConverterService()
                        def json = JSON.parse(txt);
                        def dateFields = controller.getPropertyValue("dateFields")
                        if (dateFields && !dateFields.isEmpty() && json != JSONObject.NULL) {
                            json = dateConverterService.JSONDateMarshaller(json, dateFields)
                            txt = json.toString()
                        }
                    }
                    catch (Exception e) {
                        println e
                    }
                    //originalRenderString.invoke(delegate, txt)
                    originalString.invoke(delegate, txt)
                }
            }
        }
    }


    def doWithApplicationContext = { applicationContext ->
        //no-op
    }


    def onChange = { event ->
        //no-op
    }


    def onConfigChange = { event ->
        //no-op
    }
}

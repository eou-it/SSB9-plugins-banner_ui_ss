package banner.ui.ss

import grails.converters.JSON
import grails.plugins.*
import grails.util.GrailsMetaClassUtils
import groovy.util.logging.Slf4j
import net.hedtech.banner.i18n.DateConverterService
import org.apache.commons.logging.LogFactory
import org.grails.web.json.JSONObject

import javax.servlet.http.HttpServletRequest

@Slf4j
class BannerUiSsGrailsPlugin extends Plugin {

    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "3.3.2 > *"
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
        "grails-app/views/error.gsp"
    ]
    def loadAfter = ["bannerCore", "bannerGeneralUtility"]

    def title = "Banner UI SS Plugin" // Headline display name of the plugin
    def author = "ellucian"
    def authorEmail = ""
    def description = '''Web user interface components for Banner Self-Service.'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/banner-ui-ss"

    Closure doWithSpring() { {->
            // TODO Implement runtime spring config (optional)
        }
    }

    void doWithDynamicMethods() {

        def getNewJSONMethod = {->
            def json
            def request = (HttpServletRequest) delegate
            json = request.getAttribute("JSON")
            if (json == null || json == JSONObject.NULL) {
                try {
                    json = JSON.parse(request)
                } catch (Exception e) {
                    log.error "Error when parsing the JSON"
                    json = JSONObject.NULL
                }
            }
            return json
        }

        // For injecting the getJSON method to request object,
        // using GrailsMetaClassUtils class getExpandoMetaClass() method
        def requestMc = GrailsMetaClassUtils.getExpandoMetaClass(HttpServletRequest)
        requestMc.getJSON = getNewJSONMethod

		grailsApplication.controllerClasses.each { controller ->
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

    void doWithApplicationContext() {
        // TODO Implement post initialization spring config (optional)
    }

    void onChange(Map<String, Object> event) {
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    void onConfigChange(Map<String, Object> event) {
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }

    void onShutdown(Map<String, Object> event) {
        // TODO Implement code that is executed when the application shuts down (optional)
    }
}

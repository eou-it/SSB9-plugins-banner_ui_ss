package banner.ui.ss

import grails.plugins.*
import net.hedtech.banner.i18n.DateConverterService

import javax.servlet.http.HttpServletRequest

class BannerUiSsGrailsPlugin extends Plugin {

    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "3.3.2 > *"
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
        "grails-app/views/error.gsp"
    ]
    def loadAfter = ["bannerCore", "bannerGeneralUtility"]

    // TODO Fill in these fields
    def title = "Banner Ui Ss" // Headline display name of the plugin
    def author = "Your name"
    def authorEmail = ""
    def description = '''\
Brief summary/description of the plugin.
'''
    def profiles = ['web']

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/banner-ui-ss"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
//    def license = "APACHE"

    // Details of company behind the plugin (if there is one)
//    def organization = [ name: "My Company", url: "http://www.my-company.com/" ]

    // Any additional developers beyond the author specified above.
//    def developers = [ [ name: "Joe Bloggs", email: "joe@bloggs.net" ]]

    // Location of the plugin's issue tracker.
//    def issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPMYPLUGIN" ]

    // Online location of the plugin's browseable source code.
//    def scm = [ url: "http://svn.codehaus.org/grails-plugins/" ]

    Closure doWithSpring() { {->
            // TODO Implement runtime spring config (optional)
        }
    }

    void doWithDynamicMethods() {
        // TODO Implement registering dynamic methods to classes (optional)

        // Explicitly inject the log into the resources plugin artifacts, to circumvent NPEs
        
		//application.allClasses.each {
		grailsApplication.allClasses.each {
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

		//Commented for Grails-3
		/*
        requestMc.getJSON = getNewJSONMethod
		*/

        //application.controllerClasses.each { controller ->
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

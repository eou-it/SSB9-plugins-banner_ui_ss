class BannerUiSsGrailsPlugin {
    // the plugin version
    def version = "0.0.2"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.3.7 > *"
    // the other plugins this plugin depends on
    def dependsOn = [
                     bannerCore:'0.2.38 => *',
                     cacheHeaders:'1.1.5 => *',
                     csv:'0.3 => *',
                     //excelImport:'0.3 => *', // depends on a joda-time jar file. If we want to continue using excelImport, we should grab just the joda-time.jar file
                     feeds:'1.5 => *',
                     //jodaTime:'1.2 => *', // possibly broken plugin, used by excelImport
                     jquery:'1.6.1.1 => *',
                     jqueryUi:'1.8.11 => *',
                     resources:'1.0 => *',
                     selenium:'0.6 => *',
                     seleniumRc:'1.0.2 => *',
                     zippedResources:'1.0 => *',
                     ]
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]

    // TODO Fill in these fields
    def author = "SunGard Higher Education"
    def authorEmail = ""
    def title = "banner-ui-ss plugin"
    def description = '''Web user interface components for Banner Self-Service.'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/banner-ui-ss"

    def doWithWebDescriptor = { xml ->
        // TODO Implement additions to web.xml (optional), this event occurs before 
    }

    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }
}

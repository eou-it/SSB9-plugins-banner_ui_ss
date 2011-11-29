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

import org.apache.commons.logging.LogFactory
import org.apache.log4j.Logger

/**
 * A Grails Plugin providing core UI framework for Self Service Banner application.
 **/
class BannerUiSsGrailsPlugin {

    def log = Logger.getLogger( this.getClass() )
    
    String groupId = "com.sungardhe"

    def version = "0.1.39"

    def grailsVersion = "1.3.7 > *"

    def dependsOn = [
        resources:'1.0.2 => *',
        cacheHeaders:'1.1.5 => *',
        csv:'0.3 => *',
        feeds:'1.5 => *',
        jquery:'1.6.1.1 => *',
        jqueryUi:'1.8.15 => *',
        selenium:'0.6 => *',
        bannerCore:'1.0.17 => *'
    ]

    def pluginExcludes = [
        "grails-app/views/error.gsp",
        // exclude UI catalog stuff
        "grails-app/controllers/com/sungardhe/banner/ui/ss/**",
        "grails-app/views/index.gsp",
        "grails-app/views/layouts/mainManual.gsp",
        "grails-app/views/uiCatalog/**",
        "web-app/css/views/**",
        "web-app/js/views/**"
    ]

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
             if (it.name?.contains( "plugin.resource" )) {
                 log.info "adding log property to $it"

                 // Note: weblogic throws an error if we try to inject the method if it is already present
                 if (!it.metaClass.methods.find { m -> m.name.matches( "getLog" ) }) { 
                     def name = it.name // needed as this 'it' is not visible within the below closure...
                     try {
                         it.metaClass.getLog = { LogFactory.getLog( "$name" ) }
                     } 
                     catch (e) { } // rare case where we'll bury it...
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

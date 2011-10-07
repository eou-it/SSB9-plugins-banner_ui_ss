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

import com.sungardhe.banner.BannerPropertiesPersister
import com.sungardhe.banner.BannerPluginAwareResourceBundleMessageSource

/**
 * A Grails Plugin providing core UI framework for Self Service Banner application
 * */
class BannerUiSsGrailsPlugin {
    // Note: the groupId 'should' be used when deploying this plugin via the 'grails maven-deploy --repository=snapshots' command,
    // however it is not being picked up.  Consequently, a pom.xml file is added to the root directory with the correct groupId
    // and will be removed when the maven-publisher plugin correctly sets the groupId based on the following field.
    String groupId = "com.sungardhe"

    // Note: Using '0.1-SNAPSHOT' (to put a timestamp on the artifact) is not used due to GRAILS-5624 see: http://jira.codehaus.org/browse/GRAILS-5624
    // Until this is resolved, Grails application's that use a SNAPSHOT plugin do not check for a newer plugin release, so that the
    // only way we'd be able to upgrade a project would be to clear the .grails and .ivy2 cache to force a fetch from our Nexus server.
    // Consequently, we'll use 'RELEASES' so that each project can explicitly identify the needed plugin version. Using RELEASES provides
    // more control on 'when' a grails app is updated to use a newer plugin version, and therefore 'could' allow delayed testing within those apps
    // independent of deploying a new plugin build to Nexus.
    //
    //String version = "0.1-SNAPSHOT"

    def version = "0.0.63"

    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.3.7 > *"

    // the other plugins this plugin depends on
    def dependsOn = [
        bannerCore:'0.2.38 => *',
        cacheHeaders:'1.1.5 => *',
        csv:'0.3 => *',
        feeds:'1.5 => *',
        jquery:'1.6.1.1 => *',
        jqueryUi:'1.8.11 => *',
        selenium:'0.6 => *',
        seleniumRc:'1.0.2 => *'
    ]

    // resources that are excluded from plugin packaging
    def pluginExcludes = [
        "grails-app/views/error.gsp",
        // exclude UI catalog stuff
        "grails-app/controllers/com/sungardhe/banner/ui/ss/**",
        "grails-app/views/**",
        "web-app/css/views/**",
        "web-app/js/views/**"
    ]

    def author = "SunGard Higher Education"
    def authorEmail = "horizon-support@sungardhe.com"
    def title = "SunGard Higher Education Banner UI Plugin"
    def description = '''Web user interface components for Banner Self-Service.'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/banner-ui-ss"

    def doWithWebDescriptor = { xml ->
        //no-op
    }

    def doWithSpring = {
        messageSource(BannerPluginAwareResourceBundleMessageSource) {
            basename = "WEB-INF/grails-app/i18n/messages"
            cacheSeconds = -1
            propertiesPersister = new BannerPropertiesPersister()
        }
    }

    def doWithDynamicMethods = { ctx ->
        //no-op
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

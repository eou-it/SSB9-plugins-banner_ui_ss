/** *****************************************************************************

 © 2011 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */

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

    def version = "0.0.5"

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
        "grails-app/views/error.gsp"
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
        //no-op
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

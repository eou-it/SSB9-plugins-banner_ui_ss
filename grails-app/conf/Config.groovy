import com.sungardhe.banner.configuration.ApplicationConfigurationUtils as ConfigFinder
// configuration for plugin testing - will not be included in the plugin zip
grails.config.locations = [] // leave this initialized to an empty list, and add your locations
// in the APPLICATION CONFIGURATION section below.

def locationAdder = ConfigFinder.&addLocation.curry(grails.config.locations)

[bannerGrailsAppConfig: "${userHome}/.grails/banner_on_grails-local-config.groovy",
 //TODO :missing file        customRepresentationConfig: "grails-app/conf/CustomRepresentationConfig.groovy",
].each { envName, defaultFileName -> locationAdder(envName, defaultFileName) } 
log4j = {
    // Example of changing the log pattern for the default console
    // appender:
    //
    //appenders {
    //    console name:'stdout', layout:pattern(conversionPattern: '%c{2} %m%n')
    //}

    error  'org.codehaus.groovy.grails.web.servlet',  //  controllers
           'org.codehaus.groovy.grails.web.pages', //  GSP
           'org.codehaus.groovy.grails.web.sitemesh', //  layouts
           'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
           'org.codehaus.groovy.grails.web.mapping', // URL mapping
           'org.codehaus.groovy.grails.commons', // core / classloading
           'org.codehaus.groovy.grails.plugins', // plugins
           'org.codehaus.groovy.grails.orm.hibernate', // hibernate integration
           'org.springframework',
           'org.hibernate',
           'net.sf.ehcache.hibernate'

    warn   'org.mortbay.log'
}

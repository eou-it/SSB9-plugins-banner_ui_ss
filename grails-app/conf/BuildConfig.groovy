/*******************************************************************************
Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
//grails.project.war.file = "target/${appName}-${appVersion}.war"
grails.project.dependency.resolver="maven"

grails.plugin.location.'banner-core'="../banner_core.git"
grails.plugin.location.'banner-codenarc'="../banner_codenarc.git"
grails.plugin.location.'sghe-aurora'="../sghe_aurora.git"
grails.plugin.location.'i18n_core'="../i18n_core.git"

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
    }
    log "error" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {

        if (System.properties['PROXY_SERVER_NAME']) {
            mavenRepo "${System.properties['PROXY_SERVER_NAME']}"
        }

        grailsCentral()
        mavenCentral()
        mavenRepo "http://repository.jboss.org/maven2/"
        mavenRepo "https://code.lds.org/nexus/content/groups/main-repo"
    }

    plugins {
        compile ":spring-security-core:2.0-RC5"
        compile ':cache-headers:1.1.7'
        compile ':csv:0.3.1'
        compile ':feeds:1.5'
        compile ':selenium:0.8'
    }

    dependencies {
        // rome dependency is required for the feeds plugin. Otherwise it throws multiple compilation error
        // for import com.sun.syndication.io.SyndFeedOutput
        compile 'rome:rome:0.9'
        compile 'org.apache.poi:poi:3.12'
        compile 'org.apache.poi:poi-ooxml:3.12'
        compile 'org.apache.poi:poi-ooxml-schemas:3.12'
        compile 'org.apache.poi:poi-scratchpad:3.12'
        compile 'org.apache.xmlbeans:xmlbeans:2.3.0'
    }
}


// CodeNarc rulesets
codenarc.ruleSetFiles="rulesets/banner.groovy"
codenarc.reportName="target/CodeNarcReport.html"
codenarc.propertiesFile="grails-app/conf/codenarc.properties"
codenarc.extraIncludeDirs=["grails-app/composers"]

grails.validateable.packages=['net.hedtech.banner.student.registration']

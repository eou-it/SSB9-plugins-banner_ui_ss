/*********************************************************************************
 Copyright 2009-2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
//grails.project.war.file = "target/${appName}-${appVersion}.war"

grails.plugin.location.'banner-core'="../banner_core.git"
grails.plugin.location.'banner-codenarc'="../banner_codenarc.git"
grails.plugin.location.'sghe-aurora'="../sghe_aurora.git"
grails.plugin.location.'spring-security-cas'="../spring_security_cas.git"
grails.plugin.location.'i18n_core'="../i18n_core.git"

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {

        grailsPlugins()
        grailsHome()
        grailsCentral()

        mavenRepo "http://repository.jboss.org/maven2/"
        mavenRepo "http://repository.codehaus.org"
    }

    plugins {
        compile ':spring-security-core:1.2.7.3'

        compile ':cache-headers:1.1.5'
        compile ':codenarc:0.8'
        compile ':csv:0.3.1'
        compile ':feeds:1.5'

        compile ':selenium:0.8'
        compile ':selenium-rc:1.0.2'
    }

    dependencies {

    }
}

/*********************************************************************************
 Copyright 2009-2011 SunGard Higher Education. All Rights Reserved.
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
grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {
        mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/releases/"
        mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/snapshots/"
        mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/thirdparty/"
        mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/public/asm/"

        grailsPlugins()
        grailsHome()
        grailsCentral()
        
        mavenRepo "http://repository.jboss.org/maven2/"
        mavenRepo "http://repository.codehaus.org"
    }

    plugins {
        compile 'com.sungardhe:banner-core:1.0.17'
        compile 'com.sungardhe:spring-security-core:1.0.1'
        compile 'com.sungardhe:banner-codenarc:0.1.3'
        compile 'com.sungardhe:sghe-aurora:0.0.6'

        compile ':cache-headers:1.1.5'
        compile ':codenarc:0.8'
        compile ':csv:0.3'
        compile ':feeds:1.5'
        compile ':functional-test:1.2.7'
        compile ':hibernate:1.3.7'
        compile ':jquery:1.6.1.1'
        compile ':jquery-ui:1.8.15'

        compile ':resources:1.1.6'
        runtime ':zipped-resources:1.0'
        runtime ':cached-resources:1.0'

        compile ':selenium:0.6'
        compile ':selenium-rc:1.0.2'
        compile ':spring-security-cas:1.0.2'
        compile ':tomcat:1.3.7'

        provided ':maven-publisher:0.8.1'
    }

    dependencies {

    }
}

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
        compile ':maven-publisher:0.8.1'
        compile ':resources:1.0.2'
        compile ':selenium:0.6'
        compile ':selenium-rc:1.0.2'
        compile ':spring-security-cas:1.0.2'
        compile ':tomcat:1.3.7'
    }

    dependencies {

    }
}

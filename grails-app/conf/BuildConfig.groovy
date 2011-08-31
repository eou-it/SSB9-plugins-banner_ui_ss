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
        compile 'com.sungardhe:banner-core:0.4.0'  //TODO change version to :latest.integration or latest.release (maven repositories only)??
        compile 'com.sungardhe:spring-security-core:1.0.1'
        compile 'com.sungardhe:banner-codenarc:0.1.3'
    }

    dependencies {

    }
}

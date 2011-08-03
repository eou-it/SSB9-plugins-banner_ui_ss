/** *****************************************************************************
 © 2010 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */


grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"

grails.project.dependency.resolution = {

  // inherit Grails' default dependencies
  inherits("global") {
    // uncomment to disable ehcache
    // excludes 'ehcache'
  }


  log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'


  distribution = {
    localRepository = ""
    remoteRepository(id: "snapshots", url: "http://m038083.sungardhe.com:8081/nexus/content/repositories/snapshots") {
      authentication username: 'admin', password: 'admin123'
    }
    remoteRepository(id: "releases", url: "http://m038083.sungardhe.com:8081/nexus/content/repositories/releases") {
      authentication username: 'admin', password: 'admin123'
    }
  }


  repositories {
    //Ugly workaround as there is an existing JIRA in grails 1.3.2 in plugin dependency resolution
    //More info on JIRA: https://cvs.codehaus.org/browse/GRAILS-6420
    //This should be removed as soon as this JIRA is resolved
    //def repo_sghe_zk_core = new org.apache.ivy.plugins.resolver.URLResolver(name: "horizon-sghe-zk-core", m2compatible: true)
    //repo_sghe_zk_core.addArtifactPattern("http://m038083.sungardhe.com:8081/nexus/content/repositories/releases/com/sungardhe/sghe-zk-core/0.1.0/sghe-zk-core-0.1.0.zip")
    //resolver(repo_sghe_zk_core)

    mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/releases/"
    mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/snapshots/"
    mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/thirdparty/"
    
    grailsPlugins()
    grailsHome()
    grailsCentral()
  }


  dependencies {
  }

}

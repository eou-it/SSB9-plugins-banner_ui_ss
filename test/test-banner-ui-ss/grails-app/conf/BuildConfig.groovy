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

grails.project.class.dir        = "target/classes"
grails.project.lib.dir          = "lib"
grails.project.test.class.dir   = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"

// When deploying a war it is important to exclude the Oracle database drivers.  Not doing so will
// result in the all-too-familiar exception:
// "Cannot cast object 'oracle.jdbc.driver.T4CConnection@6469adc7'... to class 'oracle.jdbc.OracleConnection'
grails.war.resources = { stagingDir ->
    delete(file: "${stagingDir}/WEB-INF/lib/ojdbc6.jar")
}

//grails.plugin.location.'banner-ui-ss' = '../../../banner_ui_ss'
//grails.plugin.location.'banner-core' = '../banner_core'
//grails.plugin.location.'sghe-aurora' = '../sghe_aurora'
//grails.plugin.location.'banner-student-common' = '../banner_student_common'


grails.project.dependency.resolution = {
    inherits "global" // inherit Grails' default dependencies
    log      "warn"   // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
                                                                        
    repositories {

        mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/releases/"
        mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/snapshots/"
        mavenRepo "http://m038083.sungardhe.com:8081/nexus/content/repositories/thirdparty/"

        grailsPlugins()
        grailsHome()
        grailsCentral()
        mavenCentral()
        mavenRepo "http://repository.jboss.org/maven2/"
        mavenRepo "http://repository.codehaus.org"
    }

    plugins {
        compile 'com.sungardhe:banner-core:1.0.44'
        compile 'com.sungardhe:spring-security-core:1.0.1'
        compile 'com.sungardhe:spring-security-cas:1.0.2'
        compile 'com.sungardhe:banner-general-person:1.0.1'
        compile 'com.sungardhe:banner-general-common:1.0.2'
        compile 'com.sungardhe:banner-general-validation-common:1.0.0'
        compile 'com.sungardhe:banner-student-validation:1.0.3'
        compile 'com.sungardhe:banner-student-common:1.0.33'
        compile 'com.sungardhe:banner-student-faculty:1.0.5'
        compile 'com.sungardhe:banner-seeddata-catalog:1.0.1'
        compile 'com.sungardhe:banner-accountsreceivable-common:1.0.0'
        compile 'com.sungardhe:banner-accountsreceivable-validation-common:1.0.0'
        compile 'com.sungardhe:banner-db-main:1.0.4'
        compile 'com.sungardhe:sghe-aurora:1.0.0'
        compile 'com.sungardhe:banner-ui-ss:1.0.3'

        compile ':resources:1.1.6'
        compile ':zipped-resources:1.0'
        compile ':cached-resources:1.0'
        compile ':yui-minify-resources:0.1.4'

        compile ':cache-headers:1.1.5'
        compile ':functional-test:1.2.7'
        compile ':hibernate:1.3.7'
        compile ':message-reports:0.1'
        compile ':selenium:0.6'
        compile ':selenium-rc:1.0.2'
        compile ':tomcat:1.3.7'
        compile ':csv:0.3'
        compile ':feeds:1.5'
        compile ':jquery:1.7.1'
        compile ':jquery-ui:1.8.15'
        compile ':codenarc:0.8'
		compile ':markdown:1.0.0.RC1'

        test 'com.sungardhe:banner-codenarc:0.1.4'
        test 'com.sungardhe:code-coverage:1.2'

        compile 'com.sungardhe:banner-packaging:1.0.2'
    }


    dependencies {
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.

        // Note: elvyx-1.0.24_beta.jar remains in the lib/ directory of the project as it is not available in a public repo due to licensing issues.
        build 'org.antlr:antlr:3.2',
              'com.thoughtworks.xstream:xstream:1.2.1',
              'javassist:javassist:3.8.0.GA',
              'com.oracle:ojdbc6:11.1.0.6'
        runtime "javax.servlet:jstl:1.1.2"
    }
}


grails.war.resources = { stagingDir, args ->

    [delete(dir: "${stagingDir}/WEB-INF/classes/functionaltestplugin"),
            delete(dir: "${stagingDir}/plugins/functional-test-1.2.7"),
            delete(file: "${stagingDir}/WEB-INF/classes/FunctionalTest.class"),
            delete(file: "${stagingDir}/WEB-INF/classes/FunctionalTestGrailsPlugin\$_closure1.class"),
            delete(file: "${stagingDir}/WEB-INF/classes/FunctionalTestGrailsPlugin\$_closure2.class"),
            delete(file: "${stagingDir}/WEB-INF/classes/FunctionalTestGrailsPlugin\$_closure3.class"),
            delete(file: "${stagingDir}/WEB-INF/classes/FunctionalTestGrailsPlugin\$_closure4.class"),
            delete(file: "${stagingDir}/WEB-INF/classes/FunctionalTestGrailsPlugin\$_closure5.class"),
            delete(file: "${stagingDir}/WEB-INF/classes/FunctionalTestGrailsPlugin\$_closure6.class"),
            delete(dir:  "${stagingDir}/WEB-INF/classes/com/sungardhe/banner/testing"),
            delete(dir:  "${stagingDir}/selenium")
    ]
}

grails.war.copyToWebApp = { args ->
    fileset(dir:"web-app") {
        include(name: "js/**")
        include(name: "css/**")
        include(name: "images/**")
        include(name: "WEB-INF/**")
    }
}


/* ******************************************************************************
 *                        Test Coverage Configuration                           *
 ********************************************************************************/

// NOTE: Please use test coverage analysis to help improve code quality.  Please also understand that
//       100% coverage in a class may not be sufficient, and that low coverages may also be 'acceptable'
//       in cases.  Also understand that if one looks at code coverage during integration testing, this
//       does not reflect code coverage during 'functional' testing.

coverage {
	exclusions = [ "**/CustomRepresentationConfig*",
	               "**/SeleniumConfig*",
	               "**/seeddata/**",
	               "**/ui/**",
	               "**/*RepresentationBuilder*",
	               "**/*RepresentationHandler*",
	               "**/*ParamsExtractor*"
	             ]
}

reportMessages {
	// put all keys here, that should not show as unused, even if no code reference could be found
	// note that it is sufficient to provide an appropriate prefix to match a group of keys
	exclude = ["default", "typeMismatch"]

	// put all variable names here, that are used in dynamic keys and have a defined set of values
	// e.g. if you have a call like <c:message code="show.${prod}" /> and "prod" is used in many
	// pages to distinguish between "orange" and "apple" add a map to the list below:
	//     prod: ["orange", "apple"]
	dynamicKeys = [
	]
}

reportMessages {
	// put all keys here, that should not show as unused, even if no code reference could be found
	// note that it is sufficient to provide an appropriate prefix to match a group of keys
	exclude = ["default", "typeMismatch"]

	// put all variable names here, that are used in dynamic keys and have a defined set of values
	// e.g. if you have a call like <c:message code="show.${prod}" /> and "prod" is used in many
	// pages to distinguish between "orange" and "apple" add a map to the list below:
	//     prod: ["orange", "apple"]
	dynamicKeys = [
	]
}

reportMessages {
	// put all keys here, that should not show as unused, even if no code reference could be found
	// note that it is sufficient to provide an appropriate prefix to match a group of keys
	exclude = ["default", "typeMismatch"]

	// put all variable names here, that are used in dynamic keys and have a defined set of values
	// e.g. if you have a call like <c:message code="show.${prod}" /> and "prod" is used in many
	// pages to distinguish between "orange" and "apple" add a map to the list below:
	//     prod: ["orange", "apple"]
	dynamicKeys = [
	]
}

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

import com.sungardhe.banner.converters.json.JSONBeanMarshaller
import com.sungardhe.banner.converters.json.JSONDomainMarshaller
import com.sungardhe.banner.i18n.LocalizeUtil
import grails.converters.JSON
import grails.util.Environment
import org.apache.commons.logging.LogFactory
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.ApplicationAttributes
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib
import org.springframework.context.i18n.LocaleContextHolder as LCH

/**
 * Executes arbitrary code at bootstrap time.
 * Code executed includes:
 * -- Configuring the dataSource to ensure connections are tested prior to use
 * */
class BootStrap {

    def log = Logger.getLogger(this.getClass())

    def localizer = { mapToLocalize ->
        new ValidationTagLib().message(mapToLocalize)
    }

    def grailsApplication
    def resourceService

    def init = { servletContext ->
        def ctx = servletContext.getAttribute(ApplicationAttributes.APPLICATION_CONTEXT)

        /**
         * Using dataSource to set properties is not allowed after grails 1.3. dataSourceUnproxied should be used instead
         * Disabling it for now to avoid compatibility issue.
         */
        // Configure the dataSource to ensure connections are tested prior to use
        /*        ctx.dataSourceUnproxied.with {
            setMinEvictableIdleTimeMillis( 1000 * 60 * 30 )
            setTimeBetweenEvictionRunsMillis( 1000 * 60 * 30 )
            setNumTestsPerEvictionRun( 3 )
            setTestOnBorrow( true )
            setTestWhileIdle( false )
            setTestOnReturn( false )
            setValidationQuery( "select 1 from dual" )
        }*/

        if (Environment.current != Environment.TEST) {
            // println("Reading format from ${servletContext.getRealPath("/xml/application.navigation.conf.xml" )}")
            // NavigationConfigReader.readConfigFile( servletContext.getRealPath("/xml/application.navigation.conf.xml" ) )
        }


        grailsApplication.controllerClasses.each {
            log.info "adding log property to controller: $it"
            // Note: weblogic throws an error if we try to inject the method if it is already present
            if (!it.metaClass.methods.find { m -> m.name.matches("getLog") }) {
                def name = it.name // needed as this 'it' is not visible within the below closure...
                try {
                    it.metaClass.getLog = { LogFactory.getLog("$name") }
                }
                catch (e) { } // rare case where we'll bury it...
            }
        }

        grailsApplication.allClasses.each {
            if (it.name?.contains("plugin.resource")) {
                log.info "adding log property to plugin.resource: $it"

                // Note: weblogic throws an error if we try to inject the method if it is already present
                if (!it.metaClass.methods.find { m -> m.name.matches("getLog") }) {
                    def name = it.name // needed as this 'it' is not visible within the below closure...
                    try {
                        it.metaClass.getLog = { LogFactory.getLog("$name") }
                    }
                    catch (e) { } // rare case where we'll bury it...
                }
            }
        }

        // Register the JSON Marshallers for format conversion and XSS protection
        registerJSONMarshallers()

        resourceService.reloadAll()
    }


    def destroy = {
        // no-op
    }


    private def registerJSONMarshallers() {
        JSON.registerObjectMarshaller(Date) {
            LocalizeUtil.formatDate(it)
        }

        def localizeMap = [
                'attendanceHour': LocalizeUtil.formatNumber,
        ]

        JSON.registerObjectMarshaller(new JSONBeanMarshaller( localizeMap ), 1) // for decorators and maps
        JSON.registerObjectMarshaller(new JSONDomainMarshaller( localizeMap, true), 2) // for domain objects
    }
}
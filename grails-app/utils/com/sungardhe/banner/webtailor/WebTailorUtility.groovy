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
package com.sungardhe.banner.webtailor
import groovy.sql.Sql
import org.codehaus.groovy.grails.web.context.ServletContextHolder as SCH
import org.codehaus.groovy.grails.web.servlet.GrailsApplicationAttributes as GA

/**
 * This is a helper class that is used to help common validation and other processing for
 * Web Tailor objects
 *
 */
class WebTailorUtility {

    public static String getInfoText(String name, String label, String source = '') {
        def ctx = SCH.servletContext.getAttribute(GA.APPLICATION_CONTEXT)
        def sessionFactory = ctx.sessionFactory
        def session = sessionFactory.currentSession
        def sql = new Sql(session.connection())
        def sqlQueryString = """select twgrinfo_text text from twgrinfo
	    					    where  twgrinfo_name = ${name}
	    					    and    twgrinfo_label = ${label}
	    						and twgrinfo_source_ind =
	       						(select nvl( ${source},nvl( max(twgrinfo_source_ind ),'B'))
	        					from twgrinfo
	        					where  twgrinfo_name = ${name}
	        					and    twgrinfo_label = ${label}
	        					and twgrinfo_source_ind='L')
	    						order by twgrinfo_sequence"""
	   
		def infoText = ""
		sql.rows(sqlQueryString).each {t -> infoText += t.text + "\n"}
		if(infoText == "null\n") {
            infoText = ""
        }
        return infoText
    }

}

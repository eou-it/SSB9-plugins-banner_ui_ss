/** *****************************************************************************
 � 2011 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
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

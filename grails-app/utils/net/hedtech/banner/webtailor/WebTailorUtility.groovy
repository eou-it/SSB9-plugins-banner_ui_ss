/*******************************************************************************
Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
package net.hedtech.banner.webtailor
import groovy.sql.Sql
import grails.util.Holders as SCH
import org.grails.web.util.GrailsApplicationAttributes as GA

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

/*******************************************************************************
 Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package net.hedtech.banner.webtailor

import grails.util.Holders
import groovy.sql.Sql
import org.hibernate.SessionFactory

/**
 * This is a helper class that is used to help common validation and other processing for
 * Web Tailor objects
 *
 */
class WebTailorUtility {

    public static String getInfoText(String name, String label, String source = '') {
        SessionFactory sessionFactory = Holders.getGrailsApplication().getMainContext().sessionFactory
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

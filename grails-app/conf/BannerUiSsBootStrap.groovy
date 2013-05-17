/*******************************************************************************
Copyright 2009-2013 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
import org.codehaus.groovy.grails.commons.ConfigurationHolder as CH

class BannerUiSsBootStrap {

	def init = { servletContext ->

            def timeoutSeconds = ( CH.config.banner?.transactionTimeout instanceof Integer
                                   ? CH.config.banner?.transactionTimeout
                                   : 30 )
            servletContext.setAttribute( "transactionTimeout", timeoutSeconds )
	}
}

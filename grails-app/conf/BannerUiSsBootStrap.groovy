/*******************************************************************************
Copyright 2009-2014 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

class BannerUiSsBootStrap {

    def grailsApplication

	def init = { servletContext ->

            def timeoutSeconds = ( grailsApplication.config.banner?.transactionTimeout instanceof Integer
                                   ? grailsApplication.config.banner?.transactionTimeout
                                   : 30 )
            servletContext.setAttribute( "transactionTimeout", timeoutSeconds )

        servletContext.setAttribute( "loginEndpoint", grailsApplication.config?.loginEndpoint?: "" )
        servletContext.setAttribute( "logoutEndpoint", grailsApplication.config?.logoutEndpoint?: "" )

        if ((true == grailsApplication.config?.guestAuthenticationEnabled) && "cas".equalsIgnoreCase(grailsApplication.config?.banner?.sso?.authenticationProvider.toString())) {
            servletContext.setAttribute("guestLoginEnabled", true)
        }
	}
}

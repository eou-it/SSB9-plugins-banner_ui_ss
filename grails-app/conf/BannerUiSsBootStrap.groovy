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
        if("saml".equalsIgnoreCase(grailsApplication.config?.banner?.sso?.authenticationProvider.toString())) {
            servletContext.setAttribute( "logoutEndpoint", "saml/logout" )
        } else {
            servletContext.setAttribute( "logoutEndpoint", grailsApplication.config?.logoutEndpoint?: "" )
        }

        if ((true == grailsApplication.config?.guestAuthenticationEnabled) && (!"default".equalsIgnoreCase(grailsApplication.config?.banner?.sso?.authenticationProvider.toString()))) {
            servletContext.setAttribute("guestLoginEnabled", true)
        } else{
            servletContext.setAttribute("guestLoginEnabled", false)
        }
	}
}

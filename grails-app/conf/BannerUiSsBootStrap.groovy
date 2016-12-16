
/*******************************************************************************
Copyright 2009-2016 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

import net.hedtech.banner.controllers.ControllerUtils

class BannerUiSsBootStrap {
    public static String localLogoutEnable="saml/logout?local=true";
    public static String globalLogoutEnable="saml/logout";
    def grailsApplication
    def themeService

	def init = { servletContext ->

            def timeoutSeconds = ( grailsApplication.config.banner?.transactionTimeout instanceof Integer
                                   ? grailsApplication.config.banner?.transactionTimeout
                                   : 30 )
            servletContext.setAttribute( "transactionTimeout", timeoutSeconds )

        servletContext.setAttribute( "loginEndpoint", grailsApplication.config?.loginEndpoint?: "" )
        if(ControllerUtils.isSamlEnabled()) {
            if(ControllerUtils.isLocalLogoutEnabled()){
                servletContext.setAttribute( "logoutEndpoint", localLogoutEnable )
            }else{
                servletContext.setAttribute( "logoutEndpoint", globalLogoutEnable )
            }
        } else {
            servletContext.setAttribute( "logoutEndpoint", grailsApplication.config?.logoutEndpoint?: "" )
        }

        if ((true == grailsApplication.config?.guestAuthenticationEnabled) && (!"default".equalsIgnoreCase(grailsApplication.config?.banner?.sso?.authenticationProvider.toString()))) {
            servletContext.setAttribute("guestLoginEnabled", true)
        } else{
            servletContext.setAttribute("guestLoginEnabled", false)
        }

        //Import theme templates
        themeService.importTemplates(false)
	}
}

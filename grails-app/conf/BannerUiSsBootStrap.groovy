
/*******************************************************************************
Copyright 2009-2017 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
class BannerUiSsBootStrap {
    public static String localLogoutEnable="saml/logout?local=true";
    public static String globalLogoutEnable="saml/logout";
    def configPropertiesService
    def grailsApplication
    def themeService

    def init = {
        configPropertiesService.setTransactionTimeOUt()
        configPropertiesService.setLoginEndPointUrl()
        configPropertiesService.setLogOutEndPointUrl()
        configPropertiesService.setGuestLoginEnabled()
        themeService.importTemplates(false)
    }
}

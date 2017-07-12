
/*******************************************************************************
Copyright 2009-2017 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
class BannerUiSsBootStrap {
    def themeService

    def init = {
        themeService.importTemplates(false)
    }
}

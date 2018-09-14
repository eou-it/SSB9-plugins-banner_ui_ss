/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui

class ThemeTagLib {
    def theme = { attrs, body ->
        def themeConfig = grailsApplication.config.banner?.theme
        String themeName
        String mepCodeParam
        def eteUrl
        
        //ETE and BTE mep code compatibility
        if(session.mep) {
            if (themeConfig?.url) {
                eteUrl = (themeConfig.url ==~ /.*theme.*.elluciancloud.com.*/)
                if (eteUrl) {
                    themeName = themeConfig.name ? themeConfig.name : ''
                } else {
                    themeName = themeConfig.name ? (themeConfig.name + session.mep) : session.mep
                }
                mepCodeParam = "&mepCode=${session.mep}"
            }
        } else {
            if(themeConfig.name) {
                themeName = themeConfig.name
            }
            mepCodeParam=''
        }

        
        String themeTemplate = themeConfig.template
        String cssLink
        if((themeName || session.mep) && themeTemplate) {
            cssLink = "<link rel='stylesheet' type='text/css' "
            if (themeConfig?.url) {
                cssLink += "href='${themeConfig.url}/getTheme?name=${themeName}&template=${themeTemplate + mepCodeParam}'>"
            } else {
                if(session.mep) {
                    cssLink += "href='${createLink(controller: "theme", action: "getTheme", params: [name: themeName, template: themeTemplate, mepCode: session.mep])}'>"
                } else {
                    cssLink += "href='${createLink(controller: "theme", action: "getTheme", params: [name: themeName, template: themeTemplate])}'>"
                }
            }
        }
        out << cssLink
    }

}

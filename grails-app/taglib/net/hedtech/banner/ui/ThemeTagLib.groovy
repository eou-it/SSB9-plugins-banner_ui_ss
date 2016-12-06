/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui

class ThemeTagLib {
    def theme = { attrs, body ->
        def themeConfig = grailsApplication.config.banner?.theme
        String themeName = session.mep ?: themeConfig.name
        String themeTemplate = themeConfig.template ?: 'all'
        String cssLink
        if(themeName && themeTemplate) {
            cssLink = "<link rel='stylesheet' type='text/css'"
            if (themeConfig?.url) {
                if(session.mep) {
                    cssLink += "href='${themeConfig.url}/getTheme?name=${themeName}&template=${themeTemplate}&mepCode=${session.mep}'>"
                } else {
                    cssLink += "href='${themeConfig.url}/getTheme?name=${themeName}&template=${themeTemplate}'>"
                }
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

/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui

class ThemeTagLib {
    def theme = { attrs, body ->
        def themeConfig = grailsApplication.config.banner?.theme
        String themeName
        String mepCodeParam
        if(session.mep) {
            themeName = themeConfig.name ? (themeConfig.name + session.mep) : session.mep
            mepCodeParam = "&mepCode=${session.mep}"
        } else {
            themeName = themeConfig.name
            mepCodeParam=''
        }
        String themeTemplate = themeConfig.template ?: 'all'
        String cssLink
        if(themeName && themeTemplate) {
            cssLink = "<link rel='stylesheet' type='text/css '"
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

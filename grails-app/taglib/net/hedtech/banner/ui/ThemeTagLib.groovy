/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui

class ThemeTagLib {
    def theme = { attrs, body ->
        def themeConfig = grailsApplication.config.banner?.theme
        String text
        if (themeConfig?.name && themeConfig?.template) {
            String themeName = session.mep ?: themeConfig.name // future: send mep separately
            String themeTemplate = themeConfig.template
            if(themeConfig?.url) {
              text = "<link rel='stylesheet' type='text/css' href='${themeConfig.url}/getTheme?name=${themeName}&template=${themeTemplate}'>"
            } else {
              text = "<link rel='stylesheet' type='text/css' href='${createLink(controller:"theme", action: "getTheme",  params: [name: themeName, template: themeTemplate])}'>"
            }
          }
        out << text
    }
}

// Copyright 2013-2016 Ellucian Company L.P. and its affiliates.
package net.hedtech.banner.ui

class ThemeTagLib {
    def theme = { attrs, body ->
        def themeConfig = grailsApplication.config.banner?.theme
        if ( themeConfig?.url ) {
            String themeUrl = themeConfig.url
            String themeName = session.mep ?: themeConfig.name // future: send mep separately
            String themeTemplate = themeConfig.template

            String text ="<link rel='stylesheet' type='text/css' href='${createLink(controller:"theme", action: "getTheme",  params: [name: themeName, template: themeTemplate, themeUrl: themeUrl])}'>"
            out << text
        }
    }
}

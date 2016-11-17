/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.theme

import grails.converters.JSON
import net.hedtech.banner.general.ConfigurationData
import org.apache.log4j.Logger


class ThemeService {
    def configurationDataService
    private static final Logger log = Logger.getLogger( this.getClass() )

    def saveTheme(String fileName, def clobData, String type) {
        def theme = ConfigurationData.findByNameAndType(fileName, type)
        if (theme) {
            theme.value = clobData
            theme = configurationDataService.update(theme)
        } else {
            theme = configurationDataService.create([name: fileName, type: type, value: clobData])
        }
        log.debug "Saved theme $theme"
        theme
    }

    def deleteTheme(String fileName) {
        def theme = ConfigurationData.findByName(fileName)
        if(theme) {
            configurationDataService.delete(theme)
        }
    }

    def listThemes(args) {
        configurationDataService.list(args)
    }

    def getThemeJSON(name) {
        def theme = ConfigurationData.findByNameAndType(name, 'json')
        theme = JSON.parse(theme.value)
        return theme
    }

}

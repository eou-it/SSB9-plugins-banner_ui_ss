/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.theme

import grails.converters.JSON
import net.hedtech.banner.general.ConfigurationData
import net.hedtech.banner.ui.theme.ThemeUtil
import org.apache.log4j.Logger


class ThemeService {
    def configurationDataService
    def themeUtil = new ThemeUtil()
    def static final types = [theme:'json', template:'scss']
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
        def theme = ConfigurationData.findByNameAndType(fileName, types.theme)
        if(theme) {
            configurationDataService.delete(theme)
        }
    }

    def deleteTemplate(String fileName) {
        def template = ConfigurationData.findByNameAndType(fileName, types.template)
        if(template) {
            configurationDataService.delete(template)
        }
    }

    def listThemes(args) {
        def c = ConfigurationData.createCriteria()
        def results = c.list (args) {
            eq('type', types.theme)
        }
        results
    }

    def listTemplates(args) {
        def c = ConfigurationData.createCriteria()
        def results = c.list (args) {
            eq('type', types.template)
        }
        results
    }

    def getThemeJSON(name) {
        def theme = ConfigurationData.findByNameAndType(name, types.theme)
        theme = theme ? JSON.parse(theme.value): ''
        return theme
    }

    def getTemplateSCSS(name) {
        def template = ConfigurationData.findByNameAndType(name, types.template)
        template = template ? template.value : ''
        return template
    }

    def getCSS(templateName, themeName) {
        def template = ConfigurationData.findByNameAndType(templateName, types.template)
        def themeJSON = getThemeJSON(themeName)
        def content = ''
        if(template && themeJSON) {
            def sorted = new TreeMap( { a,b ->
                def v = b.length() <=> a.length();
                if ( v ) {
                    return v;
                } else {
                    return b.compareTo(a);
                }
            })

            sorted.putAll( themeJSON )

            content = template.value
            sorted.each { k, v ->
                if ( v ) {
                    content = content.replace( "\$theme$k", v ) // also add "/*theme$k*/ " +  except for logo
                }
            }
        }
        return content
    }

}

/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.theme

import grails.converters.JSON
import grails.util.Holders
import net.hedtech.banner.general.ConfigurationData
import net.hedtech.banner.ui.theme.ThemeUtil
import net.sf.ehcache.Cache
import net.sf.ehcache.Element
import org.apache.log4j.Logger
import org.apache.commons.io.FilenameUtils
import org.omg.CORBA.portable.ApplicationException
import org.codehaus.groovy.grails.web.context.ServletContextHolder


class ThemeService {
    def configurationDataService
    def grailsApplication
    def static final types = [theme:'json', template:'scss']
    def static themesPath = Holders.getConfig().banner.theme.path
    private static final Logger log = Logger.getLogger( this.getClass() )

    def saveTheme(String fileName, String type, def content) {
        def theme = ConfigurationData.findByNameAndType(fileName, type)
        if (theme) {
            theme.value = content
            theme = configurationDataService.update(theme)
        } else {
            theme = configurationDataService.create([name: fileName, type: type, value: content])
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

    def getTemplateSCSS(templateName) {
        File templateFile
        def templateSCSSS
        def templateObj = ConfigurationData.findByNameAndType(templateName, types.template)
        if (!templateObj) {
            def template = Holders.getConfig().banner.theme?.template
            templateFile = new File("${System.properties['base.dir'] + '/web-app/css/theme'}/${template}")
            templateSCSSS = templateFile.text
        } else {
            templateSCSSS = templateObj.value
        }

        return templateSCSSS
    }

    def getCSS(templateName, themeName, themeUrl) {
        def content
        if(themeUrl) {
           content = getCSSFromCache(themeName, templateName, themeUrl)
        } else {
            def templateSCSSS = getTemplateSCSS(templateName)
            def themeJSON = getThemeJSON(themeName)
            if (themeJSON) {
                content = ThemeUtil.formatTheme(templateSCSSS, themeJSON)
            }
        }
        return content
    }

    /* Stores the theme CSS file in the cache and Retrieves it from cache for subsequent requests */
    def getCSSFromCache(themeName, templateName, themeUrl)     {
        def fileName = ThemeUtil.CSSFileName(themeName, templateName)
        Cache cache = ThemeUtil.getThemeCache(themeName, templateName)
        if(ThemeUtil.expired(fileName, cache)) {
            File file = new File("${themesPath}/${fileName}")
            def themeJSON = JSON.parse(new URL( "${themeUrl}/get?name=${themeName}" ).text)
            def templateSCSS = getTemplateSCSS(templateName)
            def content = ThemeUtil.formatTheme(templateSCSS, themeJSON)
            file.withWriter( 'utf-8' ) {
                file.write( content )
            }
            cache.put(new Element(file.name, file.text))
        }
        Element ele = cache.get(fileName)
        return ele.objectValue
    }


    def importTemplates(loadFromPlugin) {
        def path = ServletContextHolder.servletContext.getRealPath('/css/theme')
        def count=0
        log.info "Checking/loading templates."
        try {
            new File(path).eachFileMatch(~/.*.scss/) { file ->
                def fileName = FilenameUtils.getBaseName(file.name)
                if((fileName == 'banner-ui-ss' && loadFromPlugin) || (fileName != 'banner-ui-ss' &&  !loadFromPlugin)) {
                    if (!fileName.endsWith('-patch')) {
                        def template = ConfigurationData.findByNameAndType(fileName, 'scss')
                        def map = [
                                name        : fileName,
                                type        : types.template,
                                value       : file.text,
                                dataOrigin  : 'Banner',
                                lastModified: new Date()
                        ]
                        if (!template) {
                            configurationDataService.create(map)
                            count++;
                        }
                    }
                }
            }
        } catch (ApplicationException ae) {
            log.error "Unable to import templates $ae"
        }
        log.info "Finished checking/loading system required templates. templated loaded: $count"

    }
}

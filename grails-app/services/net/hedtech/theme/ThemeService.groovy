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
import net.hedtech.banner.exceptions.ApplicationException
import org.codehaus.groovy.grails.web.context.ServletContextHolder


class ThemeService {
    def configurationDataService
    def grailsApplication
    def static final types = [theme:'json', template:'scss']
    private static final Logger log = Logger.getLogger( this.getClass() )


    def saveTheme(String name, String type, def content) {
        name = ThemeUtil.sanitizeName(name)
        def theme = ConfigurationData.findByNameIlikeAndType(name, type)
        if (theme) {
            theme.name = name
            theme.value = content
            theme = configurationDataService.update(theme)
        } else {
            theme = configurationDataService.create([name: name, type: type, value: content])
        }
        log.debug "Saved theme $theme"
        def cacheKey
        if(type == types.template) {
            cacheKey = ".${name}.css"
        } else {
            cacheKey = "${name}."
        }
        ThemeUtil.removeElementFromCache(cacheKey)
        log.debug "Cleared cache for $theme"
        theme
    }

    def deleteTheme(def name) {
        def theme = ConfigurationData.findByNameAndType(name, types.theme)
        if(theme) {
            configurationDataService.delete(theme)
        }
    }

    def deleteTemplate(def name) {
        def template = ConfigurationData.findByNameAndType(name, types.template)
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
        def theme = ConfigurationData.findByNameIlikeAndType(name, types.theme)
        theme = theme ? JSON.parse(theme.value): ''
        return theme
    }

    def getTemplateSCSS(templateName) throws ApplicationException{
        File templateFile
        def templateSCSS
        def templateObj = ConfigurationData.findByNameIlikeAndType(templateName, types.template)
        if (!templateObj) {
            def template = Holders.getConfig().banner.theme?.template
            def path = "${ServletContextHolder.servletContext.getRealPath('/css/theme')}"
                new File(path).eachFileMatch(~/.*.scss/) { file ->
                    def fileName = FilenameUtils.getBaseName(file.name)
                    if(fileName.toLowerCase() == template.toLowerCase()) {
                        templateSCSS = file.text
                }
            }
        } else {
            templateSCSS = templateObj.value
        }

        return templateSCSS
    }

    def getCSS(themeName, templateName) {
        def css
        Cache cache = ThemeUtil.getThemeCache()
        def templateSCSS = getTemplateSCSS(templateName)
        def themeJSON = getThemeJSON(themeName)
        if(templateSCSS && themeJSON) {
            def cssName = ThemeUtil.cssName(themeName, templateName)
            if (ThemeUtil.expired(cssName, cache)) {
                css = ThemeUtil.formatTheme(templateSCSS, themeJSON)
                cache.put(new Element(cssName, css))
            }
            Element ele = cache.get(cssName)
            if (ele) {
                css = ele.objectValue
            }
        } else {
            ThemeUtil.clearCache()
            log.debug "Cleared theme cache."
        }
        return css
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
                        def template = ConfigurationData.findByNameIlikeAndType(ThemeUtil.sanitizeName(fileName), types.template)
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

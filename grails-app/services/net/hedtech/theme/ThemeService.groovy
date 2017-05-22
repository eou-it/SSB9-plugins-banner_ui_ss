/*******************************************************************************
 Copyright 2016-2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.theme

import grails.converters.JSON
import grails.util.Holders
import net.hedtech.banner.ui.theme.ThemeUtil
import net.sf.ehcache.Cache
import net.sf.ehcache.Element
import org.apache.log4j.Logger
import org.apache.commons.io.FilenameUtils
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.general.ConfigurationData
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import net.hedtech.banner.general.ConfigurationDataService

class ThemeService {
    def configurationDataService
    def grailsApplication
    def static appId = "THEME"
    def static final types = [theme:'json', template:'scss']
    def static final typesList = ['json', 'scss']
    private static final Logger log = Logger.getLogger( this.getClass() )


    def saveTheme(String name, String type, def content) {
        name = ThemeUtil.sanitizeName(name).toLowerCase()
        ConfigurationData theme = ConfigurationData.fetchByNameAndType(name, type,appId)
        if (theme) {
            theme.name = name
            theme.value = content
            theme.appId = appId
            theme = configurationDataService.update(theme)
        } else {
            theme = configurationDataService.create([name: name, type: type, value: content ,appId: appId])
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
        ConfigurationData theme = ConfigurationData.fetchByNameAndType(name, types.theme,appId)
        if(theme) {
            configurationDataService.delete(theme)
        }
    }

    def deleteTemplate(def name) {
        ConfigurationData template = ConfigurationData.fetchByNameAndType(name, types.template,appId)
        if(template) {
            configurationDataService.delete(template)
        }
    }

    def listThemes(args) {
        def results = ConfigurationData.fetchByType(types.theme,appId)
        results
    }

    def listTemplates(args) {
        def results = ConfigurationData.fetchByType(types.template,appId)
        results
    }

    def getThemeJSON(name) {
        //Not mapped to configuration Data because we are converting it to json Object
        def theme = ConfigurationData.fetchByNameAndType(name?.toLowerCase(), types.theme,appId)
        def themeName = theme?.name
        theme = theme ? JSON.parse(theme.value): ''
        if(theme && theme !=''){
            theme.put("name",themeName?.toLowerCase())
        }
        return theme
    }

    def getTemplateSCSS(templateName) throws ApplicationException{
        File templateFile
        def templateSCSS
        ConfigurationData templateObj = ConfigurationData.fetchByNameAndType(templateName?.toLowerCase(), types.template,appId)
        def defaultTemplate = Holders.getConfig().banner.theme?.template
        if (templateObj) {
            templateSCSS = templateObj.value
        } else if (templateName?.equalsIgnoreCase( defaultTemplate )) {
            def path = "${ServletContextHolder.servletContext.getRealPath('/css/theme')}"
            new File(path).eachFileMatch(~/.*\.scss/) { file ->
                def fileName = FilenameUtils.getBaseName(file.name)
                if(fileName.toLowerCase() == defaultTemplate.toLowerCase()) {
                    templateSCSS = file.text
                }
            }
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
            new File(path).eachFileMatch(~/.*\.scss/) { file ->
                def fileName = FilenameUtils.getBaseName(file.name).toLowerCase()
                if((fileName == 'banner-ui-ss' && loadFromPlugin) || (fileName != 'banner-ui-ss' &&  !loadFromPlugin)) {
                    if (!fileName.endsWith('-patch')) {
                        ConfigurationData template = ConfigurationData.fetchByNameAndType(ThemeUtil.sanitizeName(fileName).toLowerCase(), types.template,appId)
                        def map = [
                                name        : fileName,
                                type        : types.template,
                                value       : file.text,
                                dataOrigin  : 'Banner',
                                lastModified: new Date(),
                                appId : appId

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

/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui.theme

import grails.converters.JSON
import groovy.json.JsonOutput
import net.hedtech.banner.exceptions.ApplicationException


class ThemeController {
    def themeService

    def index() {
        render "index"
    }

    def list() {
        def themes = themeService.listThemes([sort: "name", order: "asc"])
        render themes.name as JSON
    }

    def listTemplates() {
        def templates = themeService.listTemplates([sort: "name", order: "asc"])
        render templates.name as JSON
    }

    def get() {
        assert params.name
        try {
            def json = themeService.getThemeJSON( params.name )
            response.contentType = 'application/json'
            render JsonOutput.toJson( json )
        } catch ( IOException e ) {
            log.warn( "Failed to load theme ${params.name} ${e}" )
            response.status = 404
            render ""
        }
    }


    def getTemplate() {
        assert params.name
        try {
            def scss = themeService.getTemplateSCSS(params.name)
            response.contentType = 'text/x-scss'
            render scss
        } catch ( ApplicationException ae ) {
            log.error "Failed to load theme ${params.name} ${ae}"
            response.status = 404
            render ""
        }
    }

    def getTheme() {
        assert params.name
        def templateName = params.template
        def themeName = params.name
        def themeConfig = grailsApplication.config.banner?.theme
        def content

        if ( !templateName ) {
            templateName = themeConfig.template
        }
        try {
            content = themeService.getCSS(themeName, templateName)
            if(content) {
                render(text: content, contentType: "text/css")
            } else {
                log.error "Failed to format theme ${themeName} in ${templateName}"
                response.status = 404
                render(text: "", contentType: "text/css")
            }
        } catch ( ApplicationException ae ) {
            log.error "Failed to format theme ${themeName} in ${templateName}. ${ae}"
            response.status = 404
            render ""
        }
    }

    def clearCache()  {
        ThemeUtil.clearCache()
        render ""
    }
}

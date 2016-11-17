/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme


import grails.converters.JSON
import grails.util.Holders

import groovy.json.JsonOutput
import java.io.IOException

import org.apache.log4j.Logger

class ThemeController {
    def themeUtil = new ThemeUtil()
    def themeService
    private static final Logger log = Logger.getLogger( this.getClass() )

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
            response.contentType = 'text/css'
            render scss
        } catch ( IOException e ) {
            log.warn( "Failed to load theme ${params.name} ${e}" )
            response.status = 404
            render ""
        }
    }

    def getTheme() {
        assert params.name
        def templateName = params.template
        def themeName = params.name
        def content
        if ( !templateName ) {
            templateName = "all"
        }
        if ( themeName == 'THEME_EDITOR_LOAD_TEMPLATE' ) {
            themeName = Holders.getConfig().banner.theme.name
        }

        try {
            if(params.themeUrl) {
                content = themeUtil.getCSSFromCache(themeName, templateName, params.themeUrl)
            } else {
                content = themeService.getCSS(templateName, themeName)
            }
            render( text:content, contentType: "text/css" )
        } catch ( IOException e ) {
            log.warn( "Failed to format theme ${themeName} in ${templateName}. ${e}" )
            response.status = 404
            render ""
        }
    }

    def clearCache()  {
        themeUtil.clearCache()
        render ""
    }
}

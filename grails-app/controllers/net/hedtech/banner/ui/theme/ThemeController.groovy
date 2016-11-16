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
        def themes = themeService.listThemes([sort: "name", order: "asc"]).name as JSON
        render themes
    }

    def templateList() {
        def templates = themeService.listThemes([sort: "name", order: "desc"])
        render themeUtil.formatTemplateNames(templates.name) as JSON
    }

    def get() {
        assert params.name
        try {
            def json = themeService.getThemeJSON( themeUtil.fileName(params.name) )
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
            def json = themeService.getThemeCSS( themeUtil.fileName(params.name) )
            response.contentType = 'text/css'
            render JsonOutput.toJson( json )
        } catch ( IOException e ) {
            log.warn( "Failed to load theme ${params.name} ${e}" )
            response.status = 404
            render ""
        }
    }


    /*
        For theme-aware applications
    */
    def getCachedCSS() {
        def themeName = params.name
        def templateName = params.template
        def themeUrl = params.themeUrl
        if ( !templateName ) {
            templateName = "all"
        }
        try {
            def content = themeUtil.getCSSFromCache(themeName, templateName, themeUrl)
            render( text:content, contentType: "text/css" )

        } catch (IOException e) {
            log.warn( "Failed to get theme ${params.name} in ${templateName}. ${e}" )
        }
    }

    /*
        For non-theme-aware applications
    */
    def getTheme() {
        assert params.name
        def templateName = params.template
        def themeName = params.name
        if ( !templateName ) {
            templateName = "all"
        }

        try {
            def themeJSON = themeService.getThemeJSON(themeName)
            def content = themeUtil.formatTheme( templateName, themeJSON)
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

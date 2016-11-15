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
    private static final Logger log = Logger.getLogger( this.getClass() )

    def index() {
        //response.status = 404
       render "index"
    }

    def list() {
        render( themeUtil.getThemes() as JSON )
    }

    def save() {
        def data = request.JSON
        themeUtil.saveTheme( data )
    }

    def get() {
        assert params.name
        try {
            def json = themeUtil.getThemeJson( params.name )
            response.contentType = 'application/json'
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
            def themeJSON = themeUtil.getThemeJson(themeName)
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

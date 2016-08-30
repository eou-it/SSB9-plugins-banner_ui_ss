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

    def getTheme() {
        assert params.name
        def templateName = params.template
        if ( !templateName || templateName == "" ) {
            templateName = "all"
        }

        try {
            def content = themeUtil.formatTheme( params.name, templateName )
            render( text:content, contentType: "text/css" )
        } catch ( IOException e ) {
            log.warn( "Failed to format theme ${params.name} in ${templateName}. ${e}" )
            response.status = 404
            render ""
        }
    }
}

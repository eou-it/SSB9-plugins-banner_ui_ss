/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme


import grails.converters.JSON
import grails.util.Holders

import groovy.io.FileType
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

import java.io.File
import java.util.TreeMap

import org.apache.log4j.Logger
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import org.codehaus.groovy.grails.web.servlet.GrailsApplicationAttributes

class ThemeEditorController {
    def themeUtil = new ThemeUtil()
    private static final Logger log = Logger.getLogger( this.getClass() )


    def index() {
        render( view: "themeEditor", model: { themes: themeUtil.getThemes()} )
    }

    def save() {
        def data = request.JSON
        assert data.name, "Must include name of theme"

        themeUtil.saveTheme( data.name, data )
        render "OK"
    }

    def delete() {
        assert params.name
        render themeUtil.deleteTheme( params.name )
    }
}

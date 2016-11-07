/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme


import grails.converters.JSON
import grails.util.Holders

import groovy.io.FileType
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.sql.Sql
import net.hedtech.theme.ThemeUpload

import javax.management.Query
import java.io.File
import java.util.TreeMap

import org.apache.log4j.Logger
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import org.codehaus.groovy.grails.web.servlet.GrailsApplicationAttributes

class ThemeEditorController {
    def themeUtil = new ThemeUtil()
    private static final Logger log = Logger.getLogger( this.getClass() )
    def themeUploadService
    //def dataSource


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

    def upload() {
        boolean errMsg = false;

        def reqFile = request.getFile("file")
        def name = reqFile.getOriginalFilename()
        byte[] bFile = reqFile.getBytes()
        def type = name?.substring(name?.lastIndexOf(".") + 1);
        def val = themeUtil.allowedExtension(type)
        if(val) {
            //themeUtil.uploadTheme(file, datasource);
            def uploadservice = themeUploadService .saveTheme(name,bFile, type)
            errMsg = false;
        }else{
            errMsg = true;
        }
        render errMsg;
    }
}

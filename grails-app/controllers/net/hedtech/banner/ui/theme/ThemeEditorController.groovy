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
import org.springframework.web.multipart.commons.CommonsMultipartFile

import javax.management.Query
import java.io.File
import java.sql.Clob
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
        String clobData;
        //CommonsMultipartFile testFile = request.getFile('file')
        InputStream inputStream = reqFile.getInputStream()
        clobData = inputStream?.getText()
        def type = name?.substring(name?.lastIndexOf(".") + 1);
        def val = themeUtil.allowedExtension(type)
        if(val) {
            def uploadservice = themeUploadService .saveTheme(name,clobData, type)
            errMsg = false;
        }else{
            errMsg = true;
        }
        render errMsg;
    }
}

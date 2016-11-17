/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme

import groovy.json.JsonOutput
import org.apache.commons.io.FilenameUtils
import org.apache.log4j.Logger

class ThemeEditorController {
    def themeUtil = new ThemeUtil()
    private static final Logger log = Logger.getLogger( this.getClass() )
    def static fileExtensions=["json", "scss"]
    def themeService

    def index() {
        render( view: "themeEditor", model: { themes: themeUtil.getThemes()} )
    }

    def save() {
        def data = request.JSON
        assert data.name, "Must include name of theme"
        def name = themeUtil.fileName(data.name)
        def json = JsonOutput.toJson(data)
        def type = fileExtensions[0]
        themeService.saveTheme(name, json, type)

        render "OK"
    }

    def deleteTheme() {
        assert params.name
        render themeService.deleteTheme( params.name)
    }

    def deleteTemplate() {
        assert params.name
        render themeService.deleteTemplate( params.name )
    }

    def upload() {
        boolean errMsg = false
        String clobData
        def file = request.getFile("file")
        def fileName = FilenameUtils.getBaseName(file.getOriginalFilename());
        InputStream inputStream = file.getInputStream()
        clobData = inputStream?.getText()
        String type = FilenameUtils.getExtension(file.getOriginalFilename())
        if(fileExtensions.contains(type)) {
            themeService.saveTheme(fileName, clobData, type)
            errMsg = false;
        }else{
            errMsg = true;
        }
        render errMsg;
    }
}

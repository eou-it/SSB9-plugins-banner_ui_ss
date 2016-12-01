/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme

import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.apache.commons.io.FilenameUtils
import org.apache.log4j.Logger
import net.hedtech.banner.exceptions.ApplicationException

class ThemeEditorController {
    def themeUtil = new ThemeUtil()
    private static final Logger log = Logger.getLogger(this.getClass())
    def static fileExtensions = ["json", "scss"]
    def themeService

    def index() {
        render(view: "themeEditor", model: {
            themes:
            themeUtil.getThemes()
        })
    }

    def save() {
        def data = request.JSON
        assert data.name, "Must include name of theme"
        def name = data.name
        def json = JsonOutput.toJson(data)
        def type = fileExtensions[0]
        themeService.saveTheme(name, type, json)

        render "OK"
    }

    def deleteTheme() {
        assert params.name
        render themeService.deleteTheme(params.name)
    }

    def deleteTemplate() {
        assert params.name
        render themeService.deleteTemplate(params.name)
    }

    def upload() {
        def msgCode
        String clobData
        try {
            def file = request.getFile("file")
            def fileName = FilenameUtils.getBaseName(file.getOriginalFilename());
            def gb = file?.size / (1024 * 1024 * 1024)
            if (gb > 4) {
                msgCode = "largeData"
            } else if (gb == 0) {
                msgCode = "noData"
            } else {
                String type = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase()
                InputStream inputStream = file.getInputStream()
                if('json'.equalsIgnoreCase(type)){
                    new JsonSlurper().parseText(inputStream?.getText())
                }else if ('scss'.equalsIgnoreCase(type)){
                     inputStream?.getText('utf-8')
                }
                clobData= file?.getInputStream()?.getText()
                if (fileExtensions.contains(type)) {
                    themeService.saveTheme(fileName, type, clobData)
                    msgCode = "success"
                } else {
                    msgCode = "format"
                }
            }
        } catch (ApplicationException ae) {
            msgCode = "error"
            log.error "Failed to upload file ${ae}"
        }
        render msgCode
    }
}

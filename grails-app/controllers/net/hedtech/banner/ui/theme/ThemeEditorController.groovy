/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme

import grails.gorm.transactions.Transactional
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.apache.commons.io.FilenameUtils
import net.hedtech.banner.exceptions.ApplicationException

class ThemeEditorController {
    def themeUtil = new ThemeUtil()
    def static fileExtensions = ["json", "scss"]
    def themeService

    def index() {
        render(view: "themeEditor", model: {
            themes:
            themeService.listThemes([sort: "name", order: "asc"])
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
                if (fileExtensions.contains(type)) {
                    InputStream inputStream = file.getInputStream()
                    if('json'.equals(type)){
                        new JsonSlurper().parseText(inputStream?.getText())
                    }else if ('scss'.equals(type)){
                        inputStream?.getText('utf-8')
                    }
                    clobData= file?.getInputStream()?.getText()
                    themeService.saveTheme(fileName, type, clobData)
                    msgCode = "success"
                } else {
                    msgCode = "invalidFormat"
                }
            }
        } catch (ApplicationException ae) {
            msgCode = "error"
            log.error "Failed to upload file ${ae}"
        }
        render msgCode
    }
}

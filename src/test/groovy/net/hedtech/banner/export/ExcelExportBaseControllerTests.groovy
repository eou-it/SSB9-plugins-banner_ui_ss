/*******************************************************************************
 Copyright 2009-2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.export

import grails.test.mixin.*
import grails.test.runtime.FreshRuntime

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(ExcelExportBaseController)
@FreshRuntime
class ExcelExportBaseControllerTests {

    void testDefaultSecurity() {
        controller.exportExcelFile()

        assertEquals 403,controller.response.status
    }


    void testAllowsAccess() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        controller.excelExportService = new ExcelExportService()
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
    }


    void testFileTypesBad() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        controller.params.fileType = "bad"
        controller.exportExcelFile()

        assertEquals 403, controller.response.status
    }


    void testFileTypesXls() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        controller.excelExportService = new ExcelExportService()
        controller.params.fileType = "xls"
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
    }


    void testFileTypesXlsx() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        controller.excelExportService = new ExcelExportService()
        controller.params.fileType = "xlsx"
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
    }


    void testResponseFilenameHeaderDefault() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        controller.excelExportService = new ExcelExportService()
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
        assertEquals "attachment;filename=\"" + controller.message(code: "net.hedtech.banner.export.ExcelExportBaseController.defaultFileName") + ".xls\"" + ";filename*=utf-8''" + controller.message(code: "net.hedtech.banner.export.ExcelExportBaseController.defaultFileName") + ".xls", controller.response.getHeader("Content-disposition")
    }


    void testResponseFilenameHeaderProvided() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        ExcelExportBaseController.metaClass.getFileName = { return "testFile" }
        controller.excelExportService = new ExcelExportService()
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
        assertEquals "attachment;filename=\"testFile.xls\"" + ";filename*=utf-8''testFile.xls", controller.response.getHeader("Content-disposition")
    }


    void testContentTypeHeader() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        ExcelExportBaseController.metaClass.getFileName = { return "testFile" }
        controller.excelExportService = new ExcelExportService()
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
        assertEquals "application/excel", response.contentType
    }


    void testNullData() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.getFileName = { return "testFile" }
        controller.excelExportService = new ExcelExportService()
        controller.exportExcelFile()

        assertEquals 404, controller.response.status
    }


    void testActualData() {
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: true,
                headers: ["one", "two"],
                data: [ ["11", "12"] ]
        ] }
        ExcelExportBaseController.metaClass.getFileName = { return "testFile" }
        controller.excelExportService = new ExcelExportService()
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
        assertNotNull controller.response.outputStream
        assertTrue controller.response.getContentAsString().size() > 0
    }

    void testUnicodeFileName() {

        def fileName = "\u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0645\u0644\u0641"
        //def fileNameEncoded = URLEncoder.encode(fileName)
        def fileNameEncoded = URLEncoder.encode(fileName ,"utf-8")
        ExcelExportBaseController.metaClass.hasAccess = { return true }
        ExcelExportBaseController.metaClass.retrieveData = { return [success: false] }
        ExcelExportBaseController.metaClass.getFileName = { return fileName }
        controller.excelExportService = new ExcelExportService()
        controller.exportExcelFile()

        assertEquals 200, controller.response.status
        assertEquals "attachment;filename=\"" + fileName + ".xls\"" + ";filename*=utf-8''" + fileNameEncoded + ".xls", controller.response.getHeader("Content-disposition")

    }

}

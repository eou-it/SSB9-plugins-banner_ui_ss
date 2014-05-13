package net.hedtech.banner.export



import grails.test.mixin.*
import org.junit.*

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(ExcelExportBaseController)
class ExcelExportBaseControllerTests {

    void testDefaultSecurity() {
        controller.exportExcelFile()

        assertEquals 403,controller.response.status
    }


    void testAllowsAccess() {
        def testController = new ExcelExportBaseControllerWithAccess()
        testController.excelExportService = new ExcelExportService()
        testController.exportExcelFile()

        assertEquals 200, testController.response.status
    }


    void testFileTypesBad() {
        def testController = new ExcelExportBaseControllerWithAccess()
        controller.params.fileType = "bad"
        testController.exportExcelFile()

        assertEquals 403, testController.response.status
    }


    void testFileTypesXls() {
        def testController = new ExcelExportBaseControllerWithAccess()
        testController.excelExportService = new ExcelExportService()
        controller.params.fileType = "xls"
        testController.exportExcelFile()

        assertEquals 200, testController.response.status
    }


    void testFileTypesXlsx() {
        def testController = new ExcelExportBaseControllerWithAccess()
        testController.excelExportService = new ExcelExportService()
        controller.params.fileType = "xlsx"
        testController.exportExcelFile()

        assertEquals 200, testController.response.status
    }


    void testResponseFilenameHeaderDefault() {
        def testController = new ExcelExportBaseControllerWithAccess()
        testController.excelExportService = new ExcelExportService()
        testController.exportExcelFile()

        assertEquals 200, testController.response.status
        assertEquals "attachment;filename=\"" + ExcelExportBaseController.DEFAULT_FILE_NAME + "\"", controller.response.getHeader("Content-disposition")
    }


    void testResponseFilenameHeaderProvided() {
        def testController = new ExcelExportBaseControllerWithAccessAndFilename()
        testController.excelExportService = new ExcelExportService()
        testController.exportExcelFile()

        assertEquals 200, testController.response.status
        assertEquals "attachment;filename=\"testFile.xls\"", controller.response.getHeader("Content-disposition")
    }


    void testcontentTypeHeader() {
        def testController = new ExcelExportBaseControllerWithAccessAndFilename()
        testController.excelExportService = new ExcelExportService()
        testController.exportExcelFile()

        assertEquals 200, testController.response.status
        assertEquals "application/excel", response.contentType
    }


    void testNullData() {
        def testController = new ExcelExportBaseControllerWithAccessAndFilenameNullData()
        testController.excelExportService = new ExcelExportService()
        testController.exportExcelFile()

        assertEquals 404, testController.response.status
    }


    void testActualData() {
        def testController = new ExcelExportBaseControllerWithAccessAndFilenameWithData()
        testController.excelExportService = new ExcelExportService()
        testController.exportExcelFile()

        assertEquals 200, testController.response.status
        assertNotNull testController.response.outputStream
        assertTrue testController.response.getContentAsString().size() > 0
    }


    private class ExcelExportBaseControllerWithAccess extends ExcelExportBaseController
    {
        Boolean hasAccess() {
            return true
        }

        def getData() {
            return [success: false]
        }
    }


    private class ExcelExportBaseControllerWithAccessAndFilename extends ExcelExportBaseController
    {
        Boolean hasAccess() {
            return true
        }


        String getFileName() {
            return "testFile.xls"
        }


        def getData() {
            return [success: false]
        }
    }


    private class ExcelExportBaseControllerWithAccessAndFilenameNullData extends ExcelExportBaseController
    {
        Boolean hasAccess() {
            return true
        }


        String getFileName() {
            return "testFile.xls"
        }
    }


    private class ExcelExportBaseControllerWithAccessAndFilenameWithData extends ExcelExportBaseController
    {
        Boolean hasAccess() {
            return true
        }


        String getFileName() {
            return "testFile.xls"
        }


        def getData() {
            return [success: true,
                    headers: ["one", "two"],
                    data: [ ["11", "12"] ]
            ]

        }
    }



}

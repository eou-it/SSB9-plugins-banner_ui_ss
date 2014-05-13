package net.hedtech.banner.export

import net.hedtech.banner.exceptions.ApplicationException
import grails.test.GrailsUnitTestCase
import java.text.SimpleDateFormat
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.apache.poi.ss.usermodel.Row


class ExcelExportServiceTests extends GrailsUnitTestCase{
    def excelExportService = new ExcelExportService()

    void testAssertions() {
        try {
            def workBook = excelExportService.getExcelFile(null, ExcelExportService.FileType.xls, null)
            fail "Should not be able to have null data or name."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }

        try {
            def workBook = excelExportService.getExcelFile(null, ExcelExportService.FileType.xlsx, null)
            fail "Should not be able to have null data."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }

        try {
            def workBook = excelExportService.getExcelFile([], ExcelExportService.FileType.xls, null)
            fail "Should not be able to have null title."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }

        try {
            def workBook = excelExportService.getExcelFile([], ExcelExportService.FileType.xls, "")
            fail "Should not be able to have empty title."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }

        try {
            def workBook = excelExportService.getExcelFile(null, ExcelExportService.FileType.xls, "This is the title")
            fail "Should not be able to have null data."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }

        try {
            def workBook = excelExportService.getExcelFile([success: false], ExcelExportService.FileType.xls, "")
            fail "Should not be able to have empty title."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }

        try {
            def workBook = excelExportService.getExcelFile([success: false], ExcelExportService.FileType.xls, null)
            fail "Should not be able to have null title."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }

        try {
            def workBook = excelExportService.getExcelFile([success: false], null, "This is good")
            fail "Should not be able to have null file type."
        } catch (ApplicationException ae) {
            assertEquals ae.message, "@@r1:missingParameters@@"
        }
    }

    void testDocumentTypeAndTitle() {
        def workBook = excelExportService.getExcelFile([success: false], ExcelExportService.FileType.xls, "Test Title")
        assertNotNull workBook
        assertTrue workBook instanceof HSSFWorkbook
        def sheet = workBook.getSheet("Test Title")
        assertNotNull sheet

        workBook = excelExportService.getExcelFile([success: false], ExcelExportService.FileType.xlsx, "Test Title")
        assertNotNull workBook
        assertTrue workBook instanceof XSSFWorkbook
        sheet = workBook.getSheet("Test Title")
        assertNotNull sheet
    }


    void testDocumentWithErrorNoData() {
        def map = [success: false, errorMessage: "Error Message", headers: ["header1", "header2"]]

        def workBook = excelExportService.getExcelFile(map, ExcelExportService.FileType.xls, "Test Title")
        assertNotNull workBook
        assertTrue workBook instanceof HSSFWorkbook
        def sheet = workBook.getSheet("Test Title")
        assertNotNull sheet
        assertNotNull sheet.getRow(0)
        assertNotNull sheet.getRow(1)
        assertNull sheet.getRow(2)

        Row headerRow = sheet.getRow(1)
        assertEquals "header1", headerRow.getCell(0).getStringCellValue()
        assertEquals "header2", headerRow.getCell(1).getStringCellValue()
    }

    void testDocumentWithErrorAndData() {
        def map = [success: false, errorMessage: "Error Message",
                headers: ["header1", "header2"],
                data: [["data01", "data02"], ["data11", "data12"]]
        ]

        def workBook = excelExportService.getExcelFile(map, ExcelExportService.FileType.xls, "Test Title")
        assertNotNull workBook
        assertTrue workBook instanceof HSSFWorkbook
        def sheet = workBook.getSheet("Test Title")
        assertNotNull sheet
        assertNotNull sheet.getRow(0)
        assertNotNull sheet.getRow(1)
        assertNotNull sheet.getRow(2)
        assertNotNull sheet.getRow(3)

        Row errorRow = sheet.getRow(0)
        assertEquals "Error Message", errorRow.getCell(0).getStringCellValue()

        Row headerRow = sheet.getRow(1)
        assertEquals "header1", headerRow.getCell(0).getStringCellValue()
        assertEquals "header2", headerRow.getCell(1).getStringCellValue()

        Row dataRow = sheet.getRow(2)
        assertEquals "data01", dataRow.getCell(0).getStringCellValue()
        assertEquals "data02", dataRow.getCell(1).getStringCellValue()

        dataRow = sheet.getRow(3)
        assertEquals "data11", dataRow.getCell(0).getStringCellValue()
        assertEquals "data12", dataRow.getCell(1).getStringCellValue()
    }


    void testDataFormats() {
        def formatter = new SimpleDateFormat("M/d/yy")
        def dateToUse = new Date()

        def map = [success: false,
                errorMessage: "Error Message",
                headers: ["header1", "header2"],
                data: [["data01", dateToUse], ["data11", dateToUse]]
        ]


        def workBook = excelExportService.getExcelFile(map, ExcelExportService.FileType.xls, "Test Title")
        assertNotNull workBook
        assertTrue workBook instanceof HSSFWorkbook
        def sheet = workBook.getSheet("Test Title")
        assertNotNull sheet
        assertNotNull sheet.getRow(0)
        assertNotNull sheet.getRow(1)
        assertNotNull sheet.getRow(2)
        assertNotNull sheet.getRow(3)

        Row errorRow = sheet.getRow(0)
        assertEquals "Error Message", errorRow.getCell(0).getStringCellValue()
        assertEquals ExcelExportService.TEXT_FORMAT, errorRow.getCell(0).getCellStyle().getDataFormat()

        Row headerRow = sheet.getRow(1)
        assertEquals "header1", headerRow.getCell(0).getStringCellValue()
        assertEquals ExcelExportService.TEXT_FORMAT, headerRow.getCell(0).getCellStyle().getDataFormat()
        assertEquals "header2", headerRow.getCell(1).getStringCellValue()
        assertEquals ExcelExportService.TEXT_FORMAT, headerRow.getCell(1).getCellStyle().getDataFormat()

        Row dataRow = sheet.getRow(2)
        assertEquals "data01", dataRow.getCell(0).getStringCellValue()
        assertEquals ExcelExportService.TEXT_FORMAT, dataRow.getCell(0).getCellStyle().getDataFormat()

        assertEquals formatter.format(dateToUse), dataRow.getCell(1).getDateCellValue().format("M/d/yy")
        assertEquals ExcelExportService.DATE_FORMAT, dataRow.getCell(1).getCellStyle().getDataFormat()

        dataRow = sheet.getRow(3)
        assertEquals "data11", dataRow.getCell(0).getStringCellValue()
        assertEquals ExcelExportService.TEXT_FORMAT, dataRow.getCell(0).getCellStyle().getDataFormat()

        assertEquals formatter.format(dateToUse), dataRow.getCell(1).getDateCellValue().format("M/d/yy")
        assertEquals ExcelExportService.DATE_FORMAT, dataRow.getCell(1).getCellStyle().getDataFormat()
    }


    void testDefaultColumnWidth() {
        def dateToUse = new Date()

        def map = [success: false,
                errorMessage: "Error Message",
                headers: ["header1", "header2"],
                data: [["data01", dateToUse], ["data11", dateToUse]]
        ]


        def workBook = excelExportService.getExcelFile(map, ExcelExportService.FileType.xls, "Test Title")
        assertNotNull workBook
        assertTrue workBook instanceof HSSFWorkbook
        def sheet = workBook.getSheet("Test Title")
        assertEquals 25, sheet.getDefaultColumnWidth()

        map = [success: false,
                errorMessage: "Error Message",
                defaultColumnWidth: 20,
                headers: ["header1", "header2"],
                data: [["data01", dateToUse], ["data11", dateToUse]]
        ]
        workBook = excelExportService.getExcelFile(map, ExcelExportService.FileType.xls, "Test Title")
        assertNotNull workBook
        assertTrue workBook instanceof HSSFWorkbook
        sheet = workBook.getSheet("Test Title")
        assertEquals 20, sheet.getDefaultColumnWidth()
    }
}

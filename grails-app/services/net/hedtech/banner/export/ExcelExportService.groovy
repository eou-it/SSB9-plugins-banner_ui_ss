/*******************************************************************************
 Copyright 2014-2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.export

import net.hedtech.banner.exceptions.ApplicationException
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.hssf.usermodel.HSSFDataFormat
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.IndexedColors
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.xssf.usermodel.XSSFWorkbook

class ExcelExportService {
    public enum FileType  {xls, xlsx}
    public static final Short DATE_FORMAT = HSSFDataFormat.getBuiltinFormat("m/d/yy")
    public static final Short TEXT_FORMAT = HSSFDataFormat.getBuiltinFormat("text")
    public static final Integer DEFAULT_SHEET_COLUMN_WIDTH = 25

    /**
     * This method returns an Excel file in the form of an Excel Workbook. It accepts a map of data that must be in the form:
     * [
     *     success: true/false,
     *     errorMessage: <error message>, <-- This is optional
     *     defaultColumnWidth: <default width>, <-- This is optional. Default is 25
     *     headers: [String], <-- An array of strings that will be treated as the headers.  (Optional)
     *     data: [data element] <-- An array of data elements. Each data element itself is an array of values.
     *     The number of items in each data element should correspond to the number of items
     *         in the headers, though it is not considered an error if it does not. Each item can be either a String or
     *         a Date object. This is optional (in the case of error).
     * ]
     *
     */
    Workbook getExcelFile(def data, FileType fileType, String sheetTitle) {
        if (!data || !sheetTitle || !fileType) {
            throw new ApplicationException(ExcelExportService,  "@@r1:missingParameters@@")
        }

        Workbook wb = fileType == FileType.xlsx ? new XSSFWorkbook() : new HSSFWorkbook()
        def sheet = wb.createSheet(sheetTitle)
        def sheetRow = 0
        def columnWidth = data.defaultColumnWidth ?: DEFAULT_SHEET_COLUMN_WIDTH
        sheet.setDefaultColumnWidth(columnWidth)

        // Do we have an error row to add above the headers
        if (data.errorMessage) {
            CellStyle errorCellStyle = wb.createCellStyle()
            errorCellStyle.setFillPattern( CellStyle.SOLID_FOREGROUND )
            errorCellStyle.setFillForegroundColor( IndexedColors.RED.getIndex() )
            errorCellStyle.setDataFormat(TEXT_FORMAT)

            Row errorRow = sheet.createRow(sheetRow)
            Cell errorCell = errorRow.createCell(0)
            errorCell.setCellValue(data.errorMessage)
            errorCell.setCellStyle(errorCellStyle)
            sheetRow++
        }
        if (data.headers) {
            Row headerRow = sheet.createRow(sheetRow)
            sheetRow++

            CellStyle cellStyle = wb.createCellStyle()
            data.headers.eachWithIndex { it, index ->
                cellStyle.setDataFormat(TEXT_FORMAT)

                Cell cell = headerRow.createCell(index)
                cell.setCellValue(it)
                cell.setCellStyle(cellStyle)
            }
        }
        if (data.data) {
            CellStyle cellStyle = wb.createCellStyle()
            data.data.eachWithIndex{ it, index ->
                Row dataRow = sheet.createRow(sheetRow)
                sheetRow++

                it.eachWithIndex{ column, i ->
                    Short formatToUse = TEXT_FORMAT
                    if (column instanceof Date) {
                        formatToUse = DATE_FORMAT
                    }
                    Cell cell = dataRow.createCell(i)
                    cellStyle.setDataFormat(formatToUse)

                    cell.setCellValue(column)
                    cell.setCellStyle(cellStyle)
                }
            }
        }
        return wb;
    }
}

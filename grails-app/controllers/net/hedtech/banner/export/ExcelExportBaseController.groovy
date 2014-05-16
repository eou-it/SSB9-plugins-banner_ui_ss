package net.hedtech.banner.export

import net.hedtech.banner.utility.MessageResolver
import org.apache.poi.ss.usermodel.Workbook

class ExcelExportBaseController {
    public static final String DEFAULT_FILE_TYPE = "xls"
    public static final String DEFAULT_FILE_NAME = "export"//MessageResolver.message("net.hedtech.banner.export.ExcelExportBaseController.defaultFileName")
    public static final String DEFAULT_SHEET_TITLE = "Exported Data"
    public static final String CONTENT_TYPE = "application/excel"

    def excelExportService

    /**
     * Export an Excel file for the provided data. This call makes use of the following parameters:
     * fileType: <xls/xlsx>. If no fileType parameter is provided, defaults to xls
     * @return
     */
    def exportExcelFile() {
        if (!hasAccess()) {
            response.status = 403
            return
        }
        def fileTypeS = params.fileType ?: DEFAULT_FILE_TYPE

        // If invalid filetype is passed in, return a security error
        if (!validFileType(fileTypeS)) {
            response.status = 403
            return
        }

        def data = getData()
        if (data) {

            Workbook wb = excelExportService.getExcelFile(data, fileTypeS as ExcelExportService.FileType, getSheetTitle())

            response.setHeader("Content-disposition", "attachment;filename=\"" + getFileName() + "." + fileTypeS + "\"")
            response.contentType = CONTENT_TYPE
            response.outputStream << toByteArray(wb)
            response.outputStream.flush()
        }
        else {
            response.status = 404
        }
    }

    /**
     * Override to control who has access to the export service.
     * @return true if access should be allowed.
     */
    Boolean hasAccess() {
        return false
    }

    /**
     * Override this to returns the filename to use for the excel export file without the extension.
     * @return The desired file name without the extension.
     */
    String getFileName() {
        return DEFAULT_FILE_NAME

    }

    /**
     * Override this to return the data to be used by the spreadsheet generator.
     * @return The data as a map in the form expected by the ExcelExportService
     * @see ExcelExportService
     */
    def getData() {
        return null
    }

    /**
     * Override this in order to change the title of the sheet.
     * @return The title of the worksheet.
     */
    String getSheetTitle() {
        return DEFAULT_SHEET_TITLE
    }


    private Boolean validFileType(String fileType) {
        def returnValue = true
        try {
            fileType as ExcelExportService.FileType
        }
        catch (Exception e) {
            returnValue = false
        }
        return returnValue
    }


    private def toByteArray(Workbook wb) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()
        wb.write(outputStream)
        return outputStream.toByteArray()
    }
}

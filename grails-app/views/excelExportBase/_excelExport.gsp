<div class="modal-content">
    <div class="excel-export-wizard ui-widget">
        <div class="excel-export-wizard-content page-with-sidebar">
            <div class="excel-export-wizard-content-north">
                <div class="excel-export-wizard-header ui-widget-header">
                    <span id="excel-export-title" name="excel-export-title"></span>
                </div>
            </div>
            <div class="excel-export-wizard-content-center">
                <span><g:message code="net.hedtech.banner.export.ExcelExportBaseController.exportHeading"/></span>
                <ul class="excel-export-wizard-type-list">
                    <li><span>
                        <g:radio id="excelExportWizardTypeXls"  name="excelExportWizardType" value="xls" checked="true"/>
                        <label for="excelExportWizardTypeXls"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.excelSpreadsheetXls"/></label>
                    </span></li>
                    <li><span>
                        <g:radio id="excelExportWizardTypeXlsx" name="excelExportWizardType" value="xlsx" />
                        <label for="excelExportWizardTypeXlsx"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.excelSpreadsheetXlsx"/></label>
                    </span></li>
                </ul>
            </div>
            <div class="excel-export-wizard-content-south">
                <div class="buttons">
                    <button class="excel-export-button excel-export-wizard-export-button primary-button"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.export"/></button>
                    <button class="excel-export-button excel-export-wizard-cancel-button secondary-button"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.cancel"/></button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal-content">
    <div class="excel-export-wizard ui-widget" id="excel-export-dialog" name="excel-export-dialog" role="dialog" tabindex="-1" aria-labeledBy="excel-export-title excel-export-description">
        <div role="document">
            <div class="excel-export-wizard-content page-with-sidebar">
                <div role="presentation" aria-hidden="true">
                    <div hidden id="excel-export-description" name="excel-export-description" class="screen-reader-offscreen"></div>
                    <div hidden id="excelExportWizardTypeXlsxDescription" name="excelExportWizardTypeXlsxDescription" class="screen-reader-offscreen">
                        <g:message code="net.hedtech.banner.export.ExcelExportBaseController.excelExportWizardTypeXlsxDescription"/>
                    </div>
                    <div hidden id="excelExportWizardTypeXlsDescription" name="excelExportWizardTypeXlsDescription" class="screen-reader-offscreen">
                        <g:message code="net.hedtech.banner.export.ExcelExportBaseController.excelExportWizardTypeXlsDescription"/>
                    </div>
                    <div hidden id="exportButtonDescription" name="exportButtonDescription" class="screen-reader-offscreen">
                        <g:message code="net.hedtech.banner.export.ExcelExportBaseController.exportButtonDescription"/>
                    </div>
                    <div hidden id="cancelButtonDescription" name="cancelButtonDescription" class="screen-reader-offscreen">
                        <g:message code="net.hedtech.banner.export.ExcelExportBaseController.cancelButtonDescription"/>
                    </div>
                </div>
                <div class="excel-export-wizard-content-north">
                    <div class="excel-export-wizard-header ui-widget-header" role="heading" aria-labeledby="excel-export-title">
                        <span id="excel-export-title" name="excel-export-title" tabindex="0"></span>
                    </div>
                </div>
                <div class="excel-export-wizard-content-center" id="excelExportWizardHeading" role="contentinfo" tabindex="1" aria-labelledby="excelExportWizardHeadingLabel">
                    <fieldset class="borderless-fieldset">
                        <legend><g:message code="net.hedtech.banner.export.ExcelExportBaseController.exportHeading"/></legend>
                        <ul class="excel-export-wizard-type-list">
                            <li>
                                <g:radio id="excelExportWizardTypeXlsx" name="excelExportWizardType" value="xlsx" aria-labeledBy="excelExportWizardTypeXlsxDescription" checked="true"/>
                                <label aria-hidden="true" for="excelExportWizardTypeXlsx"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.excelSpreadsheetXlsx"/></label>
                            </li>
                            <li>
                                <g:radio id="excelExportWizardTypeXls"  name="excelExportWizardType" value="xls" aria-labeledBy="excelExportWizardTypeXlsDescription"/>
                                <label aria-hidden="true" for="excelExportWizardTypeXls"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.excelSpreadsheetXls"/></label>
                            </li>
                        </ul>
                    </fieldset>
                </div>
                <div class="excel-export-wizard-content-south">
                    <div class="buttons">
                        <button class="excel-export-button excel-export-wizard-export-button primary-button" aria-labeledBy="exportButtonDescription"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.export"/></button>
                        <button class="excel-export-button excel-export-wizard-cancel-button secondary-button" aria-labeledBy="cancelButtonDescription"><g:message code="net.hedtech.banner.export.ExcelExportBaseController.cancel"/></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
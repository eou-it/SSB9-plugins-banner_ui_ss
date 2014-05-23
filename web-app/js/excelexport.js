/** *****************************************************************************
 Copyright 2014 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

// #################################################################################################################
// Name: ExcelExportWizardView
// Type: View
// #################################################################################################################
window.ExcelExportWizardView = Backbone.View.extend({
    url: 'None',

    initialize: function() {
        _.bindAll(this);
    },
    events: {
        "click button.excel-export-wizard-cancel-button": "doCancel",
        "click button.excel-export-wizard-export-button": "doExport"
    },
    render: function(theUrl, theTitle) {
        this.url = theUrl
        $("#excel-export-title").html(theTitle)

        $(".excel-export-wizard").modal({
            overlayClose: true,
            onShow: function(modal) {
                $(".excel-export-button", this.el).button();

                $(".excel-export-wizard-content").layout({
                    applyDefaultStyles: true,
                    north__paneSelector:  ".excel-export-wizard-content-north",
                    center__paneSelector: ".excel-export-wizard-content-center",
                    south__paneSelector:  ".excel-export-wizard-content-south",
                    slidable: false,
                    resizable: false,
                    spacing_open: 0,
                    spacing_closed: 0
                });
                $('#excelExportWizardTypeXls').attr("checked","checked");
            }
        });
    },
    doCancel: function() {
        $(".excel-export-wizard-content").layout().destroy();
        $.modal.close();
    },
    doExport: function() {
        var format = $('input:radio[name=excelExportWizardType]:checked').val()
        var formatS = "&fileType=" + format
        if (this.url.indexOf("?") == -1) {
            formatS = "?fileType=" + format
        }
        window.open(this.url + formatS);

        $.modal.close();
    }
});

// Wire views into DOM
var excelExportWizardView = new ExcelExportWizardView({ el: ".excel-export-wizard" });

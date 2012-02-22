var demoPersonTable = null;

$(document).ready(function() {
    var editableColumns = ["firstName", "lastName", "birthDate", "phone", "email"];

    //
    // DataTables
    //

    demoPersonTable = createDataTable( {
        target: $("#demoPersonTable"),
        sAjaxSource: $("#demoPersonTable").attr("data-endpoint"),
        aoColumns: [
            { mDataProp: "firstName" },
            { mDataProp: "lastName" },
            { mDataProp: "bannerId" },
            { mDataProp: "birthDate" },
            { mDataProp: "phone" },
            { mDataProp: "email" }
        ],
        bPaginate: true,
        bLengthChange: false,
        bFilter: false,
        bSort: true,
        bInfo: false,
        fnDrawCallback: function( settings) {
            var datatable = settings.oInstance;
            $.each(editableColumns, function (idx, columnName) {
                $(getColumnSelector(datatable, columnName)).editable(
                    function (value, settings) {
                        return editDatatableCell(columnName, value, settings, this);
                    }
                );
            });
        }
    });

    function editDatatableCell(columnName, value, settings, element) {
        var data = demoPersonTable.fnGetData(element.parentNode);

        var valueToReturn = value;

        $.ajax({
            url: "/banner_ss_poc/uiCatalog/echo",
            method: "GET",
            dataType: "json",
            data: { data: value },
            success: function(msg) {
                return msg.value;
            }
        });

        return valueToReturn;
    }
});

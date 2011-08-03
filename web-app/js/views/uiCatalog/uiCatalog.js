var demoPersonTable = null;

function i18nSetup() {
//    $("button.button-one").button("option", "label", $.i18n.prop("js.ui.catalog.button.one.label"));
}

$(document).ready(function() {
    // progress bar
    $(".progress-bar").progressbar( { value: 50 } );


    // buttons
    $("button.button-one").button({label: "Button 1"});
    $("button.button-two").button();

    $("button.button-one").click(function() {
        $(".button-result").html($(this).button("option", "label"));
        $(".progress-bar").progressbar( "value", 33);
    });

    $("button.button-two").click(function() {
        $(".button-result").html($(this).button("option", "label"));
        $(".progress-bar").progressbar( "value", 66);
    });

    // non-HTML5 inputs
    $('.number').editable(submit, { type: 'number', onblur: 'submit' });

    // tabs
        $('.demo-tabs').tabs( {
        select: function(event, ui) {
            // nothing
        }
    });

    function submit(value, settings) {
        $(".button-result").html(value);

        var scrubbed = parseInt(value);
        if (value > 100) {
            scrubbed = 100;
        } else if (value < 0) {
            scrubbed = 0;
        }

        $(".progress-bar").progressbar( "value", scrubbed);
        return value;
    }

    var editableColumns = ["firstName", "lastName", "birthDate", "phone", "email"];

    // datatables
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
                        /* Submit function (local only) - unblock KeyTable */
//                        gradesKeys.block = false;
                        return editDatatableCell(columnName, value, settings, this);
                    }
//                        ,
//                    {
//                        type: 'select',
//                        data: gradeJson,
//                        onedit: function(){
//                            gradesKeys.fnSetPosition(this);
//                        },
//                        onblur: 'submit',
//                        onreset: function(){
//                            // unblock keytable, and mark this event as done
//                            window.event.keytable_done = true;
//                            /* Unblock KeyTable, but only after this 'esc' key event has finished. Otherwise
//                             * it will 'esc' KeyTable as well
//                             */
//                            setTimeout( function() {
//                                gradesKeys.block = false;
//                            }, 0);
//                        }
//                    }
                );
            });
        },
        fnInitComplete: function ( oInstance, oSettings, json ) {
//		    coursesKeys = new KeyTable( {
//		        table: document.getElementById('courses'),
//		        datatable: this,
//		        form:true,
//		        tabIndex: 3,
//                enabledColumns: [getColumnIndexByProperty(coursesTable,'crn')]
//		    });
//            coursesKeys.event.focus( null, null, function (nCell ) {
//                selectObject( coursesTable, nCell.parentNode, facultyGradeEntry, "selectedCourse" );
//            });
//
//            // form flag prevents the grid from taking focus & capturing keys, so focus explicitly
//            coursesKeys.focus(0,0);
        }
    });

    function editDatatableCell(columnName, value, settings, element) {
        var data = demoPersonTable.fnGetData(element.parentNode);

        var valueToReturn = value;

//        if (data[ gradeProperty ] == value) { // if value hasn't changed, don't send update
//            return valueToReturn;
//        }

        // Eventually getting rid of the $.ajax below
//        var map = new Object();
//        map[ gradeProperty ] = value;
//
//        gradesCollection.get( data.id ).set( map );

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
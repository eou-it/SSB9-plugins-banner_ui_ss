// TODO:  Some of these functions can be injected into the datatable by looking at the jQuery or Underscore.js $.extend, _.extend function.
function getColumnIndexByProperty( table, mDataProp ) {
    var columns = table.fnSettings().aoColumns;

    var j = 0;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].mDataProp == mDataProp) {
            return j;
        }

        j++;
    }
}

function getColumnDivIndexByProperty( table, mDataProp ) {
    var columns = table.fnSettings().aoColumns;

    var j = 1;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].mDataProp == mDataProp) {
            return j;
        }

        if (columns[i].bVisible) {
            j++;
        }
    }
}

/**
 * Provides a simplfied way to build a selector for a column on a given table given a mDataProp.
 * @param id
 * @param mDataProp
 * @param table
 */
function getColumnSelector( table, mDataProp ) {
    return table.selector + ' tbody tr td:nth-child(' + getColumnDivIndexByProperty( table, mDataProp ) + ')';
}


/**
 * This function will create a data table with default settings.
 *
 * @param settings
 */
function createDataTable( settings ) {

    // set up settings
    var defaults = {
        bJQueryUI: true,
        sPaginationType: "full_numbers",
        bProcessing: true,
        oLanguage: {
            "sLengthMenu":$.i18n.prop('js.dataTable.sLengthMenu'),
            "sZeroRecords":$.i18n.prop('js.dataTable.sZeroRecords'),
            "sInfo":$.i18n.prop('js.dataTable.sInfo'),
            "sInfoEmpty":$.i18n.prop('js.dataTable.sInfoEmpty'),
            "sInfoFiltered":$.i18n.prop('js.dataTable.sInfoFiltered'),
            "sEmptyTable":$.i18n.prop('js.dataTable.sEmptyTable')
        },
        fnRowCallback: function( nRow, aData, iDisplayIndex ) {
            if (aData.errors) {
                $('td:eq(0)', nRow).html( '<b>Error</b>' );
                $(nRow).addClass( "ui-state-error" );
            }
            else {
                $(nRow).removeClass( "ui-state-error" );
            }

            return nRow;
        }
    };
    settings = $.extend(defaults, settings);

    // TODO:  Determine why this can't be done via a CSS class as opposed to manually setting the element.style.
    var table = settings.target.dataTable( settings ).width( "100%" );

    // enable row selection
    $(table.selector + " tbody tr").live("click", function(event) {
        $(this).parent().find("tr").removeClass("row_selected");
        $(this).addClass( "row_selected" );
    });

    // enable mouse over styling support
    $( table.selector + ' tbody tr').live('mouseover mouseout', function(event) {
        if (event.type == 'mouseover') {
            $(this).addClass('row_hover');
        } else {
            $(this).removeClass('row_hover');
        }
    });

    return table;
}

/* Get the rows which are currently selected */
function fnGetSelected( oTableLocal ) {
	var aReturn = [];
	var aTrs = oTableLocal.fnGetNodes();

	for (var i=0; i<aTrs.length; i++) {
		if ( $(aTrs[i]).hasClass('row_selected') ) {
			aReturn.push( aTrs[i] );
		}
	}
	return aReturn;
}


/* Marks an object as selected with the expected behavior that when an item is selected, a change event is fired */
function selectObject(dataTable, target, eventObject, selectedProperty ) {
    var object = dataTable.fnGetData( target )

    var map = new Object();
    map[ selectedProperty ] = object;

    eventObject.set( map );
}
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

function listenForRemovingFocusOnEditableCell() {
    if(!$('#inner-content-center').data('events') || !$('#inner-content-center').data('events').scroll) {
         $('#inner-content-center').scroll(function () {
            removeFocusOnEditableField();
        });
    }

    $('.KeyTable').each(function() {
        $(this).children('thead').click(function () {
            removeFocusOnEditableField();
        });
    });
};

function removeFocusOnEditableField () {
    var form = $('.KeyTable form');
    form.submit();

    //Perform any other clean up if needed.
    //Hide calendar
    $('#ui-datepicker-div').css('display','none');
};

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
        oLanguage: {
            "sLengthMenu":$.i18n.prop('js.dataTable.sLengthMenu'),
            "sZeroRecords":$.i18n.prop('js.dataTable.sZeroRecords'),
            "sInfo":$.i18n.prop('js.dataTable.sInfo'),
            "sInfoEmpty":$.i18n.prop('js.dataTable.sInfoEmpty'),
            "sInfoFiltered":$.i18n.prop('js.dataTable.sInfoFiltered'),
            "sEmptyTable":$.i18n.prop('js.dataTable.sEmptyTable')
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

    listenForRemovingFocusOnEditableCell();

    return table;
}

/* This method adds keytable-popup class to calender widget and dropdown select list,
*  so that the click event on these popups can be neglected in keytable.js*/
markDataTablePopups();

function markDataTablePopups(){
    $('#ui-datepicker-div, .ui-datepicker-header').live('mousedown' , function(){
        $(this).addClass('keytable-popup');
    });
}

/**
 * Use this to create json based off a table that is prepared for usage in DataTables
 * @param collection a backbone collection.
 * @param prefix is the prefix you want to set to each tr in the table.  E.g. 'grades-roster' will create a class of 'grades-roster-1234' if
 *        id is 1234.
 */
function createDataTablesJSON( collection, prefix ) {
    var json = collection.toJSON();

    _.each( json, function( o ) {
        o[ "DT_RowId" ] = prefix + "-" + o.id;
        o[ "DT_RowClass" ] = prefix + "-row";
    });

    return json;
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

    //TODO this could be better handled in the facultyGradeEntry.js
    if (object != null && object.bannerId != null && object.bannerId.indexOf("stud_id") != -1)
    object.bannerId = $(object.bannerId).attr('href').split("=")[3]

    var map = new Object();
    map[ selectedProperty ] = object;

    eventObject.set( map );
}
//
// Resizable Table Columns.
//  version: 1.0
//
// (c) 2006, bz
//
// 25.12.2006:  first working prototype
// 26.12.2006:  now works in IE as well but not in Opera (Opera is @#$%!)
// 27.12.2006:  changed initialization, now just make class='resizable' in table and load script
//
function preventEvent(e) {
	var ev = e || window.event;
	if (ev.preventDefault) ev.preventDefault();
	else ev.returnValue = false;
	if (ev.stopPropagation)
		ev.stopPropagation();
	return false;
}

function getStyle(x, styleProp) {
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}

function getWidth(x) {
	if (x.currentStyle)
		// in IE
		var y = x.clientWidth - parseInt(x.currentStyle["paddingLeft"]) - parseInt(x.currentStyle["paddingRight"]);
		// for IE5: var y = x.offsetWidth;
	else if (window.getComputedStyle)
		// in Gecko
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue("width");
	return y || 0;
}

function setCookie (name, value, expires, path, domain, secure) {
	document.cookie = name + "=" + escape(value) +
		((expires) ? "; expires=" + expires : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
}

function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}
// main class prototype
function ColumnResize(table) {
	if (table.tagName != 'TABLE') return;

	this.id = table.id;

	// ============================================================
	// private data
	var self = this;

	var dragColumns  = table.rows[0].cells; // first row columns, used for changing of width
	if (!dragColumns) return; // return if no table exists or no one row exists

	var dragColumnNo; // current dragging column
	var dragX;        // last event X mouse coordinate

	var saveOnmouseup;   // save document onmouseup event handler
	var saveOnmousemove; // save document onmousemove event handler
	var saveBodyCursor;  // save body cursor property

	// ============================================================
	// methods

	// ============================================================
	// do changes columns widths
	// returns true if success and false otherwise
        this.changeColumnWidth = function(no, w, columnsWidth) {
            if (slideDirection == 'rtl'){ // arabic
                w = -w
	    }
            if (w < 0 && no >= dragColumns.length) return false;
            if (!dragColumns) return false;
            if (no < 0) return false;
            if (dragColumns.length < no) return false;
            var outerWidth = $(table).parent().parent().width()
            var lCol = parseInt(dragColumns[no].style.width)
            var lCellWidth = (lCol + w) <= 5 ? 5 : lCol + w
            var lTitleWidth = (lCol + w - 30) <= 0 ? 0 : lCol + w - 30
            var lSortDisplay = (lCol + w) <= 21 ? 'none' : 'inline'
            var containerWidth = $(table).parent().width()

            $( '.title', dragColumns[no] )[ 0 ].style.width = ( lTitleWidth ) + 'px';
            if ($( '.sort-icon', dragColumns[no] )[ 0 ]) {
                $( '.sort-icon', dragColumns[no] )[ 0 ].style.display = lSortDisplay;
            }
            $( '.title', dragColumns[no] )[ 0 ].style.display = lSortDisplay;

            dragColumns[no].style.width =  ( lCellWidth) + 'px';

            if (columnsWidth <= containerWidth) {
                var rCol = parseInt(dragColumns[dragColumns.length - 1].style.width)
                if (w < 0){
                    w = -w
		}
                    var rCellWidth = (rCol + w) <= 0 ? 1 : rCol + w
                    var rTitleWidth = (rCol + w - 30) <= 0 ? 0 : rCol + w - 30
                    var rSortDisplay = (lCol + w) <= 21 ? 'none' : 'inline'
                $( '.title', dragColumns[dragColumns.length - 1] )[ 0 ].style.width = ( rTitleWidth ) + 'px';
                if ($( '.sort-icon', dragColumns[no] )[ 0 ]) {
                    $( '.sort-icon', dragColumns[dragColumns.length] )[ 0 ].style.display = rSortDisplay;
                }
                if (columnsWidth == containerWidth && outerWidth < containerWidth) {
                    $(table).parent()[0].style.width = (containerWidth - w) + 'px';
		}
                dragColumns[dragColumns.length - 1].style.width =  (rCellWidth) + 'px';
	    }

            // Adding a trigger so that instances can react.
            $('#' + self.id).trigger('columnWidthChanging');

            return true;
	}

	// ============================================================
	// do drag column width
	this.columnDrag = function(e) {
		var e = e || window.event;
		var X = e.clientX || e.pageX;
		var columnsWidth = 31; // for gear icon
		for (var i=0; i<dragColumns.length; i++) {
		    columnsWidth += parseInt( getWidth(dragColumns[i])) + 11;
		}
	        if (!self.changeColumnWidth(dragColumnNo, X-dragX, columnsWidth)) {
			// stop drag!
			self.stopColumnDrag(e);
		}

		dragX = X;
		// prevent other event handling
		preventEvent(e);
		return false;
	}

	// ============================================================
	// stops column dragging
	this.stopColumnDrag = function(e) {
		var e = e || window.event;
		if (!dragColumns) return;

		// restore handlers & cursor
		document.onmouseup  = saveOnmouseup;
		document.onmousemove = saveOnmousemove;
		document.body.style.cursor = saveBodyCursor;

		// remember columns widths in cookies for server side
		var colWidth = '';
		var separator = '';
		for (var i=0; i<dragColumns.length; i++) {
			colWidth += separator + parseInt( getWidth(dragColumns[i]) );
			separator = '+';
		}
		var expire = new Date();
		expire.setDate(expire.getDate() + 365); // year
		document.cookie = self.id + '-width=' + colWidth +
			'; expires=' + expire.toGMTString();

		preventEvent(e);

		// Adding a trigger so that instances can react.
		$('#' + self.id).trigger('columnWidthChanged');
	}

	// ============================================================
	// init data and start dragging
	this.startColumnDrag = function(e) {
		var e = e || window.event;

		// if not first button was clicked
		//if (e.button != 0) return;

		// remember dragging object
		dragColumnNo = (e.target || e.srcElement).parentNode.cellIndex;
		dragX = e.clientX || e.pageX;

		// set up current columns widths in their particular attributes
		// do it in two steps to avoid jumps on page!
		var colWidth = new Array();
		for (var i=0; i<dragColumns.length; i++)
			colWidth[i] = parseInt( getWidth(dragColumns[i]) );
		for (var i=0; i<dragColumns.length; i++) {
			dragColumns[i].width = ""; // for sure
			dragColumns[i].style.width = colWidth[i] + "px";
		}

		$( e.target ).data( "just-sorted", "true" );

		saveOnmouseup       = document.onmouseup;
		document.onmouseup  = self.stopColumnDrag;

		saveBodyCursor             = document.body.style.cursor;
		document.body.style.cursor = 'w-resize';

		// fire!
		saveOnmousemove      = document.onmousemove;
		document.onmousemove = self.columnDrag;

		preventEvent(e);
	}

	// prepare table header to be draggable
	// it runs during class creation
	for (var i=0; i<dragColumns.length; i++) {
		var that     = this,
		    orig     = $( dragColumns[i] ),
		    title    = orig.find( ".title" ),
		    sortIcon = orig.find( ".sort-icon" ),
		    outer    = $( "<div style='position:relative;height:100%;width:100%'></div>" ),
		    // handle   = $( "<div class='sort-handle' style='position:absolute;height:100%;width:5px;margin-right:-5px;left:100%;top:0px;cursor:w-resize;z-index:10;'></div>" );
		    handle   = $( "<div class='sort-handle' style='height:100%;width:5px;cursor:w-resize;'></div>" );

		handle.mousedown( function (e) {
		  $( e.target ).closest( "th" ).off( "click" );

		  that.startColumnDrag( e );
		  e.preventDefault();
		  e.stopPropagation();

		  $( e.target ).closest( "th" ).on( "click" );
		});

		handle.click( function (e) {
			e.preventDefault();
			e.stopPropagation();
		});

		// outer.append( handle )
		//      .append( title )
		//      .append( sortIcon );

		// orig.empty().append( outer );
            if ($( '.sort-handle',   dragColumns[i] ).css('width'))
		$( '.sort-handle', dragColumns[i] ).remove();

            if ($( '.sort-icon',   dragColumns[i] ).css('width'))
		$( '.sort-icon',   dragColumns[i] ).before( handle );
            else
		$( '.title',   dragColumns[i] ).after( handle );

	}
}

// select all tables and make resizable those that have 'resizable' class
var resizableTables = new Array();
function ResizableColumns() {

	var tables = document.getElementsByTagName('table');
	for (var i=0; tables.item(i); i++) {
		if (tables[i].className.match(/resizable/)) {
			// generate id
			if (!tables[i].id) tables[i].id = 'table'+(i+1);
			// make table resizable
			resizableTables[resizableTables.length] = new ColumnResize(tables[i]);
		}
	}
//	alert(resizableTables.length + ' tables was added.');
}
// init tables
/*
if (document.addEventListener)
	document.addEventListener("onload", ResizableColumns, false);
else if (window.attachEvent)
	window.attachEvent("onload", ResizableColumns);
*/
try {
	window.addEventListener('load', ResizableColumns, false);
} catch(e) {
	window.onload = ResizableColumns;
}

//document.body.onload = ResizableColumns;

//============================================================
//
// Usage. In your html code just include the follow:
//
//============================================================
// <table id='objectId'>
// ...
// </table>
// < script >
// var xxx = new ColumnDrag( 'objectId' );
// < / script >
//============================================================
//
// NB! spaces was used to prevent browser interpret it!
//
//============================================================

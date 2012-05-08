$.datepicker.setDefaults($.datepicker.regional['locale']);

jQuery.fn.dataTableExt.oSort['skip-ui-sort-asc']  = function(x,y) { return 0; };
jQuery.fn.dataTableExt.oSort['skip-ui-sort-desc'] = function(x,y) { return 0; };

$.fn.dataTableExt.oPagination.selfServiceDefaultPagination = {
    fnInit: function (oSettings, nPaging, fnCallbackDraw) {
        var nFirst = document.createElement( 'div' );
        var nPrev  = document.createElement( 'div' );
        var nNext  = document.createElement( 'div' );
        var nLast  = document.createElement( 'div' );
        var nInput = document.createElement( 'input' );
        var nPage  = document.createElement( 'span' );
        var nOf    = document.createElement( 'span' );
        var nTotal = document.createElement( 'span' );

        nFirst.className = "paginate_button first";
        nPrev.className  = "paginate_button previous";
        nNext.className  = "paginate_button next";
        nLast.className  = "paginate_button last";
        nInput.className = "paginate_input";
        nPage.className  = "paginate_page";
        nOf.className    = "paginate_of";
        nTotal.className = "paginate_total";

        if ( oSettings.sTableId !== '' ) {
            nPaging.setAttribute( 'id', oSettings.sTableId + '_paginate' );
            nFirst.setAttribute(  'id', oSettings.sTableId + '_first' );
            nPrev.setAttribute(   'id', oSettings.sTableId + '_previous' );
            nNext.setAttribute(   'id', oSettings.sTableId + '_next' );
            nLast.setAttribute(   'id', oSettings.sTableId + '_last' );
        }

        nInput.type          = "text";
        nInput.style.width   = "15px";
        nInput.style.display = "inline";
        nPage.innerHTML      = $.i18n.prop("js.dataTable.page"),

        nPaging.appendChild( nFirst );
        nPaging.appendChild( nPrev );
        nPaging.appendChild( nPage );
        nPaging.appendChild( nInput );
        nPaging.appendChild( nOf );
        nPaging.appendChild( nTotal );
        nPaging.appendChild( nNext );
        nPaging.appendChild( nLast );

        function pageChange(direction) {
            if (typeof(oSettings.oInit.aoBackboneCollection) != 'undefined') {
                var collection = oSettings.oInit.aoBackboneCollection;

                if (typeof(direction) == 'number')   { collection.goToPage(direction); }
                else if   (direction  == 'first')    { collection.firstPage(); }
                else if   (direction  == 'last')     { collection.lastPage(); }
                else if   (direction  == 'next')     { collection.nextPage(); }
                else if   (direction  == 'previous') { collection.previousPage(); }
            }
        }

        $(nFirst).click(function() { pageChange("first") });
        $(nPrev).click( function() { pageChange("previous") });
        $(nNext).click( function() { pageChange("next") });
        $(nLast).click( function() { pageChange("last") });

        var collection = oSettings.oInit.aoBackboneCollection;
        var view = oSettings.oInit.oBackboneView;

        var saveCallback = function( options ) {
            var callback = options.callback;

            var success = function(saved) {
                if (typeof(view.options.success) == 'function') {
                    view.options.success(saved);
                }
                callback(saved);
            }

            if (typeof(collection) != 'undefined') {
                collection.save({ success: success, error: view.options.error });
            }
        }

        var doNotSaveCallback = function( options ) {
            var callback = options.callback || function() {}
            callback();
        }

        var inputIsDirty = function() {
            $.data(nInput, 'entered', $(nInput).val());

            if (typeof(collection) != 'undefined') {
                return collection.isDirty();
            }
            return false;
        };
        var pagingInputDirtyCheck = {
            save:    saveCallback,
            no:      doNotSaveCallback,
            isDirty: inputIsDirty
        };

        function resetPageNumberInput() {
            var target = $(nInput);
            if (target.data().initial) {
                target.val(target.data().initial);
            }
        }

        $(nInput).change(function(e) {
            if (typeof(oSettings.oInit.aoBackboneCollection) != 'undefined') {
                var userEnteredPage = $(this).data().entered

                if (userEnteredPage == "" || userEnteredPage.match(/[^0-9]/)) {
                    resetPageNumberInput();
                    return;
                }

                var page = parseInt($(this).data().entered, 10);
                var collection = oSettings.oInit.aoBackboneCollection;
                var info = collection.pageInfo();

                if (page < 1 || page > info.pages) {
                    resetPageNumberInput();
                } else {
                    collection.goToPage(page);
                }
            }
        });

        $(nInput).focus(function(e) {
            $.data(this, 'initial', this.value);
        });

        $(nInput).dirtyCheck( _.defaults({
                eventType: "change",
                cancelCallback: resetPageNumberInput
            }, pagingInputDirtyCheck)
        );

        if (typeof(oSettings.oInit.aoBackboneCollection) == 'undefined') {
            log.debug("$.fn.dataTableExt.oPagination.ssbCustom.fnInit: aoBackboneCollection is not defined dirty check not setup");
        } else {
            var collection    = oSettings.oInit.aoBackboneCollection
            var buttonIsDirty = function() {
                return collection.isDirty();
            }

            var pagingButtonDirtyCheck = {
                save:    saveCallback,
                no:      doNotSaveCallback,
                isDirty: buttonIsDirty
            };

            $(nFirst).dirtyCheck(pagingButtonDirtyCheck);
            $(nPrev).dirtyCheck( pagingButtonDirtyCheck);
            $(nNext).dirtyCheck( pagingButtonDirtyCheck);
            $(nLast).dirtyCheck( pagingButtonDirtyCheck);
        }

        /* Take the brutal approach to cancelling text selection */
        $('span', nPaging).bind( 'mousedown',   function () { return false; } );
        $('span', nPaging).bind( 'selectstart', function () { return false; } );
    },
    fnUpdate: function (oSettings, fnCallbackDraw) {
        var table = oSettings.nTableWrapper;

        if (!oSettings.aanFeatures.p) {
            return;
        }

        if (typeof(oSettings.oInit.aoBackboneCollection) != 'undefined') {
            var collection = oSettings.oInit.aoBackboneCollection;
            var info = collection.pageInfo();

            var iPages = info.pages;
            var iCurrentPage = info.page;

            if (iPages == 1) {
                $(".paginate_button", table).removeClass("enabled");
                $(".paginate_input",  table).hide();
            } else {
                $(".paginate_input", table).show();

                if (iCurrentPage == 1) {
                    $(".paginate_button.first, .paginate_button.previous", table).removeClass("enabled");
                    $(".paginate_button.next,  .paginate_button.last",     table).addClass("enabled");
                } else if (iCurrentPage == iPages) {
                    $(".paginate_button.first, .paginate_button.previous", table).addClass("enabled");
                    $(".paginate_button.next,  .paginate_button.last",     table).removeClass("enabled");
                } else {
                    $(".paginate_button", table).addClass("enabled");
                }
            }

            var an = oSettings.aanFeatures.p;
            for ( var i = 0, iLen = an.length ; i < iLen ; i++ ) {
                var spans  = an[i].getElementsByTagName('span');
                var inputs = an[i].getElementsByTagName('input');

                spans[1].innerHTML = (iPages == 1 ? $.i18n.prop("js.dataTable.pageOfOne") : $.i18n.prop("js.dataTable.pageOf"));
                spans[2].innerHTML = iPages;

                inputs[0].value = iCurrentPage;
            }

            var recordCount = $.i18n.prop("js.dataTable.sInfo").replace("_TOTAL_", info.totalCount);

            $(".dataTables_info", table).html(recordCount);
        }
    }
}



function preparePagingSelect( el, collection ) {
    var dirtyCheckDefaultsForPagingSelect = {
        save: function( options ) {
            var callback = options.callback;
    
            // This probably can be improved by using a 'promise' object from jQuery.  Will investigate at a later date.
    //        saveGrades( {
    //            success: function() {
    //                if ( !isDirty() ) { callback(); }
    //            }
    //        });
            collection.fetch()
        },
        no: function( options ) {
            collection.fetch()
        },
        isDirty: function() {
            return collection.isDirty();
        }
    };

    el.change(function(e) {
        var size = el.find("option:selected").val();
        collection.setPageSize(parseInt(size, 10));
    });

    // A select statement will changed its selected value even if the 'onChange' event returns false.  If
    // the record is dirty, and the user cancels the request to save we want to have the initial value of the
    // select available to reset it to what it was prior to them changing the paging length.
    el.focus(function(e) {
        $.data( this, 'initial', this.value );
    });


    el.dirtyCheck( _.defaults( {
            eventType: "change",
            cancelCallback: function() {
                var target = $( selectorString );
                if (target.data().initial) {
                    target.val( target.data().initial );
                }
            }
        }, dirtyCheckDefaultsForPagingSelect )
    );
}

// #################################################################################################################
// DataTables Sort Utilities
// #################################################################################################################

function replaceDataTablesSortListeners(table) {
    _.each(table.fnSettings().aoColumns, function(c) {
        var th = $(c.nTh);
        th.unbind("click.DT");
        th.unbind("click");

        th.bind("click", function(e) {
            sortTable(this, table)
        });
    });
}

function sortTable(el, table) {
    var self       = el;
    var settings   = table.fnSettings();
    var collection = settings.oInit.aoBackboneCollection;
    var columnIdx  = $(self).index();
    var column     = "";
    var direction  = "asc";

    if (typeof(collection) == 'undefined') {
        log.debug("sortTable: aoBackboneCollection not defined");
        return false;
    }

    var obj = _.find(table.fnSettings().aoColumns, function(it) { return it.nTh == self; });

    if (obj) {
        column = obj.mDataProp;

        if (settings.aaSorting.length == 1 && settings.aaSorting[0][0] == obj.iDataSort) {
            var currentDirection = settings.aaSorting[0][2];
            direction = currentDirection == 0 ? "desc" : "asc";
        } else {
            direction = "asc";
        }

        if (collection.sortColumn    != column
         || collection.sortDirection != direction) {
            var innerSortTable = function() {
                collection.sortColumn    = column;
                collection.sortDirection = direction;
                collection.sortColumnIdx = columnIdx;

                collection.fetch();
            };

            if (collection.isDirty()) {
                setTimeout( function() {
                    var n = new Notification( {message: $.i18n.prop("js.notification.dirtyCheck.message"), type:"warning", promptMessage: $.i18n.prop("js.notification.dirtyCheck.promptMessage")} );

                    n.addPromptAction( $.i18n.prop("js.notification.dirtyCheck.cancelActionButton"), function() {
                        notifications.remove( n );
                    });

                    n.addPromptAction( $.i18n.prop("js.notification.dirtyCheck.doNotSaveActionButton"), function() {
                        notifications.remove( n );
                        innerSortTable();
                    });

                    n.addPromptAction( $.i18n.prop("js.notification.dirtyCheck.saveActionButton"), function() {
//                        saveGrades({
//                            success: function() {
//                                if ( !isDirty() ) {
//                                    innerSortTable();
//                                }
//                            }
//                        });

                        notifications.remove( n );
                    });

                    notifications.addNotification( n );
                }, 200);
            } else {
                collection.sortColumn    = column;
                collection.sortDirection = direction;
                collection.sortColumnIdx = columnIdx;
                collection.fetch();
            }
         }
    }
}

$.fn.dataTableExt.oApi.getColumnIndexByProperty = function ( oSettings, mDataProp ) {
    var columns = oSettings.aoColumns;

    var j = 0;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].mDataProp == mDataProp) {
            return j;
        }

        j++;
    }
};

$.fn.dataTableExt.oApi.getColumnDivIndexByProperty = function ( oSettings, mDataProp ) {
    var columns = oSettings.aoColumns;

    var j = 1;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].mDataProp == mDataProp) {
            return j;
        }

        if (columns[i].bVisible) {
            j++;
        }
    }
};

/**
 * @depreciated
 *
 *  - This function has been depreciated with Backbone.DataGridView taking its place. -
 *
 * Provides a simplfied way to build a selector for a column on a given table given a mDataProp.
 * @param id
 * @param mDataProp
 * @param table
 */
function getColumnSelector( table, mDataProp ) {
    return table.selector + ' tbody tr td:nth-child(' + table.getColumnDivIndexByProperty( table, mDataProp ) + ')';
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
}

/**
 * @depreciated
 *
 *  - This function has been depreciated with Backbone.DataGridView taking its place. -
 */
var updateData = function (property, value, settings, el, datatable) {
    datatable = datatable || { };
    var data = datatable.fnGetData(el.parentNode);

    if (value === "")
        value = null;

    var model = datatable.fnSettings().oInit.aoBackboneCollection.get(data.id)

    if (!model) {
        // handle it
    } else {
        var map = { };
        map[property] = value;

        if (model.get(property) != value)
            model.set(map);
    }

    return value;
};

/**
 * @depreciated
 *
 *  - This function has been depreciated with Backbone.DataGridView taking its place. -
 *
 * This function will create a data table with default settings.
 *
 * @param settings
 */
function createDataTable( settings ) {

    // set up settings
    var defaults = {
        bJQueryUI:       true,
        bAutoWidth:      false,
        bInfo:           false,
        bLengthChange:   false,
        bPaginate:       false,
        sPaginationType: "full_numbers",
        iDisplayLength:  50,
        aLengthMenu:     [50, 100, 250, 500],
        sDom:            'rt<"bottom ui-widget-header"p<"bottom-divider">l<"dataTables_info"><"clear">',
        oLanguage: {
            sLengthMenu:   $.i18n.prop('js.dataTable.sLengthMenu'),
            sZeroRecords:  $.i18n.prop('js.dataTable.sZeroRecords'),
            sInfo:         $.i18n.prop('js.dataTable.sInfo'),
            sInfoEmpty:    $.i18n.prop('js.dataTable.sInfoEmpty'),
            sInfoFiltered: $.i18n.prop('js.dataTable.sInfoFiltered'),
            sEmptyTable:   $.i18n.prop('js.dataTable.sEmptyTable')
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

/**
 * @el jQuery object the element to associate with this view
 * @collection Backbone.Collection the collection to associate with this view
 * @editableColumns array list of columns to make editable
 * @settings object any custom grid settings
 */
Backbone.DataTablesViewInternal = Backbone.View.extend({
    styles: {
        hover:    "row_hover",
        selected: "row_selected"
    },
    table: undefined,
    defaultPageLengths: [50, 100, 250, 500],
    initialize: function () {
        _.bindAll(this, 'render', 'reload', 'success', 'error', 'generateDataIdentifier', 'determinePageLengths', 'getSelectedRows', 'getColumnSelector', 'notificationAdded', 'notificationRemoved', 'createRowCallback', 'updateData', 'preparePagingSelect', 'createDataTablesJSON');
        
        if (typeof(this.collection) != 'undefined') {
            this.collection.bind( "reset", this.render );
            this.collection.bind( "change", function(model) {
                model.makeDirty();
            });
        }

        if (typeof(notifications) != 'undefined' && typeof(notifications.bind) == 'function') {
            notifications.bind('add',    this.notificationAdded );
            notifications.bind('remove', this.notificationRemoved );
        }
    },
    success: function(model, resp) {
        if (typeof(this.options.success) == "function")
            this.options.success.call(this, model, resp);
    },
    error: function(model, resp) {
        if (typeof(this.options.error) == "function")
            this.options.error.call(this, model, resp);
    },
    render: function() {
        if (_.isFunction(this.options.beforeRender))
            this.options.beforeRender.call(this);

        if (!_.isNull(this.table) && !_.isUndefined(this.table)) {
            this.table.fnDestroy();
        }

        if (_.isNull(this.collection.sortColumn)) {
            var column = _.first(this.options.aoColumnDefs);

            this.collection.sortColumn = column.mDataProp
        }

        if (_.isNull(this.collection.sortColumnIdx)) {
            for (var x = 0; x < this.options.aoColumnDefs.length; x++) {
                if (this.options.aoColumnDefs[x].mDataProp == this.collection.sortColumn) {
                    this.collection.sortColumnIdx = x;
                    break;
                }
            }
        }

        var blacklist = ['el', 'collection', 'editableColumns'];

        var settings = _.pick(this.options, _.without(_.keys(this.options), blacklist));

        settings = _.defaults(settings, {
            target:               $(this.el),
            bLengthChange:        this.collection.paginate,
            bPaginate:            this.collection.paginate,
            aaSorting:            [ [this.collection.sortColumnIdx, this.collection.sortDirection] ],
            aoBackboneCollection: this.collection,
            oBackboneView:        this,
            editableColumns:      this.options.editableColumns || [],
            iDisplayLength:       this.collection.pageInfo().pageMaxSize
        });

        this.table = this.createDataTable( settings );

        if (_.isFunction(this.options.afterRender))
            this.options.afterRender.call(this);
    },
    save: function() {
        if (typeof(this.collection) != 'undefined' && this.collection.isDirty()) {
            this.collection.save({ success: this.success, error: this.error });
        }
    },
    reload: function() {
        this.table.fnClearTable(0);
        this.table.fnAddData( this.createDataTablesJSON() );
    },
    generateDataIdentifier: function() {
        return $(this.el).attr("id") || "dataTable";
    },
    determinePageLengths: function ( settings ) {
        var size = this.collection.pageInfo().pageMaxSize;

        if (!_.find(this.defaultPageLengths, function (it) { return it == size })) {
            var arr = this.defaultPageLengths.concat(size);
            this.defaultPageLengths = _.sortBy(arr, function (it) { return it; });
        }
        
        return this.defaultPageLengths;
    },
    updateData: function (property, value, settings, el) {

        var data = this.table.fnGetData(el.parentNode);

        if (value === "")
            value = null;

        var model = this.collection.get(data.id);

        if (model) {
            var map = { };
            map[property] = value;

            if (model.get(property) != value)
                model.set(map);
        }

        return value;
    },
    createRowCallback: function ( settings ) {
        var view = this;
        var editableColumns = settings.editableColumns || [];
        var fnRowCallback   = settings.fnRowCallback;

        var getEditableTypeDef = function ( column, row ) {
            return _.extend( {}, column, {
                onblur: function(val, settings) {
                    $('form', this).submit();
                },
                onedit: function() {
                    $(row).addClass( view.styles.selected ).siblings().removeClass( view.styles.selected );
                },
                placeholder: ""
            });
        };

        return function (row, data, displayIndex, displayIndexFull) {
            var tableInstance = this;

            editableColumns = editableColumns || [ ];

            _.each(editableColumns, function (column) {
                var elements = $('td:nth-child(' + tableInstance.getColumnDivIndexByProperty( column.name ) + ')', row);

                _.each(elements, function (el) {
                    var aPos  = tableInstance.fnGetPosition( el );
                    var aData = tableInstance.fnGetData( aPos[0] );

                    $(el).editable(
                        function (value, settings) {
                            _.defer(function() {
//                                getKeyTable().block = false;
                            });
                            return encodeHTML(view.updateData(column.name, value, settings, this));
                        },
                        getEditableTypeDef( column, row )
                    );
                });
            });

            if (typeof(fnRowCallback) == 'function') {
                fnRowCallback();
            }

            return row;
        };
    },
    createDataTablesJSON: function () {
        var json = this.collection.toJSON(),
            prefix = this.generateDataIdentifier();

        _.each( json, function( o ) {
            o[ "DT_RowId" ]    = prefix + "-" + o.id;
            o[ "DT_RowClass" ] = prefix + "-row";
        });

        return json;
    },
    createDataTable: function ( settings ) {
        var view = this;

        // set up settings
        var defaults = {
            aaData:          this.createDataTablesJSON(),
            bJQueryUI:       true,
            bAutoWidth:      false,
            bInfo:           false,
            bLengthChange:   false,
            bPaginate:       false,
            sPaginationType: "selfServiceDefaultPagination",
            iDisplayLength:  50,
            aLengthMenu:     this.determinePageLengths(),
            sDom:            'rt<"bottom ui-widget-header"p<"bottom-divider">l<"dataTables_info"><"clear">',
            oLanguage: {
                sLengthMenu:   $.i18n.prop('js.dataTable.sLengthMenu'),
                sZeroRecords:  $.i18n.prop('js.dataTable.sZeroRecords'),
                sInfo:         $.i18n.prop('js.dataTable.sInfo'),
                sInfoEmpty:    $.i18n.prop('js.dataTable.sInfoEmpty'),
                sInfoFiltered: $.i18n.prop('js.dataTable.sInfoFiltered'),
                sEmptyTable:   $.i18n.prop('js.dataTable.sEmptyTable')
            }
        };

        settings = $.extend( defaults, settings );

        settings.fnRowCallback = this.createRowCallback( settings );

        // TODO:  Determine why this can't be done via a CSS class as opposed to manually setting the element.style.
        var table = this.$el.dataTable( settings ).width( "100%" );

        $( table.selector + ' tbody tr').live('click',     function(event) { $(this).addClass( view.styles.selected ).siblings().removeClass( view.styles.selected ); } );
        $( table.selector + ' tbody tr').live('mouseover', function(event) { $(this).addClass( view.styles.hover );    } );
        $( table.selector + ' tbody tr').live('mouseout',  function(event) { $(this).removeClass( view.styles.hover ); } );

        listenForRemovingFocusOnEditableCell();

        this.preparePagingSelect();

        replaceDataTablesSortListeners(table);

        return table;
    },
    preparePagingSelect: function () {
        var collection = this.collection,
            el = this.$el.parent().find(".bottom .dataTables_length select"),
            dirtyCheckDefaultsForPagingSelect = {
            save: function( options ) {
                var callback = options.callback;

                // This probably can be improved by using a 'promise' object from jQuery.  Will investigate at a later date.
        //        saveGrades( {
        //            success: function() {
        //                if ( !isDirty() ) { callback(); }
        //            }
        //        });
                collection.fetch()
            },
            no: function( options ) {
                collection.fetch()
            },
            isDirty: function() {
                return collection.isDirty();
            }
        };

        el.change(function(e) {
            var size = el.find("option:selected").val();
            collection.setPageSize(parseInt(size, 10));
        });

        // A select statement will changed its selected value even if the 'onChange' event returns false.  If
        // the record is dirty, and the user cancels the request to save we want to have the initial value of the
        // select available to reset it to what it was prior to them changing the paging length.
        el.focus(function(e) {
            $.data( this, 'initial', this.value );
        });


        el.dirtyCheck( _.defaults( {
                eventType: "change",
                cancelCallback: function() {
                    var target = $( selectorString );
                    if (target.data().initial) {
                        target.val( target.data().initial );
                    }
                }
            }, dirtyCheckDefaultsForPagingSelect )
        );
    },
    getSelectedRows: function() {
        return _.filter(this.table.fnGetNodes(), function(it) {
            return $(it).hasClass('row_selected');
        });
    },
    getColumnSelector: function( propertyName ) {
        var idx = this.table.getColumnDivIndexByProperty( propertyName );

        if (!_.isUndefined(idx))
            return this.$el.selector + ' tbody tr td:nth-child(' + idx + ')';

        return false;
    },
    notificationAdded: function( notification ) {
        var model = this.collection.find( function( m ) {
            if (notification.get( "model" )) {
                return m.get( "id" ) === notification.get( "model" ).id;
            }
        });

        if (model) {
            var id       = model.get("id"),
                types    = { success:'notification-success', warning:'notification-warning' },
                clz      = types[notification.get( "type" )] || "notification-error",
                selector = "#" + this.generateDataIdentifier() + "-" + id;


            $(selector).stop(true,true).addClass(clz);
        }
    },
    notificationRemoved: function( notification ) {
        var model = this.collection.find( function( m ) {
            return m === notification.get( "model" );
        });

        if (model) {
            var id       = model.get("id"),
                types    = { success:'notification-success', warning:'notification-warning' },
                clz      = types[notification.get( "type" )] || "notification-error",
                selector = "#" + this.generateDataIdentifier() + "-" + id;


            $(selector).removeClass(clz, 1000);
        }
    }
});

var DataGridView = Backbone.DataGridView = Backbone.DataTablesViewInternal.extend({ });


/* This method adds keytable-popup class to calender widget and dropdown select list,
*  so that the click event on these popups can be neglected in keytable.js*/
markDataTablePopups();

function markDataTablePopups(){
    $('#ui-datepicker-div, .ui-datepicker-header').live('mousedown' , function(){
        $(this).addClass('keytable-popup');
    });
}

/**
 * @depreciated
 *
 *  - This function has been depreciated with Backbone.DataGridView taking its place. -
 *
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

    var map = new Object();
    map[ selectedProperty ] = object;

    eventObject.set( map );
}
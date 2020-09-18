/*********************************************************************************
 Copyright 2012-2020 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

/*
 var column = {
 editable: "Boolean | String | Object | Function", // define edit behavior of cell. Implies focus
 focus:    "Boolean", // mark cell as able to receive keyboard focus, used for editable cells that don't need jeditable
 freeze:   "Boolean",
 name:     "String",
 render:   "Function",
 sortable: "Boolean",
 title:    "String",
 width:    "Percentage | fixed"
 }

 column.editable = {
 type:      "String",
 validate:  "Function",
 condition: "Function",
 typeSpecificProperties: "0-N"
 }

 var features = {
 resizable:  "Boolean",
 draggable:  "Boolean",
 freeze:     "Boolean",
 visibility: "Boolean",
 sharedVisibility: "Boolean"
 }

 var events = {
 beforeRender:  "Function",
 afterRender:   "Function",
 beforeRefresh: "Function",
 afterRefresh:  "Function",
 rowSelected:   "Function( $row, backboneRowModel )"
 cellSelected:  "Function( $cell, backboneRowModel )" // if cellSelected is provided, caller must manage editMode to prevent grid from acting on keyboard events while cell is being edited.
 }

 var data = {
 "success":     "Boolean",
 "totalCount":  "Number",
 "data":        [ { JSON }, ... ],
 "pageOffset":  "Number",
 "pageMaxSize": "Number"
 };
 */
var langDirection = $('meta[name=dir]').attr('content');
langDirection = ( langDirection === void 0 || langDirection !== "rtl" ? "ltr" : "rtl" );
var dirtyCheckTargets = [];

var dirtyCheckDefault = {

    save: function (options) {
        var callback = options.callback;
        var saveOptions = {
            success: function () {
                this.log("dirty check - success callback");
                /* Let the save animation complete before firing callback. */
                setTimeout(function(){callback()}, 500);
            }
        };
    },
    no: function (options) {
        var callback = options.callback;
        this.log("dirty check - no callback");
        callback();
    },
    isDirty: function (options) {
        var dirty = false;
        this.log("dirty check - isDirty: " + dirty);
        return dirty;
    },
    log: function () {
        if ( _.isBoolean( window.debug ) && window.debug == true ) {
            var args = Array.prototype.concat.apply( ["dirtyCheckDefault : "], arguments);
            console.log( args );
        }
    }
};

;(function ( $, _, Backbone, JSON, AjaxManager ) {
    window.Storage = {
        getObject: function ( name ) {
            var value = window.localStorage.getItem( name );
            return value && JSON.parse( value );
        },
        setObject: function ( name, value ) {
            window.localStorage.setItem( name, JSON.stringify( value ) );

            // function setCookie (name, value, expires, path, domain, secure) {
            //   document.cookie = name + "=" + escape(value) +
            //     ((expires) ? "; expires=" + expires : "") +
            //     ((path) ? "; path=" + path : "") +
            //     ((domain) ? "; domain=" + domain : "") +
            //     ((secure) ? "; secure" : "");
            // }
        }
    };
    var getModelId = (function() {
        var modelIdCounter = 0;
        return function(model) {

            if (!_.isUndefined( model.id )) {
                return model.id;
            } else {
                if ( _.isUndefined( model.cid )) {
                    model.cid = 'gridItem-' + ++this.modelIdCounter;
                }
                return model.cid;
            }
        }
    })();
    var generateBackboneCollection = function( config ) {

        _.defaults( config, {
            pageMaxSize:   5,
            sortColumn:    _.first( config.columns ).name,
            sortDirection: "asc",
            batch:         true
        });

        var ajaxManager    = window.ajaxManager || new AjaxManager(),
            ajaxId         = _.uniqueId( "gridAjaxManager" ),
            GridModel      = Backbone.Model.extend({ }),
            GridCollection = Backbone.PagedCollection.extend({
                model:         GridModel,
                url:           config.url,
                batch:         config.batch,
                sortColumn:    config.sortColumn,
                sortDirection: config.sortDirection,
                pageMaxSize:   config.pageMaxSize,
                ajaxCallback:  function( params ) {
                    return ajaxManager.create( ajaxId, { abortOld: true } ).add( params );
                }
            });

        var collection = new GridCollection;

        collection.bind( "fetching", function ( ) { if ($(".grid-container").height() > 10) { $(".grid-container").loading(); } else { $(".body-content").loading(); } } );
        collection.bind( "change", function ( model ) { model.makeDirty(); } );

        collection.fetch();

        return collection

    };

    Backbone.Grid = Backbone.View.extend({
        columns:       [],
        frozenColumns: [],
        data:          [],
        title:         null,
        keyTable:      null,
        pageLengths:   [ 50, 100, 250, 500 ],

        defaults: {
            display:       "",
            id:            "id",
            columns:       [],
            frozenColumns: [],
            data:          [],
            title:         null,
            keyTable:      null,
            pageLengths:   [ 50, 100, 250, 500 ],
            noDataMsg:     null
        },

        css: {
            grid:                   "grid",
            gridContainer:          "grid-container",
            gridWrapper:            "grid-wrapper",
            gridMainWrapper:        "grid-main-wrapper",
            gridFrozen:             "grid-frozen",
            gridFrozenWrapper:      "grid-frozen-wrapper",
            gridScrollX:            "grid-scroll-x",
            selected:               "selected",
            hover:                  "add-row-hover",
            header:                 "header",
            bottom:                 "bottom",
            columnVisibilityMenu:   "column-visibility-menu",
            visibilityControlColumn:"visibility-control-column",
            title:                  "title",
            gridWithoutTitle:       "grid-without-title",
            totalRecords:           "total-records",
            recordsInfo:            "records-info",
            mousedown:              "mousedown",
            resizable:              "resizable",
            draggable:              "draggable",
            uiWidget:               "ui-widget",
            uiWidgetHeader:         "ui-widget-header",
            uiWidgetContent:        "ui-widget-content",
            uiStateDefault:         "ui-state-default",
            contentContainerHeader: "content-container-header",
            sortIcon:               "sort-icon",
            sortDisabled:           "sort-disabled",
            uiIcon:                 "ui-icon",
            uiIconNorthSouth:       "ui-icon-carat-2-n-s",
            uiIconNorth:            "ui-icon-triangle-1-n",
            uiIconSouth:            "ui-icon-triangle-1-s",
            notificationSuccess:    "notification-success",
            notificationWarning:    "notification-warning",
            notificationError:      "notification-error",
            componentError:         "component-error",
            pagingText:             "paging-text",
            pagingContainer:        "paging-container",
            readOnly:               "readonly"
        },

        elements: {
            table:    "<table></table>",
            caption: "<caption role='alert' aria-live='polite'></caption>",
            thead:    "<thead></thead>",
            tbody:    "<tbody></tbody>",
            tr:       "<tr></tr>",
            th:       "<th scope='col'></th>",
            td:       "<td></td>",
            div:      "<div></div>",
            span:     "<span></span>",
            anchor:   "<a href='#'></a>",
            select:   "<select></select>",
            option:   "<option></option>",
            ul:       "<ul></ul>",
            li:       "<li></li>",
            label:    "<label></label>",
            checkbox: "<input type='checkbox'/>"
        },

        strings: { /* these strings should never be visible to the end-user, but may be seen by developers */
            storagePrefix:               "grid-column-state-",
            none:                        "none",
            asc:                         "asc",
            desc:                        "desc",
            even:                        "even",
            odd:                         "odd",
            errorSuccessProperty:        "invalid data.success property",
            errorTotalCountProperty:     "invalid data.totalCount property",
            errorDataProperty:           "invalid data.data property",
            errorPageOffsetProperty:     "invalid data.pageOffset property",
            errorPageMaxSizeProperty:    "invalid data.pageMaxSize property",
            errorColumnNameBlank:        "column name is blank",
            errorColumnTitleUndefined:   "column title is not defined",
            errorColumnWidth:            "invalid column width",
            errorColumnEditableProperty: "invalid column editable property",
            errorColumnRenderFunction:   "invalid column render callback"
        },

        features: {
            visibility: true,
            sharedVisibility: true,
            resizable: true,
            draggable: true,
            freeze:    false
        },

        events: {
            "click td":                               "selectCell"
        },

        focus: function() {
            this.keyTable && this.keyTable.focus();
        },

        editControls: 'a, area, button, input, object, select, textarea',

        /**
         * Enable edit mode when interacting with the contents of a cell to prevent the grid from acting on keyboard
         * events to move between cells.
         *
         * The grid will generally manage edit mode based on the focus (enable edit mode when a click or ENTER is pressed in a cell,
         * then disable edit mode on blur or when the focus changes outside the cell).  If an edit action will take the focus
         * to an element outside the cell, call editMode(false), then when finished, call editMode(true)
         */
        editMode: function(flag) {
            // this.keyTable && (this.keyTable.block = flag); // may need a separate flag to indicate explicitly in edit mode
            if(this.keyTable)   {
                if(flag)    {
                    this.keyTable.setActionableMode();
                } else {
                    this.keyTable.setNavigationMode();
                }
            }
        },

        /**
         * Enter 'edit' mode in cell, disabling keyboard events until done editing.
         * grid recognizes "done editing" by the focus moving outside the target cell.
         */
        editCell: function( cell ) {
            var tabs = $('[tabindex]', cell),
                editControls = $(this.editControls, cell).filter(':not([tabindex])').filter(':visible'),
                target = tabs.add( editControls ).first();

            if ( target.length)   {
                this.editMode(true);
                target.focus();
            }
        },


        selectCell: function (eventOrElement) {
            var target = $(eventOrElement.target || eventOrElement),
                td = target.closest( "td" ),
                tr = td.closest ( "tr" );

            this.$el.find( "." + this.css.selected ).removeClass( this.css.selected );

            this.$el.find( "tbody tr:nth-child(" + ( tr.index() + 1 ) + ")" ).addClass( this.css.selected );

            td.addClass( this.css.selected );

            if ( _.isFunction( this.options.rowSelected ) ) {
                var data = this.collection.get( parseInt( tr.attr( "data-id" ) ) );
                this.options.rowSelected.call( this, tr, data );
            }

            if ( _.isFunction( this.options.cellSelected ) ) {
                var data = this.collection.get( parseInt( td.attr( "data-id" ) ) );
                this.options.cellSelected.call( this, td, data );
            }
        },

        sort: function (e) {
            if ( $( e.target ).data( "just-sorted" ) == "true" ) {
                // skip
            } else {
                $( e.target ).data( "just-sorted", false );
                var view      = this,
                    el        = $( e.target ).is( "th" ) ? $( e.target ) : $( e.target ).closest( "th" );
                column    = $( el ).attr( "data-property" ),
                    direction = $( el ).attr( "data-sort-direction" );
                if ( direction == "disabled" ) {
                    e.preventDefault();
                    e.stopPropagation();

                    return;
                }

                if ( direction == this.strings.none )
                    direction = this.strings.asc;
                else
                    direction = direction == this.strings.asc ? this.strings.desc : this.strings.asc;

                this.log( "sort invoked, column: " + column + ", direction: " + direction );

                var innerSortTable = function () {
                    view.collection.sortColumn    = column;
                    view.collection.sortDirection = direction;
                    view.collection.sortColumnIdx = $(self).index();
                    view.collection.fetch();
                };

                if (this.collection.sortColumn    != column
                    || this.collection.sortDirection != direction) {
                    // todo: add dirty check integration
                    innerSortTable();
                }

                e.preventDefault();
                e.stopPropagation();
            }
        },

        validateOptions:  function () {
            var view   = this,
                result = { success: true, errors: [ ] };

            // TODO: convert to validate Backbone.PagedCollection
            // if ( !_.isBoolean( this.options.data.success ) )
            //   result.errors.push( this.strings.errorSuccessProperty );

            // if ( !this.options.data.totalCount
            //   || !_.isNumber( this.options.data.totalCount )
            //   || this.options.data.totalCount < 0 )
            //   result.errors.push( this.strings.errorTotalCountProperty );

            // if ( !this.options.data.data
            //   || !_.isArray( this.options.data.data )
            //   || this.options.data.data.length < 0 )
            //   result.errors.push( this.strings.errorDataProperty );

            // if ( !this.options.data.pageOffset
            //   || !_.isNumber( this.options.data.pageOffset )
            //   || this.options.data.pageOffset < 0 )
            //   result.errors.push( this.strings.errorPageOffsetProperty );

            // if ( !this.options.data.pageMaxSize
            //   || !_.isNumber( this.options.data.pageMaxSize )
            //   || this.options.data.pageMaxSize < 0 )
            //   result.errors.push( this.strings.errorPageMaxSizeProperty );

            var columnValidator = function ( c ) {
                var errors = [];

                if ( !c.name || _.string.isBlank( c.name ) )
                    errors.push( view.strings.errorColumnNameBlank );

                if ( !c.title )
                    errors.push( view.strings.errorColumnTitleUndefined );

                if ( !c.width
                    || (!_.string.endsWith( c.width, "%"  )
                        && !_.string.endsWith( c.width, "em" )
                        && !_.string.endsWith( c.width, "px" ) ) )
                    errors.push( view.strings.errorColumnWidth );

                if ( !_.isUndefined( c.editable )
                    && ( _.isNull( c.editable )
                        || ( !_.isBoolean( c.editable ) && !_.isString( c.editable ) && !_.isObject( c.editable ) && !_.isFunction( c.editable ) ) ) ) {
                    errors.push( view.strings.errorColumnEditableProperty );
                }

                if ( !_.isUndefined( c.render ) && !_.isFunction( c.render ) )
                    errors.push( view.strings.errorColumnRenderFunction );

                if ( errors.length > 0 ) {
                    result.errors = result.errors.concat( errors );
                    return true;
                }

                return false;
            };

            _.each( this.options.columns, columnValidator );

            if (result.errors.length > 0 )
                result.success = false;

            return result;
        },

        defaultColumnValues: function () {
            _.each( this.options.columns, function ( it ) {
                _.defaults( it, {
                    editable: false,
                    freeze:   false,
                    sortable: true,
                    visible:  true
                })
            });
        },

        defaultFeatureValues: function () {
            this.features.visibility = true;
            this.features.sharedVisibility = true;
            this.features.resizable = true;
            this.features.draggable = true;
            this.features.freeze    = false;
        },

        determineFeatures: function () {
            this.defaultFeatureValues();

            if( _.isBoolean( this.options.visibility ) )
                this.features.visibility = this.options.visibility;

            if( _.isBoolean( this.options.sharedVisibility ) )
                this.features.sharedVisibility = this.options.sharedVisibility;

            if( _.isBoolean( this.options.resizable ) )
                this.features.resizable = this.options.resizable;

            if( _.isBoolean( this.options.draggable ) )
                this.features.draggable = this.options.draggable;
        },

        initialize: function () {
            _.bindAll( this, 'notificationAdded', 'notificationRemoved', 'render' );
            // Modify grid columns according to any extensibility information
            this.options.columns = this.applyExtensions(this.options.columns);
            // make sure we have an id attribute
            if ( !this.$el.attr( 'id' ) )
                this.$el.attr( 'id', _.uniqueId( 'grid-' ) );

            this.$el.addClass( this.css.gridContainer );

            this.defaultColumnValues();
            this.determineFeatures();

            var view  = this,
                valid = this.validateOptions(),
                savedState = this.retrieveState();

            if ( !valid.success ) {
                _.each( valid.errors, function ( err ) { view.log( err ); });
            }

            this.columns = !_.isNull( savedState ) && _.isObject( savedState ) ? savedState : this.options.columns;
            this.title   = this.options.title;

            this.options.columns =  _.isEmpty(this.options.columns) ? [{name:'empty-grid', title:$.i18n.prop('js.grid.emptyColumnName')}] : this.options.columns
            var firstColumn = _.first( this.options.columns );

            this.options.widthType = _.string.endsWith( firstColumn.width, "%" ) ? "percentage" : "fixed";
            this.options.widthUnit = ( this.options.gridwidthType == "percentage" ? "%" : ( _.string.endsWith( firstColumn.width, "em" ) ? "em" : "px" ) );


            this.enabledColumns = _.reduce( //TODO: verify enabledColumns and keyboard nav with frozenColumns
                this.options.columns,
                function getEnabledColumnIndices( accumulator, item, index, list ) {
                    if (  item.editable || item.focus ) {
                        accumulator.push( index );
                    }
                    return accumulator;
                }, [] );

            this.options.cellSelected = this.options.cellSelected || this.editCell;

            this.columns       = _.where( this.options.columns, { freeze: false } );
            this.frozenColumns = _.where( this.options.columns, { freeze: true  } );


            if ( this.frozenColumns.length > 0 )
                this.features.freeze = true;

            if (!_.isUndefined(this.options.dirtyCheckDefault ) )  {
                this.dirtyCheckDefault = this.options.dirtyCheckDefault;
            } else {
                this.dirtyCheckDefault = dirtyCheckDefault;
            }

            if ( _.isArray( this.options.pageLengths ) ) {
                var validPageLengths = _.all( this.options.pageLengths, function ( it ) {
                    return _.isNumber( it ) && it > 0;
                });

                if ( validPageLengths )
                    this.pageLengths = this.options.pageLengths;
            }

            // TODO add initial config validation to that a valid collection, or a config object in this.options.collection
            // or the required properties are passed in on the main options object.. if not, log it and don't instantiate
            if ( this.options.collection instanceof Backbone.Collection ) {
                this.collection = this.options.collection;
            }
            else {
                if ( _.isObject( this.options.collection ) ) {

                    this.collection = generateBackboneCollection({
                        columns:       this.options.columns,
                        url:           this.collection.url,
                        pageMaxSize:   this.collection.pageMaxSize,
                        sortColumn:    this.collection.sortColumn,
                        sortDirection: this.collection.sortDirection,
                        batch:         this.collection.batch
                    });

                } else {

                    this.collection = generateBackboneCollection({
                        columns:       this.options.columns,
                        url:           this.options.url,
                        pageMaxSize:   this.options.pageMaxSize,
                        sortColumn:    this.options.sortColumn,
                        sortDirection: this.options.sortDirection,
                        batch:         this.options.batch
                    });

                }
            }

            this.collection.bind( "reset", function () { view.refresh(); } );
            this.collection.bind( "fetched", function () { view.hideSpinner(); } );
            this.collection.bind( "failed", function () { view.hideSpinner(); } );

            if ( _.isNull( this.collection.sortColumn ) ) {
                var column = _.first( this.options.columns );
                this.collection.sortColumn = column.name
            }

            if ( _.isNull( this.collection.sortDirection ) )
                this.collection.sortDirection = this.strings.asc;

            if ( _.isObject( this.options.features ) ) {
                _.each( _.keys( this.options.features ), function (it) {

                    if ( !_.isUndefined( this.features[ it ] ) )
                        this.features[ it ] = this.options.features[ it ];
                });
            }

            if( typeof( window.notifications ) != 'undefined' && typeof( window.notifications.bind ) == 'function' ) {
                window.notifications.bind('add',    this.notificationAdded );
                window.notifications.bind('remove', this.notificationRemoved );
            }

            if ( this.features.visibility && this.features.sharedVisibility ) {
                $(document).on( 'toggle-grid-column', function( event, name, visible ) {
                    if ( event.target !== view.el ) {
                        view.toggleColumnVisibility( name, visible, true );
                    }
                });
            }

            this.render();

            function matchHover( e ) {
                view.$el.find( "tbody tr:nth-child(" + ( $( this ).index() + 1 ) + ")" ).addClass( view.css.hover );
            }

            function removeMatchHover( e ) {
                view.$el.find( "tbody tr." + view.css.hover ).removeClass( view.css.hover );
            }

            this.$el.on( 'mouseenter', '.grid tr', matchHover )
                .on( 'mouseleave', '.grid tr', removeMatchHover );

            var lazyResizeHandler = _.debounce( function resizeHandler( e ) {
                view.recalcTitleWidths();
            }, 350 );

            $( window ).on( 'resize', lazyResizeHandler );
        },


        /***************************************************************************************************

         Modify this grid instance based on extensibility information in xe.extensions
         - determine grid's containing section. This HTML element will have a xe.attr.section attribute
         - locate any extensbility information for this grid instance in xe.extensions
         - modify the instantiation of this grid instance accordingly

    ***************************************************************************************************/
        applyExtensions: function(columnList) {

            var dataXESection;
            var gridExtensions;
            var attr = "[" + xe.attr.section + "]";

            if ( xe.extensions ) {

                // determine the container of this grid instance
                dataXESection = $(this.el).closest(attr).attr(xe.attr.section);

                if ( dataXESection ) {

                    gridExtensions = _.find(xe.extensions.sections, function(section) {
                        return section.name == dataXESection;
                    });

                if ( gridExtensions ) {
                    columnList = this.removeColumns( gridExtensions, columnList );
                    columnList = this.orderColumns( gridExtensions, columnList );
                    columnList = this.replaceColumnAttributes( gridExtensions, columnList);
                }
            }
        }
        return columnList;
    },

        /***************************************************************************************************

         Remove any baseline columns from this grid instance as specified by extensibility information

    ***************************************************************************************************/
    removeColumns: function( pGridExtensions, columnList ) {
        var extendedColumns = columnList;

        extendedColumns = _.filter( extendedColumns, function(baselineColumn) {
            return !(_.find(pGridExtensions.fields, function(removedColumn) {
                return removedColumn.exclude && (removedColumn.name == baselineColumn.name);
            }));
        } );
        return extendedColumns;
    },


        /***************************************************************************************************

         Reorder any baseline columns in this grid instance as specified by extensibility information

         ***************************************************************************************************/

    orderColumns: function( pGridExtensions, columnList ) {

        var removedColumn;
        var targetColumn;
        var validJSON;
        var thisGridInstance = this;
        var extendedColumns = columnList;

        _.each(pGridExtensions.orderedFields, function (extension) {
            if (_.has(extension, "nextSibling")) {

                validJSON = true;
                removedColumn = _.find(extendedColumns, function (column) {
                    return extension.name == column.name;
                });
                if (!removedColumn) {
                    thisGridInstance.log("JSON item not found in page");
                    validJSON = false;
                }

                if (extension.nextSibling) {
                    targetColumn = _.find(extendedColumns, function (column) {
                        return extension.nextSibling == column.name;
                    });
                    if (!targetColumn) {
                        thisGridInstance.log("JSON item not found in page");
                        validJSON = false;
                    }
                } else {
                    targetColumn = null;
                }

                if (validJSON) {
                    index = _.indexOf(extendedColumns, removedColumn);
                    extendedColumns.splice(index, 1);

                    if (!targetColumn) {
                        index = extendedColumns.length;
                    } else {
                        index = _.indexOf(extendedColumns, targetColumn);
                    }
                    extendedColumns.splice(index, 0, removedColumn);
                }
            }
        });
        return extendedColumns;
    },


    /***************************************************************************************************
    Replace any baseline column attributes from this grid instance as specified by extensibility information
    ***************************************************************************************************/
    replaceColumnAttributes: function( pGridExtensions, columnList ) {
        var thisGrid = this;
        var extendedColumns = columnList;

            _.each( pGridExtensions.fields, function(field) {

            var baselineColumn = _.findWhere(extendedColumns,{name: field.name});
            if (baselineColumn) {

                    if ( field.attributes ) {
                        if (_.has(field.attributes, "label") ) {
                            baselineColumn.title = xe.i18n(field.attributes.label);
                        }
                        if (_.has(field.attributes, "placeholder") ) {
                            baselineColumn.placeholder = xe.i18n(field.attributes.placeholder);
                        }
                    }

            }
        });
        return extendedColumns;
    },

  	setupKeyTable: function () {
            this.log( "setupKeyTable (" + !_.isUndefined( window.KeyTable ) + "): " + !_.isUndefined( this.keyTable ) );

            if ( window.KeyTable ) {
                if ( this.keyTable ) {
                    this.keyTable.fnDestroy();
                    this.keyTable = null;
                }

                var node = $(".page-number")[0];
                this.log( "setupKeyTable enabledColumns: ", this.enabledColumns );

                var view = this,
                    keyTable = this.keyTable = new KeyTable( { table: this.table[0],
                        form: false, tabindex:0 } );

                keyTable.event['action']( null, null, function actionSelectCell( cell, x, y ) {
                    // trigger the click action on the contained element, if any, or the td itself
                    var temp = $(':first-child',cell)
                    temp = temp.length? temp.first():cell;
                    if(temp[0].classList[1]=="select2")
                    {
                        temp=cell;
                        console.log(temp);
                    }
                    temp.click();
                });

                keyTable.event['blur']( null, null, function actionBlurCell( cell, x, y ) {
                    if ( keyTable.isActionableMode() ) {
                        var focus = $(':focus');
                        view.log( 'blurring cell: ', cell, 'to', focus, ' edit mode was: ', (view.keyTable && view.keyTable.isActionableMode()) );
                        if ( $.contains( cell, focus[0] )) {
                            focus.blur();
                        }
                    }
                });
            }
        },
        getMenuContainer: function() {
            return this.menuContainer || this.$el.find( "." + this.css.gridWrapper + " thead tr" );
        },

        generateColumnVisibilityControls: function() {
            if ( !this.features.visibility ) {
                return;
            }
            var view = this;

            var toggleColumnVisibility = function ( item, e ) {
                view.toggleColumnVisibility( $( e.target ).attr( "data-name" ) );
            };

            var map = _.map( _.filter( this.columns, function ( it ) {
                return it.title;
            }), function( it ) {
                return {
                    name:    it.name,
                    title:   it.title,
                    checked: _.isBoolean( it.visible ) ? it.visible : true
                };
            });

            if ( this.columnVisibilityControls ) {
                this.columnVisibilityControls.stopListening().undelegateEvents().$el.empty();
            }
            this.columnVisibilityControls = new Backbone.ButtonMenu({
                el:         this.$el.find( "." + this.css.columnVisibilityMenu ),
                container:  this.getMenuContainer(),
                gridWrapper: this.$el,
                items:      map,
                callback:   toggleColumnVisibility,
                buttonIcon: "grid-button-menu-icon"
            });

            this.columnVisibilityControls.render();
        },

        recalcTitleWidths: function () {
            var hasFrozenColumns = this.frozenTable === void 0 ? false : true
            var predefinedWidth   = this.frozenTable === void 0 ? void 0 : this.frozenTable.css("width");
            var frozenWidthString = this.options.frozenWidth || predefinedWidth || "auto";
            var frozenWidth = ( "auto" == frozenWidthString ? 0 : parseInt(frozenWidthString));
            var outerWidth  = this.$el.find(".grid-wrapper").width();

            var mainWidthString = ( "auto" == frozenWidthString ? "auto" : (outerWidth - frozenWidth) + this.parseMeasurementType(frozenWidthString));
            if (!hasFrozenColumns) {
                if (outerWidth === 0) {
                    mainWidthString = "100%"
                }
                else {
                    mainWidthString = "" + "100%"
                }
            }

            if (hasFrozenColumns) {
                this.$el.find(".grid-frozen-wrapper").css("width", frozenWidthString);
            }
            this.$el.find(".grid-main-wrapper").css({ "width": mainWidthString, "display": "block"});

            _.each( this.$el.find("table th"), function( it ) {
                var el = $( it );
                var title = el.find('.title');
                if ( title.length ) {
                    title.css('width', 'auto');
                    var padding = 5
                    var titleWidth = parseInt(title.css( 'width')) + padding
                    var handleWidth = el.find( '.sort-handle' ).length > 0 ? parseInt(el.find( '.sort-handle' ).css( 'width')) : 0
                    var iconWidth = el.find( '.sort-icon' ).length > 0 ? parseInt(el.find( '.sort-icon' ).css( 'width')) : 0
                    var cellWidth = el.width()
                    // todo: better detection. This handles titles with ellipses
                    if (titleWidth + handleWidth + iconWidth + 6 >= el.width()) {
                        title.css('width', (cellWidth - handleWidth - iconWidth - padding - 12 ) + "px");
                    }
                }
            });
        },

        parseMeasurementType: function (sizeString) {
            var units = ["px", "%", "em"];
            var found = _.find(units, function(unit) {
                if (-1 != sizeString.indexOf(unit)) {
                    return true;
                }
            });
            return found || "";
        },
        render: function () {
            var view = this;

            if ( _.isFunction( this.options.beforeRender ) )
                this.options.beforeRender.call( this );

            this.generateTable();
            this.generateWrapper();
            this.generateColumnVisibilityControls();

            if( this.features.freeze ) {
                this.generateFrozenTable();

                var widthReducer = function ( memo, it ) {
                    return memo + parseInt( it.width.replace( view.options.widthUnit, "" ) );
                };

                var frozenWidth = _.reduce( this.frozenColumns, widthReducer, 0 );

                if ( view.options.widthType != "percentage" ) {
                    frozenWidth = Math.ceil( ( ( frozenWidth + ( this.frozenColumns.length * 10 ) ) / this.$el.outerWidth() ) * 100 );
                }

                this.$el.find( "." + this.css.gridFrozenWrapper ).css( "width", frozenWidth + "%" );
                this.$el.find( "." + this.css.gridMainWrapper   ).css( "width", ( 100 - frozenWidth )   + "%" );
            }
            else
                this.$el.find( "." + this.css.gridMainWrapper ).css( "width", "100%" );

            this.setupScrolling();

            this.setupKeyTable();

            this.draggableColumns();

            window.ResizableColumns( this.table );

            if ( _.isFunction( this.options.afterRender ) )
                this.options.afterRender.call( this );
        },

        setupScrolling: function () {
            var frozenWidth = this.frozenTable ? this.frozenTable.width() : 0
            if ( this.options.widthType != "percentage" ) {
                var widths = _.reduce( $( "th", this.table ), function ( memo, it ) { return memo + $( it ).width() }, 0 );

                if ( widths + frozenWidth > this.$el.find( "." + this.css.gridMainWrapper ).outerWidth() )
                    this.$el.find( "." + this.css.gridMainWrapper ).addClass( this.css.gridScrollX );
                else
                    this.$el.find( "." + this.css.gridMainWrapper ).removeClass( this.css.gridScrollX );
            }
        },

        destroy: function () {
            delete this.columns;
            delete this.title;

            this.keyTable && this.keyTable.fnDestroy();
            delete this.keyTable;
            delete this.pageLengths;

            this.columns     = this.defaults.columns;
            this.title       = this.defaults.title;
            this.keyTable    = this.defaults.keyTable;
            this.pageLengths = this.defaults.pageLengths;

            this.$el.empty();
        },

        log: function () {
            if ( _.isBoolean( window.debug ) && window.debug == true ) {
                var args = Array.prototype.concat.apply( ["backbone.grid ( " +  this.$el.attr( "id" ) + " ): "], arguments);
                console.log( args );
            }
        },

        updateData: function ( id, name, value ) {
            var map   = { },
                model = this.collection.get( parseInt( id ) );

            map[ name ] = value;

            model.set( map );

            return value;
        },

        toggleColumnVisibility: function ( name, visible, quiet ) {
            var column = _.find( this.columns, function ( it ) { return it.name == name; } );
            if ( _.isUndefined( column )) return;

            var oldVisible = ( _.isUndefined( column.visible ) || column.visible ? true : false );
            if ( _.isUndefined( visible )) {
                column.visible = !oldVisible;
            } else {
                column.visible = visible;
                this.generateColumnVisibilityControls(); // sync menu checkboxes
            }

            this.refresh( true );

            if ( !quiet ) {
                this.$el.trigger( "toggle-grid-column", [column.name, column.visible] );
            }
        },

        resolveProperty: function ( obj, property ) {
            property = property.split( '.' );

            while( obj && property[ 0 ] )
                obj = obj[ property.shift() ] || undefined;

            return obj;
        },


        draggableColumns: function() {
            if ( this.features.draggable ) {
                this.table.addClass( this.css.draggable );
                window.setupColumnReordering( this.table );
            }
        },

        refresh: function ( fullRefresh ) {
            fullRefresh = ( _.isBoolean( fullRefresh ) ? fullRefresh : false );

            this.log( "executing " + ( fullRefresh ? "full " : "" ) + "refresh" );

            if ( _.isFunction( this.options.beforeRefresh ) )
                this.options.beforeRefresh.call( this );

            if ( fullRefresh ) {
                this.$el.find( "table" ).empty();
                this.columns = this.applyExtensions(this.columns);

                this.generateHead();

                this.generateBody();

                this.generateColumnVisibilityControls();

                if ( this.features.freeze ) {
                    this.generateFrozenHead();
                    this.generateFrozenBody();
                }

                this.setupScrolling();

                this.draggableColumns();

                window.ResizableColumns( this.table );
            }

            var view  = this,
                tbody = this.table.find( "tbody" ),
                clz   = this.strings.odd;

            tbody.empty();

            var columnState = view.getColumnState();
            if(view.collection.length == 0){
                view.renderNoRecordsFound();
            } else {
                view.toggleTableChrome(true);
                _.each(view.collection.models, function (model) {
                    var tr = $(view.elements.tr),
                        it = model.toJSON();

          		tr.attr( "data-id", getModelId( model ));
          		tr.addClass ( clz );

                    clz = ( clz == view.strings.odd ? view.strings.even : view.strings.odd );

                    _.each(columnState, function (col) {
                        if (_.isBoolean(col.visible) && !col.visible)
                            return;

                        var piece,
                            td = $(view.elements.td);

                        if ( _.isFunction( col.render ) )
                            td.append( col.render.call( this, it, col ) );
                        else {
                            td.text( view.resolveProperty( it, col.name ) || view.defaults.display );
                        }

                        td.attr( "data-id", getModelId(model) );
                        td.attr( "data-property", col.name );
                        //assign extensibility field id
                        td.attr( xe.typePrefix + xe.type.field,col.name);

                        if (col.width)
                            td.css("width", col.width);

                        td = view.determineColumnEditability(col, td, it);
                        tr.append(td);
                    });

                    if (_.isFunction(view.options.processRow)) {
                        var processedRow = view.options.processRow.call(view, tr, it);
                        tr = ( !_.isUndefined(processedRow) ? processedRow : tr );
                    }

                    tbody.append(tr);
                });
            }

            this.setSortDirectionVisual();
            this.updateRecordCount();

            this.setupKeyTable();

            if ( this.features.freeze )
                this.refreshFrozen();

            if ( _.isFunction( this.options.afterRefresh ) )
                this.options.afterRefresh.call( this );

            this.generateColumnVisibilityMenuColumn();

            this.addDirtyCheckFor(view.sortElements, this.dirtyCheckDefault);

        },

        generateColumnVisibilityMenuColumn: function(){

            if ( this.features.visibility ) {
                var readOnly = this.css.readOnly;
                var editControls = this.editControls;
                var getTDPos, tdLen, tdAtPos, row, isActionableComponentExists;
                var tableCell = $(this.elements.td).addClass(this.css.visibilityControlColumn);
                this.table.find('tbody tr').append(tableCell);
                $('tbody tr',this.table).each(function(){
                    row = $(this);
                    tdLen = $(row).find('td').length;
                    getTDPos = (tdLen>2)?(tdLen-2):0;
                    tdAtPos = $(row).find("td").eq(getTDPos);
                    allClasses = $(tdAtPos).attr('class');
                    $(row).find('td').last().addClass(allClasses);
                });
            }
        },

        toggleTableChrome: function( visible ) {
            this.table.find('thead').toggle( visible );
            this.$el.find( "." + this.css.bottom ).toggle( visible );

            if ( visible ) {
                this.generatePagingControls();
            } else {
                this.removePagingControls();
            }
        },

        renderNoRecordsFound: function() {
            var tr = $(this.elements.tr),
                td = $(this.elements.td),
                tbody = this.table.find('tbody');

            this.toggleTableChrome( false );

            // Inject the row into the list.
            td.text(this.options.noDataMsg || $.i18n.prop('js.grid.noData'))
                .attr('colspan', '100%')
                .addClass('noRecordsFoundMessage');
            tr.append(td);
            tbody.append(tr);
        },

        determineColumnEditability: function ( column, el, data ) {
            var view = this,
                editableSubmitCallback = function ( value, settings ) {
                    view.log( "editableSubmitCallback editMode=", (view.keyTable && view.keyTable.gridCurrentMode));
                    view.editMode( false );
                    return view.updateData.call( view, $( this ).attr( "data-id" ), $( this ).attr( "data-property" ), value );
                };

            if ( !_.isUndefined( column.editable ) && _.isFunction( el.editable ) ) {
                var options  = undefined,
                    defaults = {
                        height: "none",
                        onblur: function ( val, settings ) {
                            view.log( "editable onblur, editMode=", (view.keyTable && view.keyTable.gridCurrentMode));
                            view.editMode( false );
                            $( 'form', this ).submit();
                        },
                        placeholder: column.placeholder && "<span class='xe-placeholder'>"+xe.i18n(column.placeholder)+"</span>"
                    };

                if ( _.isBoolean( column.editable ) && column.editable )
                    options = { };
                else if ( _.isString( column.editable ) )
                    options = { type: column.editable };
                else if ( _.isFunction( column.editable ) ) {
                    var isEditable = column.editable.call( this, column, el, data );

                    if ( _.isBoolean( isEditable ) && isEditable )
                        options = { };
                }
                else if ( _.isObject( column.editable ) ) {
                    if ( _.isFunction( column.editable.condition ) ) {
                        var isEditable = column.editable.condition.call( this, column, el, data );

                        if ( _.isBoolean( isEditable ) && isEditable )
                            options = _.omit( column.editable, "condition" );
                    }
                    else
                        options = _.clone( column.editable );
                }


                if ( !_.isUndefined( options ) ) {
                    el.on( 'click.onedit', function( e ) {
                        view.log( "editable click.onedit", (view.keyTable && view.keyTable.gridCurrentMode));
                        view.selectCell.call( view, e );
                    });

                    el.editable( editableSubmitCallback, _.extend( defaults, options ) );
                }

                if($(view.editControls,el).length === 0) {
                    el.addClass(view.css.readOnly);
                }
            }

            return el;
        },


        refreshFrozen: function () {
            if (undefined !== this.frozenTable) {
                var view  = this,
                    tbody = this.frozenTable.find( "tbody" ),
                    clz   = this.strings.odd;

                tbody.empty();

                var columnState = this.frozenColumns;

                _.each( view.getDataAsJson(), function ( it ) {
                    var tr = $( view.elements.tr );

        	 tr.attr( "data-id", getModelId(it) );
       		 tr.addClass ( clz );

                    clz = ( clz == view.strings.odd ? view.strings.even : view.strings.odd );

                    _.each( columnState, function ( col ) {
                        if ( _.isBoolean( col.visible ) && !col.visible )
                            return;

                        var piece,
                            td = $( view.elements.td );

		          if ( _.isFunction( col.render ) )
		            td.append( col.render.call( this, it, col ) );
		          else {
		            td.text( it[ col.name ] || view.defaults.display );
		          }

                        td.attr( "data-id", getModelId( it ));
                        td.attr( "data-property", col.name );

                        if ( col.width )
                            td.css( "width", col.width );

                        tr.append( td );
                    });

                    tbody.append( tr );
                });
            }
        },

        redraw: function () {
            this.log( "executing redraw" );

            this.keyTable && this.keyTable.fnDestroy();
            delete this.keyTable;

            this.$el.empty();
            this.render();
        },

        setColumnState: function ( columns ) {
            var state = this.retrieveState();
        },

        getColumnState: function () {
            var view        = this,
                parentWidth = this.$el.find( "table" ).width();

            var percentageOfParent = function ( it ) {
                return Math.floor( ( it / parentWidth ) * 100 );
            };

            var currentOrder = _.sortBy( _.reject( this.columns, function ( it ) {
                return _.isBoolean( it.visible ) && it.visible == false;
            }), function ( it ) {
                return view.$el.find( "th[data-property='" + it.name + "']" ).index();
            });

            var cols = _.map ( currentOrder, function ( it ) {
                var th = view.$el.find( "th[data-property='" + it.name + "']" );

                return _.extend( _.clone( it ), {
                    width: percentageOfParent( $( th ).outerWidth( true ) )
                });
            });

            if ( cols.length == 0 )
                return [ ];

            var totalCalcWidth = _.reduce( cols, function( one, two ){
                one = _.isObject( one ) ? one.width : one;
                return one + two.width;
            }, 0);

            var leftOvers = 100 - totalCalcWidth;

            var firstNoneZero = _.find( cols, function ( it ) { return it.width > 0; } );

            if ( !_.isUndefined( firstNoneZero ) )
                firstNoneZero.width = firstNoneZero.width + leftOvers;

            _.each( cols, function (it) {
                var c = _.find( view.columns, function (column) { return it.name == column.name; });
                it.editable = c.editable;
                it.title    = c.title;
                it.width    = it.width + "%";
                it.visible  = c.visible;
                it.name = c.name;
            });

            return cols;
        },

        generateTable: function () {
            var view = this;

            this.table = $( this.elements.table ).addClass( this.css.grid + " " + this.css.uiWidgetContent );
            this.caption = $(this.elements.caption).addClass("offscreen").append(this.title);
            $(this.table).append(this.caption);
            if ( this.features.resizable )
                this.table.addClass( this.css.resizable );

            var mainGridWrapper = $( this.elements.div ).addClass( this.css.gridMainWrapper ).append( this.table ),
                overallWrapper  = $( this.elements.div ).addClass( this.css.gridWrapper ).append( mainGridWrapper );

            this.$el.append( overallWrapper );


            mainGridWrapper.mutate( 'width', function ( element, info ) {
                //console.log('width resize, ' + element + ', ' + info );

                view.setupScrolling();
            });

            this.generateHead();
            this.generateBody();
        },

        columnSortIcon: function ( column ) {
            if (this.collection.sortColumn != column.name )
                return this.css.uiIconNorthSouth;

            return this.collection.sortDirection == this.strings.asc ? this.css.uiIconSouth : this.css.uiIconNorth;
        },

        _generateHead: function( table, columns ) {
            var view  = this,
                thead = $( this.elements.thead ),
                tr    = $( this.elements.tr );
            this.sortElements = [];
            _.each( columns, function ( it ) {
                if ( _.isBoolean( it.visible ) && !it.visible )
                    return;

                var th          = $( view.elements.th ),
                    title       = $( view.elements.div ).addClass( view.css.title ).text( it.title ).attr( "title", it.title ),
                    sortClasses = view.css.sortIcon + " "+ view.css.uiIcon + " " + view.columnSortIcon( it ),
                    sortIcon    = $( "<button type='button'>" ).addClass( sortClasses );

                th.append( title );

                if ( _.isBoolean( it.sortable ) && !it.sortable ) {
                    th.attr( "data-sort-direction", "disabled" );
                    th.addClass( view.css.sortDisabled );
                }
                else {
                    sortIcon.attr( 'title', $.i18n.prop( 'js.grid.toggleSortBy', [it.title] ));
                    th.append( sortIcon );
                    th.attr( "data-sort-direction", ( it.name == view.collection.sortColumn ) ? view.collection.sortDirection : view.strings.none );

                    function ariaDirection( direction ) {
                        var gridToAria = {
                            "asc": "ascending",
                            "desc": "descending"
                        };
                        return gridToAria[direction] || "none";
                    }
                    th.attr( "aria-sort", ariaDirection( th.attr( "data-sort-direction" )));
                }

                th.addClass( _.string.dasherize( it.name ) + "-col" + " " + view.css.uiStateDefault );
                th.attr( "data-property", it.name );
                //assign extensibility field id
                th.attr( xe.typePrefix + xe.type.field,it.name);

                if ( it.width )
                    th.css( "width", it.width );

                tr.append( th );
                view.sortElements.push(th);
            });

            thead.append ( tr );
            table.append ( thead );
            view.$el.on('click','th',function (e) {
                view.sort.call(view, e);
            });
            this.generateColumnControlMenuHeader(table);
        },

        generateColumnControlMenuHeader:function(table){
            if ( this.features.visibility ) {
                var tr = table.find('tr');
                var lastColumnHead = tr.find('th').last();
                var columnVisibilityMenuExists = lastColumnHead.children().hasClass(this.css.columnVisibilityMenu);

                if(columnVisibilityMenuExists == false){
                    var tableHeaderHeight = tr.height();

                    var columnVisibilityMenu =  $(this.elements.div)
                        .addClass(this.css.columnVisibilityMenu)
                        .attr('tabindex',0)
                        .height(tableHeaderHeight);

                    var columnVisibilityMenuHeader = $(this.elements.th)
                        .append(columnVisibilityMenu)
                        .attr( "data-sort-direction", "disabled" )
                        .addClass(this.css.sortDisabled + " " + this.css.visibilityControlColumn);

                    tr.append(columnVisibilityMenuHeader);
                }
            }
        },

        generateHead: function () {
            this._generateHead( this.table, this.columns );
        },

        setSortDirectionVisual: function () {
            var view = this;

            _.each( this.$el.find( "th" ), function ( th ) {
                if ( $( th ).attr( "data-sort-direction" ) == "disabled" )
                    return;

                var prop = $( th ).attr( "data-property" ),
                    iconClz = view.columnSortIcon({ name: prop });

                $( th ).find( "." + view.css.sortIcon ).removeClass( view.css.uiIconNorthSouth + " " + view.css.uiIconNorth + " " + view.css.uiIconSouth )
                    .addClass( iconClz );

                $( th ).attr( "data-sort-direction", ( prop == view.collection.sortColumn ) ? view.collection.sortDirection : view.strings.none );
            });
        },
        getSortElements: function () {
            return this.sortElements;
        },
        getPageActions: function () {
            return pagingActions;
        },
        getDataAsJson: function () {
            return this.collection.toJSON();
        },

        storeState: function () {
            window.Storage.setObject( this.strings.storagePrefix + _.string.dasherize( this.$el.attr( "id" ) ), this.getColumnState() );
        },

        retrieveState: function () {
            var state = window.Storage.getObject( this.strings.storagePrefix + _.string.dasherize( this.$el.attr( "id" ) ) );
            return state;
        },

        generateBody: function () {
            this.table.append( $( this.elements.tbody ) );
        },

        generateWrapper: function () {
            this.$el.addClass( this.css.uiWidget );

            var gridWrapper = this.$el.find( "." + this.css.gridWrapper );

            if ( this.title ) {
                this.menuContainer = $( this.elements.div ).
                    addClass( this.css.header + " " + this.css.uiWidgetHeader + " " + this.css.contentContainerHeader ).
                    append( $( this.elements.span ).addClass( this.css.title ).text( this.title ) );
                gridWrapper.before( this.menuContainer );
            } else {
                gridWrapper.addClass( this.css.gridWithoutTitle );
            }

            gridWrapper.after(  $( this.elements.div ).addClass( this.css.bottom + " " + this.css.uiWidgetHeader ) );
        },

        updateRecordCount: function () {
            this.$el.find( "." + this.css.recordsInfo ).remove();

            var records = $( this.elements.span ).addClass(
                    this.css.pagingText + " " +
                    this.css.recordsInfo).text( $.i18n.prop( "js.grid.recordsFound", [ _.isUndefined( this.collection.totalCount ) ? this.collection.length : Math.max(this.collection.totalCount, this.collection.length) ] ));

            this.$el.find( "." + this.css.bottom ).append( records );
        },

        removePagingControls: function() {
            this.$el.find( "." + this.css.pagingContainer ).remove();
            pagingActions = [];
        },

        generatePagingControls: function () {
            this.removePagingControls();
            pagingActions =[];
            if ( this.collection.paginate ) {
                var paging = $( this.elements.div ).addClass( this.css.pagingContainer );

                this.$el.find( "." + this.css.bottom ).append( paging );

                var pagingControls = new Backbone.PagingControls({
                    el:          paging,
                    collection:  this.collection,
                    pageLengths: this.pageLengths,
                    dirtyCheckDefault: this.dirtyCheckDefault
                });
                pagingControls.render();
                pagingActions = pagingControls.getPagesActions();
                this.log("Paging Actions  : " + pagingActions);
            }
        },

        generateFrozenTable: function () {
            var frozenTableWrapper = $( this.elements.div ).addClass( this.css.gridFrozenWrapper );

            this.frozenTable = $( this.elements.table ).addClass( this.css.grid + " " + this.css.gridFrozen + " " + this.css.uiWidgetContent );

            this.$el.find( "." + this.css.gridMainWrapper ).before( frozenTableWrapper.append( this.frozenTable ) );

            this.generateFrozenHead();
            this.generateFrozenBody();
        },

        generateFrozenHead: function () {
            this._generateHead( this.frozenTable, this.frozenColumns );
        },

        generateFrozenBody: function () {
            this.frozenTable.append( $( this.elements.tbody ) );
        },

        getModelFromNotification: function( notification ) {
            var m = notification.get( "model" );
            if( _.isNull( m ) || _.isUndefined( m ) || (_.isUndefined( m.id ) && _.isUndefined( m.cid )))
                return false;

            var model = this.collection.get( getModelId( m ));



            return ( _.isNull( model ) ? false : model );
        },


        getStyleForNotificationType: function( notification ) {
            var types = { success: this.css.notificationSuccess, warning: this.css.notificationWarning },
                clz   = types[ notification.get( "type" ) ] || this.css.notificationError;

            return clz;
        },


        notificationAdded: function( notification ) {
            var model = this.getModelFromNotification( notification );

            if ( model ){
                var notificationComponents = this.getNotificationComponents(notification, model);
                var notificationStyle = this.getStyleForNotificationType( notification );
                this.addNotificationStyle(notificationComponents,notificationStyle);
                var inputElement = notificationComponents.inputElement;
                if(inputElement.length > 0){
                    window.notifications.get(notification).attributes.component = inputElement;
                    inputElement.addClass(this.css.componentError);
                }
            }
        },

        notificationRemoved: function( notification ) {
            var model = this.getModelFromNotification( notification );

            if ( model ) {
                var notificationComponents = this.getNotificationComponents(notification, model);
                var notificationStyle = this.getStyleForNotificationType( notification );
                this.removeNotificationStyle(notificationComponents,notificationStyle);
            }
        },

        addNotificationStyle: function(notificationComponents,notificationStyle){
            for (var component in notificationComponents) {
                notificationComponents[component].addClass(notificationStyle);
            }
        },

        removeNotificationStyle: function(notificationComponents,notificationStyle){
            for (var component in notificationComponents) {
                notificationComponents[component].removeClass(notificationStyle);
            }

            if(notificationComponents.tableRow.find("."+this.css.notificationError).length > 0){
                notificationComponents.tableRow.addClass(this.css.notificationError);
            }
        },

        getNotificationComponents: function (notification,model) {
            var tableRow = this.$el.find( "tr[data-id=" + model.get( "id" ) + "]" ).stop( true, true );
            var columnName = notification.attributes.attribute;
            var tableCell = tableRow.find("td[data-property=" + columnName + "]");
            var inputElement = tableCell.find(':input');
            var notificationComponents = {"inputElement":inputElement,"tableCell":tableCell,"tableRow":tableRow};
            return notificationComponents;
        },

        hideSpinner: function(target) {
            $(".grid-container").loading(false);
            $(".body-content").loading(false);
            this.recalcTitleWidths();
        },
        addDirtyCheckFor: function (target, dirtyCheckDefaults) {

            var targetExistsInDom = ($(target).size() > 0);
            var targetIndex = dirtyCheckTargets.indexOf(target);
            var targetExistsInTracker = targetIndex > -1;

            // If the element does not exist in dom and is present in tracker, remove it.
            if(targetExistsInTracker && !targetExistsInDom) {
                dirtyCheckTargets.splice(targetIndex, 1);
            }

            // add a dirty check only if the element exists in dom and is not already being tracked.
            if(targetExistsInDom && !targetExistsInTracker) {
                dirtyCheckTargets.push(target);
                $(target).dirtyCheck(dirtyCheckDefaults);
            }
        }
    });
}).call (this, $, _, Backbone, JSON, AjaxManager );

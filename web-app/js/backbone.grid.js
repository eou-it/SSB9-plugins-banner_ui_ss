/*
var column = {
  editable: "Boolean | String | Object | Function",
  freeze:   "Boolean",
  name:     "String",
  render:   "Function",
  sortable: "Booleab",
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
  afterRefresh:  "Function"
  rowSelected:   "Function"
}

var data = {
  "success":     "Boolean",
  "totalCount":  "Number",
  "data":        [ { JSON }, ... ],
  "pageOffset":  "Number",
  "pageMaxSize": "Number"
};
*/

(function ( $, _, Backbone, JSON, AjaxManager ) {
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
      pageLengths:   [ 50, 100, 250, 500 ]
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
      hover:                  "hover",
      header:                 "header",
      bottom:                 "bottom",
      columnVisibilityMenu:   "column-visibility-menu",
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
      pagingText:             "paging-text" // TODO: remove -> Backbone.PagingControls
    },

    elements: {
      table:    "<table></table>",
      thead:    "<thead></thead>",
      tbody:    "<tbody></tbody>",
      tr:       "<tr></tr>",
      th:       "<th></th>",
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

    strings: {
      storagePrefix:               "grid-column-state-",
      none:                        "none",
      asc:                         "asc",
      desc:                        "desc",
      even:                        "even",
      odd:                         "odd",
      recordsFound:                "Records Found",
      labelSeperator:              ": ",
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
      "click td":                               "selectCell",
      "click th":                               "sort",
      "click span.sort-icon":                   "sort",
      "click span.span.title":                  "sort"
    },

    selectCell: function (e) {
      var td = $(e.target),
          tr = td.closest ( "tr" );

      this.$el.find( "." + this.css.selected ).removeClass( this.css.selected );
      tr.addClass( this.css.selected );
      td.addClass( this.css.selected );

      if ( _.isFunction( this.options.rowSelected ) ) {
        var data = this.collection.get( parseInt( tr.attr( "data-id" ) ) );

        this.options.rowSelected.call( this, tr, data );
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

      // TODO: convert to vaidate Backbone.PagedCollection
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
      _.bindAll( this, 'notificationAdded', 'notificationRemoved' );

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


      var firstColumn = _.first( this.options.columns );

      this.options.widthType = _.string.endsWith( firstColumn.width, "%" ) ? "percentage" : "fixed";
      this.options.widthUnit = ( this.options.gridwidthType == "precentage" ? "%" : ( _.string.endsWith( firstColumn.width, "em" ) ? "em" : "px" ) );


      this.columns       = _.where( this.options.columns, { freeze: false } );
      this.frozenColumns = _.where( this.options.columns, { freeze: true  } );


      if ( this.frozenColumns.length > 0 )
        this.features.freeze = true;


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


      this.collection.bind( "reset", function () {
        view.refresh();
      });

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
    },

    setupKeyTable: function () {
      this.log( "setupKeyTable (" + !_.isUndefined( window.KeyTable ) + "): " + !_.isUndefined( this.keyTable ) );

      if ( window.KeyTable ) {
        if ( !_.isUndefined( this.keyTable ) && !_.isNull( this.keyTable ) ) {
          $( document ).unbind( "keypress", this.keyTable._fnKey );
          $( document ).unbind( "keydown",  this.keyTable._fnKey );

          this.$el.find( "td" ).die( 'click', this.keyTable._fnClick );
        }

        this.keyTable = new KeyTable( { table: this.table[0] } );
      }
    },

    generateColumnVisibilityControls: function() {
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
          container:  this.menuContainer,
          items:      map,
          callback:   toggleColumnVisibility,
          buttonIcon: "grid-button-menu-icon"
      });

      this.columnVisibilityControls.render();
    },

    render: function () {
      var view = this;

      if ( _.isFunction( this.options.beforeRender ) )
        this.options.beforeRender.call( this );

      this.generateTable();
      this.generateWrapper();

      if ( this.features.visibility )
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

      dragtable.init();
      window.ResizableColumns( this.table );

      if ( _.isFunction( this.options.afterRender ) )
        this.options.afterRender.call( this );
    },

    setupScrolling: function () {
      if ( this.options.widthType != "percentage" ) {
        var widths = _.reduce( $( "th", this.table ), function ( memo, it ) { return memo + $( it ).width() }, 0 );

        if ( widths > this.$el.find( "." + this.css.gridMainWrapper ).outerWidth() )
          this.$el.find( "." + this.css.gridMainWrapper ).addClass( this.css.gridScrollX );
        else
          this.$el.find( "." + this.css.gridMainWrapper ).removeClass( this.css.gridScrollX );
      }
    },

    destroy: function () {
      delete this.columns;
      delete this.title;
      delete this.keyTable;
      delete this.pageLengths;

      this.columns     = this.defaults.columns;
      this.title       = this.defaults.title;
      this.keyTable    = this.defaults.keyTable;
      this.pageLengths = this.defaults.pageLengths;

      this.$el.empty();
    },

    log: function ( msg ) {
      if ( _.isBoolean( window.debug ) && window.debug == true )
        console.log( "backbone.grid ( " +  this.$el.attr( "id" ) + " ): " + msg );
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


    refresh: function ( fullRefresh ) {
      fullRefresh = ( _.isBoolean( fullRefresh ) ? fullRefresh : false );

      this.log( "executing " + ( fullRefresh ? "full " : "" ) + "refresh" );

      if ( _.isFunction( this.options.beforeRefresh ) )
          this.options.beforeRefresh.call( this );

      if ( fullRefresh ) {
        this.$el.find( "table" ).empty();

        this.generateHead();
        this.generateBody();

        if ( this.features.freeze ) {
          this.generateFrozenHead();
          this.generateFrozenBody();
        }

        this.setupScrolling();

        dragtable.init();
        window.ResizableColumns( this.table );
      }

      var view  = this,
          tbody = this.table.find( "tbody" ),
          clz   = this.strings.odd;

      tbody.empty();

      var columnState = view.getColumnState();

      _.each( view.collection.models, function ( model ) {
        var tr = $( view.elements.tr ),
            it = model.toJSON();

        tr.attr( "data-id", it.id );
        tr.addClass ( clz );

        clz = ( clz == view.strings.odd ? view.strings.even : view.strings.odd );

        _.each( columnState, function (col) {
          if ( _.isBoolean( col.visible ) && !col.visible )
            return;

          var piece,
              td = $( view.elements.td );

          if ( _.isFunction( col.render ) )
            td.append( col.render.call( this, it ) );
          else {
            td.text( view.resolveProperty( it, col.name ) || view.defaults.display );
          }

          td.attr( "data-id", it.id );
          td.attr( "data-property", col.name );

          if ( col.width )
            td.css( "width", col.width );

          td = view.determineColumnEditability( col, td, it );

          tr.append( td );
        });

        if ( _.isFunction( view.options.processRow ) ) {
          var processedRow = view.options.processRow.call( view, tr, it );
          tr = ( !_.isUndefined( processedRow ) ? processedRow : tr );
        }

        tbody.append( tr );
      });

      this.setSortDirectionVisual();
      this.updateRecordCount();

      this.setupKeyTable();

      if ( this.features.freeze )
        this.refreshFrozen();

      if ( _.isFunction( this.options.afterRefresh ) )
          this.options.afterRefresh.call( this );
    },


    determineColumnEditability: function ( column, el, data ) {
      var view = this,
          editableSubmitCallback = function ( value, settings ) {
            return view.updateData.call( view, $( this ).attr( "data-id" ), $( this ).attr( "data-property" ), value );
          };

        if ( !_.isUndefined( column.editable ) && _.isFunction( el.editable ) ) {
          var options  = undefined,
              defaults = {
                height: "none",
                onblur: function ( val, settings ) {
                  $( 'form', this ).submit();
                },
                placeholder: ""
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


          if ( !_.isUndefined( options ) )
            el.editable( editableSubmitCallback, _.extend( defaults, options ) );
        }

        return el;
    },


    refreshFrozen: function () {
      var view  = this,
          tbody = this.frozenTable.find( "tbody" ),
          clz   = this.strings.odd;

      tbody.empty();

      var columnState = this.frozenColumns;

      _.each( view.getDataAsJson(), function ( it ) {
        var tr = $( view.elements.tr );

        tr.attr( "data-id", it.id );
        tr.addClass ( clz );

        clz = ( clz == view.strings.odd ? view.strings.even : view.strings.odd );

        _.each( columnState, function ( col ) {
          if ( _.isBoolean( col.visible ) && !col.visible )
            return;

          var piece,
              td = $( view.elements.td );

          if ( _.isFunction( col.render ) )
            td.append( col.render.call( this, it ) );
          else {
            td.text( it[ col.name ] || view.defaults.display );
          }

          td.attr( "data-id", it.id );
          td.attr( "data-property", col.name );

          if ( col.width )
            td.css( "width", col.width );

          tr.append( td );
        });

        tbody.append( tr );
      });
    },

    redraw: function () {
      this.log( "executing redraw" );

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
      });

      return cols;
    },

    generateTable: function () {
      var view = this;

      this.table = $( this.elements.table ).addClass( this.css.grid + " " + this.css.uiWidgetContent );

      if ( this.features.resizable )
        this.table.addClass( this.css.resizable );

      if ( this.features.draggable )
        this.table.addClass( this.css.draggable );

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

    generateHead: function () {
      var view  = this,
          thead = $( this.elements.thead ),
          tr    = $( this.elements.tr );

      _.each( this.columns, function ( it ) {
        if ( _.isBoolean( it.visible ) && !it.visible )
          return;

        var th          = $( view.elements.th ),
            title       = $( view.elements.span ).addClass( view.css.title ).text( it.title ),
            sortClasses = view.css.sortIcon + " "+ view.css.uiIcon + " " + view.columnSortIcon( it ),
            sortIcon    = $( view.elements.span ).addClass( sortClasses );

        th.append( title );

        if ( _.isBoolean( it.sortable ) && !it.sortable ) {
          th.attr( "data-sort-direction", "disabled" );
          th.addClass( view.css.sortDisabled );
        }
        else {
          th.append( sortIcon );
          th.attr( "data-sort-direction", ( it.name == view.collection.sortColumn ) ? view.collection.sortDirection : view.strings.none );
        }

        th.addClass( _.string.dasherize( it.name ) + "-col" + " " + view.css.uiStateDefault );
        th.attr( "data-property", it.name );

        if ( it.width )
          th.css( "width", it.width );

        tr.append( th );
      });

      thead.append ( tr );
      view.table.append ( thead );
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
        this.menuContainer = gridWrapper.find( "thead tr" );
      }

      gridWrapper.after(  $( this.elements.div ).addClass( this.css.bottom + " " + this.css.uiWidgetHeader ) );

      if ( this.features.visibility ) {
        this.$el.append( $( this.elements.div ).addClass( this.css.columnVisibilityMenu ) );
      }

      if ( this.collection.paginate )
        this.generatePagingControls();
    },

    updateRecordCount: function () {
      this.$el.find( "." + this.css.recordsInfo ).remove();

      var records = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.recordsInfo).text( this.strings.recordsFound + this.strings.labelSeperator + this.collection.totalCount );

      this.$el.find( "." + this.css.bottom ).append( records );
    },

    generatePagingControls: function () {
      $( "." + this.css.pagingContainer ).remove();

      var paging = $( this.elements.div ).addClass( this.css.pagingContainer );

      this.$el.find( "." + this.css.bottom ).append( paging );

      var pagingControls = new Backbone.PagingControls({
        el:          paging,
        collection:  this.collection,
        pageLengths: this.pageLengths
      }).render();
    },

    generateFrozenTable: function () {
      var frozenTableWrapper = $( this.elements.div ).addClass( this.css.gridFrozenWrapper );

      this.frozenTable = $( this.elements.table ).addClass( this.css.grid + " " + this.css.gridFrozen + " " + this.css.uiWidgetContent );

      this.$el.find( "." + this.css.gridMainWrapper ).before( frozenTableWrapper.append( this.frozenTable ) );

      this.generateFrozenHead();
      this.generateFrozenBody();
    },

    generateFrozenHead: function () {
      var view  = this,
          thead = $( this.elements.thead ),
          tr    = $( this.elements.tr );

      _.each( this.frozenColumns, function ( it ) {
        if ( _.isBoolean( it.visible ) && !it.visible )
          return;

        var th          = $( view.elements.th ),
            title       = $( view.elements.span ).addClass( view.css.title ).text( it.title ),
            sortClasses = view.css.sortIcon + " "+ view.css.uiIcon + " " + view.columnSortIcon( it ),
            sortIcon    = $( view.elements.span ).addClass( sortClasses );

        th.append( title );

        if ( _.isBoolean( it.sortable ) && !it.sortable ) {
          th.attr( "data-sort-direction", "disabled" );
          th.addClass( view.css.sortDisabled );
        }
        else {
          th.append( sortIcon );
          th.attr( "data-sort-direction", ( it.name == view.collection.sortColumn ) ? view.collection.sortDirection : view.strings.none );
        }

        th.addClass( _.string.dasherize( it.name ) + "-col" + " " + view.css.uiStateDefault );
        th.attr( "data-property", it.name );

        if ( it.width )
          th.css( "width", it.width );

        tr.append( th );
      });

      thead.append ( tr );
      view.frozenTable.append ( thead );
    },


    generateFrozenBody: function () {
      this.frozenTable.append( $( this.elements.tbody ) );
    },


    getModelFromNotification: function( notification ) {
      var m = notification.get( "model" );
      if( _.isNull( m ) || _.isUndefined( m ) || _.isUndefined( m.id ) )
        return false;

      var model = this.collection.find( function( it ) {
        return it.get( "id" ) === m.id;
      });

      return ( _.isNull( model ) ? false : model );
    },


    getStyleForNotificationType: function( notification ) {
        var types = { success: this.css.notificationSuccess, warning: this.css.notificationWarning },
            clz   = types[ notification.get( "type" ) ] || this.css.notificationError;

        return clz;
    },


    notificationAdded: function( notification ) {
      var model = this.getModelFromNotification( notification );

      if ( model )
        this.$el.find( "tr[data-id=" + model.get( "id" ) + "]" ).stop( true, true ).addClass( this.getStyleForNotificationType( notification ) );
    },


    notificationRemoved: function( notification ) {
      var model = this.getModelFromNotification( notification );

      if ( model )
        this.$el.find( "tr[data-id=" + model.get( "id" ) + "]" ).removeClass( this.getStyleForNotificationType( notification ), 1000 );
    }
  });
}).call (this, $, _, Backbone, JSON, AjaxManager );

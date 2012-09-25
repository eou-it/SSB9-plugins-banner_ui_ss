/*
var column = {
  name:     "String",
  title:    "String",
  width:    "Percentage",
  editable: "Boolean",
  render:   "Function" // not implemented
}

var data = {
  "success":     "Boolean",
  "totalCount":  "Number",
  "data":        [ { JSON }, ... ],
  "pageOffset":  "Number",
  "pageMaxSize": "Number"
};
*/

(function ( $, _, Backbone ) {
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

  Backbone.Grid = Backbone.View.extend({
    columns:     [],
    data:        [],
    title:       null,
    keyTable:    null,
    pageLengths: [5, 50, 250, 500],

    defaults: {
      display:     "",
      id:          "id",
      columns:     [],
      data:        [],
      title:       null,
      keyTable:    null,
      pageLengths: [5, 50, 250, 500],
    },

    css: {
      grid:                   "grid",
      gridContainer:          "grid-container",
      selected:               "selected",
      hover:                  "hover",
      header:                 "header",
      bottom:                 "bottom",
      columnVisibilityMenu:   "column-visibility-menu",
      title:                  "title",
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
      uiIcon:                 "ui-icon",
      uiIconNorthSouth:       "ui-icon-carat-2-n-s",
      uiIconNorth:            "ui-icon-triangle-1-n",
      uiIconSouth:            "ui-icon-triangle-1-s",
      notificationSuccess:    "notification-success",
      notificationWarning:    "notification-warning",
      notificationError:      "notification-error",
      pagingText:            "paging-text" // TODO: remove -> Backbone.PagingControls
    },

    elements: {
      table:  "<table></table>",
      thead:  "<thead></thead>",
      tbody:  "<tbody></tbody>",
      tr:     "<tr></tr>",
      th:     "<th></th>",
      td:     "<td></td>",
      div:    "<div></div>",
      span:   "<span></span>",
      anchor: "<a href='#'></a>",
      select: "<select></select>",
      option: "<option></option>",
      ul:       "<ul></ul>",
      li:       "<li></li",
      label:    "<label></label",
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
      resizable: true,
      draggable: true
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
      var result = {
        success: true,
        errors:  []
      };

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
          errors.push( this.strings.errorColumnNameBlank );

        if ( !c.title )
          errors.push( this.strings.errorColumnTitleUndefined );

        if ( !c.width
         || (!_.string.endsWith( c.width, "%"  )
          && !_.string.endsWith( c.width, "em" )
          && !_.string.endsWith( c.width, "px" ) ) )
          errors.push( this.strings.errorColumnWidth );

        if ( !_.isUndefined( c.editable )
         && ( _.isNull( c.editable )
          || !_.isBoolean( c.editable ) ) )
          errors.push( this.strings.errorColumnEditableProperty );

        if ( !_.isUndefined( c.render ) && !_.isFunction( c.render ) )
          errors.push( this.strings.errorColumnRenderFunction );

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

    initialize: function () {
      _.bindAll( this, 'notificationAdded', 'notificationRemoved' );

      this.$el.addClass( this.css.gridContainer );

      var view  = this,
          valid = this.validateOptions(),
          savedState = this.retrieveState();

      if ( !valid.success ) {
        _.each( valid.errors, function ( err ) { view.log( err ); });
      }

      this.columns = !_.isNull( savedState ) && _.isObject( savedState ) ? savedState : this.options.columns;
      this.title   = this.options.title;

      this.collection.bind( "reset", function () {
        view.refresh();
      });

      if ( _.isNull( this.collection.sortColumn ) ) {
        var column = _.first(this.options.columns);
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

    render: function () {
      this.generateTable();
      this.generateWrapper();

      this.setupKeyTable();

      dragtable.init();
      window.ResizableColumns( this.table );
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

    toggleColumnVisibility: function ( name ) {
        var column = _.find( this.columns, function ( it ) { return it.name == name; } );

        column.visible = column.visible ? false : true;

        this.refresh( true );
    },

    refresh: function ( fullRefresh ) {
      fullRefresh = ( _.isBoolean( fullRefresh ) ? fullRefresh : false );

      this.log( "executing " + ( fullRefresh ? "full " : "" ) + "refresh" );

      if ( fullRefresh ) {
        this.$el.find( "table" ).empty();

        this.generateHead();
        this.generateBody();

        dragtable.init();
        window.ResizableColumns( this.table );
      }

      var view  = this,
          tbody = this.$el.find( "tbody" ),
          clz   = this.strings.odd;

      tbody.empty();

      var columnState = view.getColumnState();

      _.each( view.getDataAsJson(), function (it) {
        var tr = $( view.elements.tr );

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
            td.text( it[col.name] || view.defaults.display );
          }

          td.attr( "data-id", it.id );
          td.attr( "data-property", col.name );

          if ( col.width )
            td.css( "width", col.width );

          var editableSubmitCallback = function ( value, settings ) {
              return view.updateData.call( view, $( this ).attr( "data-id" ), $( this ).attr( "data-property" ), value );
          };

          if ( col.editable && _.isFunction( td.editable ) )
            td.editable( editableSubmitCallback, {
                onblur: function ( val, settings ) {
                  $( 'form', this ).submit();
              },
              placeholder: ""
            });

          tr.append( td );
        });

        tbody.append( tr );
      });

      this.setSortDirectionVisual();
      this.updateRecordCount();

      this.setupKeyTable();
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
        return view.$el.find( "th[data-property=" + it.name + "]" ).index();
      });

      var cols = _.map ( currentOrder, function ( it ) {
        var th = view.$el.find( "th[data-property=" + it.name + "]" );

        return _.extend( _.clone( it ), {
          width: percentageOfParent( $( th ).outerWidth( true ) )
        });
      });

      if ( cols.length == 0 )
        return [ ];

      var totalCalcWidth = _.reduce( cols, function( one, two ){
        one = _.isObject( one ) ? one.width : one;
        return one + two.width;
      });

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
      this.table = $( this.elements.table ).addClass( this.css.grid + " " + this.css.uiWidgetContent );

      if ( this.features.resizable )
        this.table.addClass( this.css.resizable );

      if ( this.features.draggable )
        this.table.addClass( this.css.draggable );

      this.$el.append( this.table );

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

        var th       = $( view.elements.th ),
            title    = $( view.elements.span ).addClass( view.css.title ).text( it.title ),
            sortIcon = $( view.elements.span ).addClass( view.css.sortIcon + " "+ view.css.uiIcon );

        sortIcon.addClass( view.columnSortIcon( it ) );

        th.append( title );
        th.append( sortIcon );

        th.addClass( _.string.dasherize( it.name ) + "-col" + " " + view.css.uiStateDefault );
        th.attr( "data-property", it.name );
        th.attr( "data-sort-direction", ( it.name == view.collection.sortColumn ) ? view.collection.sortDirection : view.strings.none );

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

      this.table.before( $( this.elements.div ).addClass( this.css.header + " " + this.css.uiWidgetHeader + " " + this.css.contentContainerHeader )
                                               .append( $( this.elements.span ).addClass( this.css.title ).text( this.title ) ) );

      this.table.after(  $( this.elements.div ).addClass( this.css.bottom + " " + this.css.uiWidgetHeader ) );

      this.$el.append( $( this.elements.div ).addClass( this.css.columnVisibilityMenu ) );

      this.generatePagingControls();
    },

    updateRecordCount: function () {
      $( "." + this.css.recordsInfo ).remove();

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

          paging  = $( this.elements.div ).addClass( this.css.pagingContainer );

      var pagingControls =new Backbone.PagingControls({
        el:          paging,
        collection:  this.collection,
        pageLengths: this.pageLengths
      }).render();
    },

    notificationAdded: function( notification ) {
      if ( !notification.get( "model" ) )
        return;

      var model = this.collection.find( function( it ) {
        if ( _.isUndefined( notification.get( "model" ) ) )
          return false;

        return it.get( "id" ) === notification.get( "model" ).id;
      });

      if ( model ) {
        var types = { success: this.css.notificationSuccess, warning: this.css.notificationWarning },
            clz   = types[ notification.get( "type" ) ] || this.css.notificationError;

        this.$el.find( "tr[data-id=" + model.get( "id" ) + "]" ).stop( true, true ).addClass( clz );
      }
    },

    notificationRemoved: function( notification ) {
      var model = this.collection.find( function( it ) {
        if ( _.isUndefined( notification.get( "model" ) ) )
          return false;

        return it.get( "id" ) === notification.get( "model" ).id;
      });

      if (model) {
        var types = { success: this.css.notificationSuccess, warning: this.css.notificationWarning },
            clz   = types[ notification.get( "type" ) ] || this.css.notificationError;


        this.$el.find( "tr[data-id=" + model.get( "id" ) + "]" ).removeClass( clz, 1000 );
      }
    }
  });
}).call (this, $, _, Backbone);

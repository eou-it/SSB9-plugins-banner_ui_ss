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

  Backbone.ButtonMenu = Backbone.View.extend({
    name: "",
    items: [ ],
    callback: null,
    css: {
      buttonMenuItemCheckbox: "button-menu-item-checkbox",
      buttonMenuIcon:         "button-menu-icon",
      buttonMenuButton:       "button-menu-button",
      buttonMenuContainer:    "button-menu-container",
      buttonMenuOverlay:      "button-menu-overlay"
    },
    elements: {
      div:      "<div></div",
      ul:       "<ul></ul>",
      li:       "<li></li",
      label:    "<label></label",
      checkbox: "<input type='checkbox'/>",
      button:   "<button></button>"
    },
    events: {
      "click .button-menu-item-checkbox": "toggleItem",
      "click .button-menu-button":        "toggleMenu"
    },
    strings: {
      buttonLabel:  "Columns",
      itemIdPrefix: "menuItemId"
    },
    toggleMenu: function ( e ) {
      var view = this;

      if ( $( "." + this.css.buttonMenuContainer ).is( ":visible" ) ) {
        $( "." + this.css.buttonMenuOverlay ).unbind( "click" ).remove();
      } else {
        var overlay = $( this.elements.div ).addClass( this.css.buttonMenuOverlay )
                                            .height( $( document ).height() )
                                            .click( function ( e ) { view.toggleMenu(); } );
        $( "body" ).append( overlay );
      }

      if ( $( "." + this.css.buttonMenuContainer ).is( ":visible" ) ) {
        this.removeMenu();
      } else {
        this.renderMenu();
      }
    },
    toggleItem: function ( e ) {
      if ( _.isFunction( this.callback ) )
        this.callback.call( this, e );
    },
    initialize: function () {
      this.items    = this.options.items    || [ ];
      this.callback = this.options.callback || null;
    },

    removeMenu: function () {
      $( "." + this.css.buttonMenuContainer + " input[type=checkbox]" ).unbind( "click" );
      $( "." + this.css.buttonMenuContainer ).remove();
    },

    renderMenu: function () {
      var view = this,
          ul   = $( this.elements.ul );

      _.each( this.items, function ( it, idx ) {
        var label = $( view.elements.label ),
            input = $( view.elements.checkbox ).addClass( view.css.buttonMenuItemCheckbox ),
            li    = $( view.elements.li ),
            id    = _.string.camelize( view.strings.itemIdPrefix + view.name + idx );

        if ( it.checked )
          input.attr( "checked", "checked" );

        if ( !_.isUndefined( it.name ) )
          input.attr( "data-id", it.id );

        if ( !_.isUndefined( it.name ) )
          input.attr( "data-name", it.name );

        input.click( function ( e ) {
          view.toggleItem.call( view, e );
        });

        input.attr( "id", id );
        label.attr( "for", id ).text( it.title );

        li.append( input ).append( label );
        ul.append( li );
      });

      $( "body" ).append( $( this.elements.div ).addClass( this.css.buttonMenuContainer ).append( ul ) );

      $( "." + this.css.buttonMenuContainer ).position({
        of: $( "." + this.css.buttonMenuButton ),
        my: "right top",
        at: "right bottom"
      });
    },

    render: function () {
      this.$el.append( $( this.elements.button ).text( this.strings.buttonLabel ).addClass( this.css.buttonMenuButton ) );
    }
  });


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
      selected:               "selected",
      hover:                  "hover",
      header:                 "header",
      bottom:                 "bottom",
      columnVisibilityMenu:   "column-visibility-menu",
      pageSizeSelect:         "page-size-select",
      pageSizeSelectWrapper:  "page-size-select-wrapper",
      title:                  "title",
      pagingControl:          "paging-control",
      pagingContainer:        "paging-container",
      pagingText:             "paging-text",
      first:                  "first",
      last:                   "last",
      previous:               "previous",
      next:                   "next",
      pageNumber:             "page-number",
      bottomDivider:          "bottom-divider",
      totalPages:             "total-pages",
      page:                   "page",
      pageOf:                 "page-of",
      pagePer:                "page-per",
      totalRecords:           "total-records",
      recordsInfo:            "records-info",
      enabled:                "enabled",
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
      notificationError:      "notification-error"
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
      text:   "<input type='text'></input>",
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
      page:                        "Page",
      of:                          "of",
      pageOfOne:                   "1 of",
      perPage:                     "Per Page",
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
      "change .page-size-select":               "selectPageSize",
      "click .paging-control.first.enabled":    "gotoFirstPage",
      "click .paging-control.last.enabled":     "gotoLastPage",
      "click .paging-control.previous.enabled": "gotoPreviousPage",
      "click .paging-control.next.enabled":     "gotoNextPage",
      "change .page-number.enabled":            "gotoSpecificPage",
      "click th":                               "sort",
      "click span.sort-icon":                   "sort",
      "click span.span.title":                  "sort"
    },
    selectPageSize: function (e) {
      var val = parseInt( $( e.target ).find( "option:eq(" + e.target.selectedIndex + ")" ).val() );

      this.log( "new page size selected: " + val  );

      this.collection.setPageSize( val );
    },
    selectCell: function (e) {
      var td = $(e.target),
          tr = td.closest ( "tr" );

      this.$el.find( "." + this.css.selected ).removeClass( this.css.selected );
      tr.addClass( this.css.selected );
      td.addClass( this.css.selected );
    },
    gotoFirstPage:    function (e) {
      this.log( "requested first page" );

      this.collection.firstPage();
    },
    gotoLastPage:     function (e) {
      this.log( "requested last page" );

      this.collection.lastPage();
    },
    gotoPreviousPage: function (e) {
      this.log( "requested previous page" );

      this.collection.previousPage();
    },
    gotoNextPage:     function (e) {
      this.log( "requested next page" );

      this.collection.nextPage();
    },
    gotoSpecificPage: function (e) {
      var num = $( e.target ).val();
      this.log( "requested specific page: " + num );

      this.collection.goToPage( num );
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

      _.each( view.getDataAsJson(), function (it) {
        var tr = $( view.elements.tr );

        tr.attr( "data-id", it.id );
        tr.addClass ( clz );

        clz = ( clz == view.strings.odd ? view.strings.even : view.strings.odd );

        _.each( view.getColumnState(), function (col) {
          if ( _.isBoolean( col.visible ) && !col.visible )
            return;

          // todo: it would be cool to try and invoke a callback here, if defined on the column def
          var piece = it[col.name] || view.defaults.display,
              td    = $( view.elements.td ).text( piece );

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
      this.generatePagingControls();

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

      var cols = _.map ( this.columns, function ( it ) {
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

    generatePagingControls: function () {
      if ( this.$el.find( "." + this.css.bottom ).length > 0 )
        this.$el.find( "." + this.css.bottom ).empty();

      var records = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.recordsInfo).text( this.strings.recordsFound + this.strings.labelSeperator + this.collection.totalCount ),
          paging  = $( this.elements.div ).addClass( this.css.pagingContainer );

      new Backbone.PagingControls({
        el:          paging,
        collection:  this.collection,
        pageLengths: this.pageLengths
      }).render();

      this.$el.find( "." + this.css.bottom ).append( paging )
                                            .append( records );
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

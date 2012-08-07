
(function ( $, _, Backbone ) {
  Backbone.PagingControls = Backbone.View.extend({
    pageLengths: [5, 50, 250, 500],
    initialize: function () {
      var view = this;

      this.collection.bind( "reset", function ( models ) {
        view.render();
      });
    },
    events: {
      "change .page-size-select":               "selectPageSize",
      "click .paging-control.first.enabled":    "gotoFirstPage",
      "click .paging-control.last.enabled":     "gotoLastPage",
      "click .paging-control.previous.enabled": "gotoPreviousPage",
      "click .paging-control.next.enabled":     "gotoNextPage",
      "change .page-number.enabled":            "gotoSpecificPage"
    },
    css: {
      pagingContainer: "paging-container",
      enabled:         "enabled",
      pageSizeSelect:  "page-size-select",
      pagingControl:   "paging-control",
      pagingText:      "paging-text",
      first:           "first",
      last:            "last",
      previous:        "previous",
      next:            "next",
      pageNumber:      "page-number",
      divider:         "divider",
      totalPages:      "total-pages",
      page:            "page",
      pageOf:          "page-of",
      pagePer:         "page-per"
    },
    elements: {
      div:    "<div></div>",
      span:   "<span></span>",
      text:   "<input type='text'></input>",
      select: "<select></select>",
      option: "<option></option>"
    },
    strings: {
      page:                        "Page",
      of:                          "of",
      pageOfOne:                   "1 of",
      perPage:                     "Per Page"
    },

    log: function ( msg ) {
      if ( _.isBoolean( window.debug ) && window.debug == true )
        console.log( "backbone.pagingcontrols: " + msg );
    },

    selectPageSize: function (e) {
      var val = parseInt( $( e.target ).find( "option:eq(" + e.target.selectedIndex + ")" ).val() );

      this.log( "new page size selected: " + val  );

      this.collection.setPageSize( val );
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
    render: function () {
      this.$el.empty();

      var view     = this,
          pageInfo = this.collection.pageInfo(),
          first    = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.first ), //.text( "First" ),
          last     = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.last ), //.text( "Last" ),
          next     = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.next ), //.text( "Next" ),
          prev     = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.previous ), //.text( "Previous" ),
          page     = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.page ).text( this.strings.page ),
          of       = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.pageOf ).text( pageInfo.pages == 1 ? this.strings.pageOfOne : this.strings.of ),
          pages    = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.totalPages ).text( pageInfo.pages ),
          input    = $( this.elements.text ).addClass( this.css.pageNumber ).val( pageInfo.page ),
          divider  = $( this.elements.div ).addClass( this.css.divider ),
          perPage  = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.pagePer ).text( this.strings.perPage ),
          select   = $( this.elements.select ).addClass( this.css.pageSizeSelect );

      _.each( this.pageLengths, function (it) {
        var option = $( view.elements.option ).val( it ).text( it );

        if ( it == pageInfo.pageMaxSize )
          option.attr( "selected", "selected" );

        select.append( option );
      });

      var pagingContainer = $( this.elements.div ).addClass( this.css.pagingContainer ),
          countContainer  = $( this.elements.div ).addClass( this.css.pagingContainer );

      if ( pageInfo.pages == 1 ) {
          input.hide();
      } else {
          input.show();

          if (pageInfo.page == 1) {
              _.each( [ next, last ], function (it) { it.addClass("enabled"); } );
          } else if (pageInfo.page == pageInfo.pages) {
              _.each( [ first, prev ], function (it) { it.addClass("enabled"); } );
          } else {
              _.each( [ first, last, prev, next, input ], function (it) { it.addClass( view.css.enabled ) });
          }
      }

      _.each( [ first, prev, page, input, of, pages, next, last, divider, perPage, select ], function (it) {
        pagingContainer.append( it );
      });

      this.$el.append( pagingContainer );
    }
  });
}).call (this, $, _, Backbone);

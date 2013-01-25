/** *******************************************************************************
 Copyright 2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is limited
 solely to SunGard Higher Education licensees, and is further subject to the terms
 and conditions of one or more written license agreements between SunGard Higher
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 ********************************************************************************* */

(function ( $, _, Backbone ) {
  Backbone.PagingControls = Backbone.View.extend({
    pageLengths: [5, 50, 250, 500],

    defaults: {
      pageLengths: [5, 50, 250, 500]
    },

    initialize: function () {
      var view = this;

      if ( _.isArray( this.options.pageLengths ) ) {
        var validPageLengths = _.all( this.options.pageLengths, function ( it ) {
          return _.isNumber( it ) && it > 0;
        });

        if ( validPageLengths )
          this.pageLengths = this.options.pageLengths;
      }

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
      pagingContainer:       "paging-container",
      enabled:               "enabled",
      pageSizeSelect:        "page-size-select",
      pageSizeSelectWrapper: "page-size-select-wrapper",
      pagingControl:         "paging-control",
      pagingText:            "paging-text",
      first:                 "first",
      last:                  "last",
      previous:              "previous",
      next:                  "next",
      pageNumber:            "page-number",
      divider:               "divider",
      totalPages:            "total-pages",
      page:                  "page",
      pageOf:                "page-of",
      pagePer:               "page-per"
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
      var num = parseInt( $( e.target ).val() );
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
          select   = $( this.elements.select ).addClass( this.css.pageSizeSelect ),
          selWrap  = $( this.elements.div ).addClass( this.css.pageSizeSelectWrapper ).append( select );

      _.each( this.pageLengths, function (it) {
        var option = $( view.elements.option ).val( it ).text( it );

        if ( it == pageInfo.pageMaxSize )
          option.attr( "selected", "selected" );

        select.append( option );
      });

      this.$el.addClass( this.css.pagingContainer );

      if ( pageInfo.pages == 1 ) {
          input.hide();
      } else {
          input.show();

          var enabled = [input];
          if (pageInfo.page == 1) {
              enabled = enabled.concat( [ next, last ] );
          } else if (pageInfo.page == pageInfo.pages) {
              enabled = enabled.concat( [ first, prev ] );
          } else {
              enabled = enabled.concat( [ first, last, prev, next ] );
          }
          _.each( enabled, function (it) { it.addClass( view.css.enabled ) });
      }

      _.each( [ first, prev, page, input, of, pages, next, last, divider, perPage, selWrap ], function (it) {
        view.$el.append( it );
      });
    }
  });
}).call (this, $, _, Backbone);

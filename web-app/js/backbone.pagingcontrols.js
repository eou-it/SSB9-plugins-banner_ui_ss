/* Copyright 2013-2014 Ellucian Company L.P. and its affiliates. */

;(function ( $, _, Backbone ) {
    Backbone.PagingControls = Backbone.View.extend({
    pageLengths: [5, 50, 250, 500],
    dirtyCheck: null,

    defaults: {
      pageLengths: [5, 50, 250, 500]
    },

    initialize: function () {
      var view = this;
      this.dirtyCheck = this.options.dirtyCheck;
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
//    events: {
//      "change .page-size-select":               "selectPageSize",
//      "click .paging-control.first.enabled":    "gotoFirstPage",
//      "click .paging-control.last.enabled":     "gotoLastPage",
//      "click .paging-control.previous.enabled": "gotoPreviousPage",
//      "click .paging-control.next.enabled":     "gotoNextPage",
//      "change .page-number.enabled":            "gotoSpecificPage"
//    },
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
      button: "<button></button>",
      div:    "<div></div>",
      span:   "<span></span>",
      pageLabel:  "<div><label></label></div>",
      text:   "<input type='text' id='page1'></input>",
      sizeLabel:  "<label></label>",
      select: "<select id='size1'></select>",
      option: "<option></option>"
    },
    strings: {
      first:                       function() { return $.i18n.prop('backbone.paging.controls.first') },
      last:                        function() { return $.i18n.prop('backbone.paging.controls.last') },
      prev:                        function() { return $.i18n.prop('backbone.paging.controls.previous') },
      next:                        function() { return $.i18n.prop('backbone.paging.controls.next') },
      page:                        function() { return $.i18n.prop('backbone.paging.controls.page') },
      of:                          function() { return $.i18n.prop('backbone.paging.controls.of') },
      pageOfOne:                   function() { return $.i18n.prop('backbone.paging.controls.oneof') },
      perPage:                     function() { return $.i18n.prop('backbone.paging.controls.per.page') }
    },

    log: function ( msg ) {
      if ( _.isBoolean( window.debug ) && window.debug == true )
        console.log( "backbone.pagingcontrols: " + msg );
    },

    selectPageSize: function (e) {
      $(".grid-container").loading(false);
      var val = parseInt( $( e.target ).find( "option:eq(" + e.target.selectedIndex + ")" ).val() );

      this.log( "new page size selected: " + val  );

      this.collection.setPageSize( val );
    },
    gotoFirstPage:    function (e) {
      $(".grid-container").loading();
      this.log( "requested first page" );

      this.collection.firstPage();
    },
    gotoLastPage:     function (e) {
      $(".grid-container").loading();
      this.log( "requested last page" );

      this.collection.lastPage();
    },
    gotoPreviousPage: function (e) {
      $(".grid-container").loading();
      this.log( "requested previous page" );

      this.collection.previousPage();
    },
    gotoNextPage:     function (e) {
      $(".grid-container").loading();
      this.log( "requested next page" );
      this.collection.nextPage();
    },
    gotoSpecificPage: function (e) {
      $(".grid-container").loading();
      var num = parseInt( $( e.target ).val() );
      this.log( "requested specific page: " + num );

      this.collection.goToPage( num );
    },
    render: function () {
      this.$el.empty();
      this.pageActions = [];
      var dir = $( "meta[name=dir]" ).attr( "content" );
      dir = ( dir === void 0 || dir === "ltr" ? "ltr" : "rtl" );

      var view     = this,
          pageInfo = this.collection.pageInfo(),
          first    = $( this.elements.button ).attr('title',this.strings.first).addClass( this.css.pagingControl + " " + this.css.first + " " + dir ).attr('tabindex',-1),
          last     = $( this.elements.button ).attr('title',this.strings.last).addClass( this.css.pagingControl + " " + this.css.last + " " + dir ).attr('tabindex',-1),
          next     = $( this.elements.button ).attr('title',this.strings.next).addClass( this.css.pagingControl + " " + this.css.next + " " + dir ).attr('tabindex',-1),
          prev     = $( this.elements.button ).attr('title',this.strings.prev).addClass( this.css.pagingControl + " " + this.css.previous + " " + dir ).attr('tabindex',-1),
          page     = $( this.elements.pageLabel ).addClass( this.css.pagingText + " " + this.css.page ).text( this.strings.page ),
          input    = $( this.elements.text ).addClass( this.css.pageNumber ).val( pageInfo.page ).attr('tabindex',0),
          of       = $( this.elements.span ).attr('id','of-n-pages').addClass( this.css.pagingText + " " + this.css.pageOf ).text( pageInfo.pages == 1 ? this.strings.pageOfOne : this.strings.of ),
          pages    = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.totalPages ).text( pageInfo.pages ),
          divider  = $( this.elements.div ).addClass( this.css.divider ),
          perPage  = $( this.elements.sizeLabel ).addClass( this.css.pagingText + " " + this.css.pagePer ).text( this.strings.perPage ),
          select   = $( this.elements.select ).addClass( this.css.pageSizeSelect ).attr('tabindex',0),
          selWrap  = $( this.elements.div ).addClass( this.css.pageSizeSelectWrapper ).append( select );

      first.screenReaderLabel( this.strings.first );
      last.screenReaderLabel( this.strings.last );
      next.screenReaderLabel( this.strings.next );
      prev.screenReaderLabel( this.strings.prev );
      input.screenReaderLabel( $.i18n.prop('backbone.paging.controls.page.of.pages', [pageInfo.page, pageInfo.pages]));

      _.each( this.pageLengths, function (it) {
        var option = $( view.elements.option ).val( it ).text( it );

        if ( it == pageInfo.pageMaxSize ) {
            option.attr( "selected", "selected" );
            select.screenReaderLabel( $.i18n.prop('backbone.paging.controls.count.per.page', [it]));
        }

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
          _.each( enabled, function (it) { it.addClass( view.css.enabled ).attr('tabindex',0) });
      }

	_.each( [ first, prev, page, input, of, pages, next, last, divider, perPage, selWrap], function (it) {
        view.$el.append( it );
      });

        first.onclick = function(e){
            view.gotoFirstPage(e);
        }
        prev.onclick = function(e){
            view.gotoPreviousPage(e);
        }
        next.onclick = function(e){
            view.gotoNextPage(e);
        }
        last.onclick = function(e){
            view.gotoLastPage(e);
        }
        input.onchange = function(e){
            view.gotoSpecificPage(e);
        }
        selWrap.onchange = function(e){
            view.selectPageSize(e);
        }

        first.dirtyCheck(this.dirtyCheck);
        next.dirtyCheck(this.dirtyCheck);
        prev.dirtyCheck(this.dirtyCheck);
        last.dirtyCheck(this.dirtyCheck);
        input.dirtyCheck(this.dirtyCheck);
        selWrap.dirtyCheck(this.dirtyCheck);

      view.pageActions.push(first, prev, input, next, last, selWrap);
    },
    getPagesActions: function(){
        return this.pageActions;
    }
  });
}).call (this, $, _, Backbone);

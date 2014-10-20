/* Copyright 2013 Ellucian Company L.P. and its affiliates. */

;(function ( $, _, Backbone ) {
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
      pageLabelWrapper:      "page-label-wrapper",
      perPageLabelWrap:      "per-page-label-wrapper",
      pageSizeSelect:        "page-size-select",
      pageSizeSelectWrapper: "page-size-select-wrapper",
      pagingControl:         "paging-control",
      pagingText:            "paging-text",
      first:                 "first",
      last:                  "last",
      previous:              "previous",
      next:                  "next",
      pageNumber:            "page-number",
      pageLabel:             "page-label",
      divider:               "divider",
      totalPages:            "total-pages",
      page:                  "page",
      pageOf:                "page-of",
      pagePer:               "page-per",
      offscreen:             "offscreen"
    },
    elements: {
      div:    "<div></div>",
      span:   "<span></span>",
      text:"<input type='text'></input>",
      select:"<select></select>",
      option:"<option></option>",
      label:"<label></label>"
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


      var view     = this,
          pageInfo = this.collection.pageInfo(),
          first    = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.first + " " ).attr('title',this.strings.first).attr('role','button'),
          last     = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.last + " " ).attr('title',this.strings.last).attr('role','button'),
          next     = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.next + " " ).attr('title',this.strings.next).attr('role','button'),
          prev     = $( this.elements.div ).addClass( this.css.pagingControl + " " + this.css.previous + " " ).attr('title',this.strings.prev).attr('role','button'),
          page     = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.page ).text( this.strings.page ),
          of       = $( this.elements.span ).attr('id','of-n-pages').addClass( this.css.pagingText + " " + this.css.pageOf ).text( pageInfo.pages == 1 ? this.strings.pageOfOne : this.strings.of ),
          pages    = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.totalPages ).text( pageInfo.pages ),
          input    = $(this.elements.text).addClass(this.css.pageNumber).val(pageInfo.page).attr('tabindex',0).attr('aria-label', $.i18n.prop('backbone.paging.controls.page.of.pages',[pageInfo.page, pageInfo.pages])),
          pageLabel = $(this.elements.label).addClass(this.css.pagingText + " " + this.css.pageLabel  + " " ).text(this.strings.page).append(input),
          pageLabelWrap = $(this.elements.div).addClass(this.css.pageLabelWrapper).append(pageLabel),
          divider  = $( this.elements.div ).addClass( this.css.divider ),
          perPage  = $( this.elements.span ).addClass( this.css.pagingText + " " + this.css.pagePer ).text( this.strings.perPage ),
          select   = $( this.elements.select ).addClass( this.css.pageSizeSelect ).attr('tabindex',0).attr('id','comboSelect'),
          selectLabel = $(this.elements.label).addClass(this.css.offscreen + " " + dir).attr('for','comboSelect'),
          selWrap  = $( this.elements.div ).addClass( this.css.pageSizeSelectWrapper ).append(selectLabel).append(select);


      _.each( this.pageLengths, function (it) {
        var option = $( view.elements.option ).val( it ).text( it );

        if ( it == pageInfo.pageMaxSize ) {
            option.attr("selected", "selected");
            selectLabel.text($.i18n.prop('backbone.paging.controls.count.per.page',[it]));
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
                    enabled = enabled.concat([ next, last ]);
                } else if (pageInfo.page == pageInfo.pages) {
                    enabled = enabled.concat([ first, prev ]);
                } else {
                    enabled = enabled.concat([ first, last, prev, next ]);
                }
                _.each(enabled, function (it) {
                    it.addClass(view.css.enabled);
                    it.attr('tabIndex',0);
                });
            }

            _.each([ first, prev, pageLabelWrap, of, pages, next, last, divider, perPage, selWrap ], function (it) {
                view.$el.append(it);
            });
        }
    });
}).call(this, $, _, Backbone);

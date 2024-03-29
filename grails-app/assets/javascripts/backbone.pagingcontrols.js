/* Copyright 2013-2021 Ellucian Company L.P. and its affiliates. */

;(function ( $, _, Backbone ) {
    Backbone.PagingControls = Backbone.View.extend({
    pageLengths: [5, 50, 250, 500],
    dirtyCheckDefault: null,


    defaults: {
      pageLengths: [5, 50, 250, 500]
    },

    initialize: function () {
      var view = this;
      this.dirtyCheckDefault = this.options.dirtyCheckDefault;
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
      text:   "<input type='text'></input>",
      sizeLabel:  "<label></label>",
      select: "<select ></select>",
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

      var success = this.collection.goToPage( num );

      if (success === false) {
          $(".grid-container").loading(false)
      }
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
          input    = $( this.elements.text ).addClass( this.css.pageNumber ).val( pageInfo.page ).attr('tabindex',0).attr('title',this.strings.page).attr('aria-label',this.strings.page),
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
            select.attr("aria-label", $.i18n.prop('backbone.paging.controls.count.per.page', [it]));
        }

        select.append( option );
      });

      this.$el.addClass( this.css.pagingContainer );

      if ( pageInfo.pages == 1 ) {
          input.hide();
          this.disableComponents([ first, last, prev, next ]);
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

          var buttonsToDisable = _.difference([ first, last, prev, next ], enabled);
          this.disableComponents(buttonsToDisable);
      }

	_.each( [ first, prev, page, input, of, pages, next, last, divider, perPage, selWrap], function (it) {
        view.$el.append( it );
      });

        first.on("click",function (e) {
            view.gotoFirstPage(e);
        });
        next.on("click",function (e) {
            view.gotoNextPage(e);
        });
        prev.on("click",function (e) {
            view.gotoPreviousPage(e);
        });
        last.on("click",function (e) {
            view.gotoLastPage(e);
        });

        function resetPageNumberInput() {
            var target = input;
            if (target.data().initial) {
                target.val(target.data().initial);
            }
            return;
        }

        input.on("change", function(e) {
            if (typeof(view.collection) != 'undefined') {
                var target = $(input);
                $.data(input, 'entered', $(input).val());
                var userEnteredPage = $(input).val()

                if (userEnteredPage == "" || userEnteredPage.match(/[^0-9]/)) {
                    resetPageNumberInput();
                    return;
                }

                var page = parseInt(target.val(), 10);
                var collection = view.collection;
                var info = collection.pageInfo();

                if (page < 1 || page > info.pages) {
                    resetPageNumberInput();
                } else {
                    view.gotoSpecificPage(e);
                }
            }
            return;

        });

        input.on("keypress",function(e){
            if(e.keyCode == 13){
                $(input).trigger('blur');
                e.preventDefault();
                e.stopPropagation();
            }
        });
        input.focus(function(e) {
            $.data(this, 'initial', this.value);
        });

        input.dirtyCheck( _.defaults({
                eventType: "change",
                cancelCallback: resetPageNumberInput
            }, this.dirtyCheckDefault)
        );

        select.focus(function(e) {
            $.data( this, 'initial', this.value );
        });

        select.on("change",function (e) {
            view.selectPageSize(e);
        });

        function resetPageSize() {
            var target = select;
            if (target.data().initial) {
                target.val(target.data().initial);
            }
            return;
        }

        first.dirtyCheck(this.dirtyCheckDefault);
        next.dirtyCheck(this.dirtyCheckDefault);
        prev.dirtyCheck(this.dirtyCheckDefault);
        last.dirtyCheck(this.dirtyCheckDefault);
        select.dirtyCheck(_.defaults({eventType:"change",
            cancelCallback: resetPageSize},
            this.dirtyCheckDefault));
        view.pageActions.push(first, prev, input, next, last, select);
    },
    disableComponents: function (componentsToDisable) {
        _.each(componentsToDisable, function (it) {
            it.attr('disabled', 'disabled');
        });
    },
    getPagesActions: function(){
        return this.pageActions;
    }
  });
}).call (this, $, _, Backbone);

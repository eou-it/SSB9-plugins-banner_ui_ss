/* Copyright 2013-2014 Ellucian Company L.P. and its affiliates. */

;
(function ($, _, Backbone) {
    Backbone.PagingControls = Backbone.View.extend({
        pageLengths:[5, 50, 250, 500],

        defaults:{
            pageLengths:[5, 50, 250, 500]
        },

        initialize:function () {
            var view = this;

            if (_.isArray(this.options.pageLengths)) {
                var validPageLengths = _.all(this.options.pageLengths, function (it) {
                    return _.isNumber(it) && it > 0;
                });

                if (validPageLengths)
                    this.pageLengths = this.options.pageLengths;
            }

            this.collection.bind("reset", function (models) {
                view.render();
            });
        },
        events:{
            "change .page-size-select":"selectPageSize",
            "click .paging-control.first.enabled":"gotoFirstPage",
            "click .paging-control.last.enabled":"gotoLastPage",
            "click .paging-control.previous.enabled":"gotoPreviousPage",
            "click .paging-control.next.enabled":"gotoNextPage",
            "change .page-number.enabled":"gotoSpecificPage"
        },
        css:{
            pagingContainer:"paging-container",
            enabled:"enabled",
            pageLabelWrapper:"page-label-wrapper",
            pageSizeSelect:"page-size-select",
            pageSizeSelectWrapper:"page-size-select-wrapper",
            pagingControl:"paging-control",
            pagingText:"paging-text",
            first:"first",
            last:"last",
            previous:"previous",
            next:"next",
            pageNumber:"page-number",
            pageLabel:"page-label",
            divider:"divider",
            totalPages:"total-pages",
            pageOf:"page-of",
            pagePer:"page-per"
        },
        elements:{
            div:"<div></div>",
            span:"<span></span>",
            text:"<input type='text' />",
            select:"<select></select>",
            option:"<option></option>",
            label:"<label></label>"
        },

        log:function (msg) {
            if (_.isBoolean(window.debug) && window.debug == true)
                console.log("backbone.pagingcontrols: " + msg);
        },

        selectPageSize:function (e) {
            var val = parseInt($(e.target).find("option:eq(" + e.target.selectedIndex + ")").val());

            this.log("new page size selected: " + val);

            this.collection.setPageSize(val);
        },
        gotoFirstPage:function (e) {
            this.log("requested first page");

            this.collection.firstPage();
        },
        gotoLastPage:function (e) {
            this.log("requested last page");

            this.collection.lastPage();
        },
        gotoPreviousPage:function (e) {
            this.log("requested previous page");

            this.collection.previousPage();
        },
        gotoNextPage:function (e) {
            this.log("requested next page");

            this.collection.nextPage();
        },
        gotoSpecificPage:function (e) {
            var num = parseInt($(e.target).val());
            this.log("requested specific page: " + num);

            this.collection.goToPage(num);
        },
        render:function () {
            this.$el.empty();

            var dir = $("meta[name=dir]").attr("content");
            dir = ( dir === void 0 || dir === "ltr" ? "ltr" : "rtl" );

            var view = this,
                pageInfo = this.collection.pageInfo(),
                first = $(this.elements.div).addClass(this.css.pagingControl + " " + this.css.first + " " + dir).attr('tabIndex',0), //.text( "First" ),
                last = $(this.elements.div).addClass(this.css.pagingControl + " " + this.css.last + " " + dir).attr('tabIndex',0), //.text( "Last" ),
                next = $(this.elements.div).addClass(this.css.pagingControl + " " + this.css.next + " " + dir).attr('tabIndex',0), //.text( "Next" ),
                prev = $(this.elements.div).addClass(this.css.pagingControl + " " + this.css.previous + " " + dir).attr('tabIndex',0), //.text( "Previous" ),
                of = $(this.elements.span).addClass(this.css.pagingText + " " + this.css.pageOf).text(pageInfo.pages == 1 ? $.i18n.prop("js.net.hedtech.banner.pagingControls.firstPage.label") : $.i18n.prop("js.net.hedtech.banner.pagingControls.of.label")),
                pages = $(this.elements.span).addClass(this.css.pagingText + " " + this.css.totalPages).text(pageInfo.pages),
                input = $(this.elements.text).addClass(this.css.pageNumber).val(pageInfo.page),
                pageLabel = $(this.elements.label).addClass(this.css.pagingText + " " + this.css.pageLabel  + " " + dir).text($.i18n.prop("js.net.hedtech.banner.pagingControls.page.label")).append(input),
                pageLabelWrap = $(this.elements.div).addClass(this.css.pageLabelWrapper).append(pageLabel),
                divider = $(this.elements.div).addClass(this.css.divider),
                select = $(this.elements.select).addClass(this.css.pageSizeSelect),
                perPage = $(this.elements.label).addClass(this.css.pagingText + " " + this.css.pagePer  + " " + dir).text($.i18n.prop("js.net.hedtech.banner.pagingControls.perPage.label")).append(select),
                selWrap = $(this.elements.div).addClass(this.css.pageSizeSelectWrapper).append(perPage);


            _.each(this.pageLengths, function (it) {
                var option = $(view.elements.option).val(it).text(it);

                if (it == pageInfo.pageMaxSize)
                    option.attr("selected", "selected");

                select.append(option);
            });

            this.$el.addClass(this.css.pagingContainer);

            if (pageInfo.pages == 1) {
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
                    it.addClass(view.css.enabled)
                });
            }

            _.each([ first, prev, pageLabelWrap, of, pages, next, last, divider, selWrap ], function (it) {
                view.$el.append(it);
            });
        }
    });
}).call(this, $, _, Backbone);

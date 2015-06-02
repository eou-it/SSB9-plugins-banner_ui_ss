/*********************************************************************************
 Copyright 2012-2014 Ellucian Company L.P. and its affiliates.
 *********************************************************************************/


(function ($, _, Backbone) {

    Backbone.ButtonMenu = Backbone.View.extend({
        name:"",
        items:[ ],
        callback:null,

        css:{
            buttonMenuItemCheckbox:"button-menu-item-checkbox",
            buttonMenuContainer:"button-menu-container",
            buttonMenuOverlay:"button-menu-overlay",
            columnVisibilityMenu:"column-visibility-menu"
        },

        elements:{
            div:"<div></div>",
            ul:"<ul></ul>",
            li:"<li></li>",
            label:"<label></label>",
            checkbox:"<input type='checkbox'/>"
        },

        events:{
            "click .button-menu-item-checkbox":"toggleItem",
            "click":"toggleMenu",
            "keydown":"renderMenuContainerOnKeyPress"
        },

        strings:{
            buttonLabel:null,
            itemIdPrefix:"menuItemId"
        },

        keycode:{
            ENTER : 13,
            ESC : 27,
            TAB : 9
        },

        toggleMenu:function () {
            if ($("." + this.css.buttonMenuContainer).is(":visible")) {
                this.removeMenu();
            } else {
                this.renderMenuContainer();
            }
        },

        renderMenuContainerOnKeyPress:function(e){
            if(e.keyCode == this.keycode.ENTER){
                this.renderMenuContainer();
            }
        },

        removeMenuContainerOnKeyPress:function(e){
            if( e.keyCode == this.keycode.ESC){
                this.removeMenu();
                this.focusColumnVisibilityMenu();
            }
        },

        focusColumnVisibilityMenu: function(){
            this.gridWrapper.find("."+ this.css.columnVisibilityMenu).focus();
        },

        renderMenuContainer: function () {
            this.renderMenu();
            this.makeDocumentAsOverlay();
        },

        makeDocumentAsOverlay: function () {
            var view = this;

            var closeButtonMenu = function(event) {

                var element = $(event.target);

                if(view.shouldCloseMenuContainer(element)) {
                    view.removeMenu();
                    document.removeEventListener('click', closeButtonMenu, true );
                }

                if(element.hasClass(view.css.columnVisibilityMenu)) {
                    element.focus();
                    event.stopPropagation();
                }
            };

            document.addEventListener('click', closeButtonMenu , true );
        },

        shouldCloseMenuContainer: function(element){
            var closeMenuContainer = true;
            if(element.hasClass(this.css.buttonMenuContainer) || element.parents().hasClass(this.css.buttonMenuContainer)){
                closeMenuContainer =  false;
            }
            return closeMenuContainer;
        },

        toggleItem:function (e) {
            var name = $(e.target).attr("data-name"),
                item = _.find(this.items, function (it) {
                    return it.name == name;
                });

            item.checked = ( item.checked == true ? false : true );

            if (_.isFunction(this.callback)) {
                this.callback.call(this, item, e);
            }

            $(e.target).focus();
        },

        initialize:function () {
            if (this.strings.buttonLabel === null) {
                this.strings.buttonLabel = $.i18n.prop("js.grid.columns.button");
            }
            this.items = this.options.items || [ ];
            this.callback = this.options.callback || null;
            this.container = this.options.container || this.$el.parent();
            this.gridWrapper = this.options.gridWrapper || null;

            var self = this;
            var resizeButton = function () {
                var my = "right top", at = "right top";
                if ($.i18n.prop('default.language.direction') == "rtl") {
                    my = "left top";
                    at = "left top";
                }

                self.$el.height(self.container.height()).
                    position({
                        of:self.container,
                        my:my,
                        at:at,
                        collision:"none"
                    });
            };
            $(self.container).mutate('height top width', resizeButton);
            _.defer(resizeButton);
        },

        removeMenu:function () {
            var menuContainer =   $("." + this.css.buttonMenuContainer);
            menuContainer.children().off();
            menuContainer.off().remove();
        },

        renderMenu:function () {
            var view = this,
                ul = $(this.elements.ul);

            _.each(this.items, function (it, idx) {
                var label = $(view.elements.label),
                    input = $(view.elements.checkbox).addClass(view.css.buttonMenuItemCheckbox),
                    li = $(view.elements.li),
                    id = _.string.camelize(view.strings.itemIdPrefix + view.name + idx);

                if (it.checked)
                    input.attr("checked", "checked");

                if (!_.isUndefined(it.name))
                    input.attr("data-id", it.id);

                if (!_.isUndefined(it.name))
                    input.attr("data-name", it.name);

                input.on("click",function (e) {
                    view.toggleItem.call(view, e);
                });

                input.attr("id", id);
                label.attr("for", id).text(it.title);

                li.append(input).append(label);
                ul.append(li);
            });

            $("body").remove(this.css.buttonMenuContainer).append($(this.elements.div).addClass(this.css.buttonMenuContainer).append(ul));

            this.addEventListeners();

            this.positionContainerAndFocusMenuItem();
        },

        addEventListeners: function () {
            var view = this;

            $("." + this.css.buttonMenuContainer).on("keydown",function (e) {
                view.removeMenuContainerOnKeyPress(e);
            });

            $("." + this.css.buttonMenuContainer + " ul li:first-child input").on("keydown", function (e) {
                if (e.keyCode == view.keycode.TAB && e.shiftKey) {
                    $("." + view.css.buttonMenuContainer + " ul li:last-child input").focus();
                    e.preventDefault();
                }
            });

            $("." + this.css.buttonMenuContainer + " ul li:last-child input").on("keydown",function (e) {
                if (e.keyCode == view.keycode.TAB && !e.shiftKey) {
                    $("." + view.css.buttonMenuContainer + " ul li:first-child input").focus();
                    e.preventDefault();
                }
            });
        },

        positionContainerAndFocusMenuItem: function () {
            $("." + this.css.buttonMenuContainer)
                .attr('tabindex', '0')
                .position({
                    of: this.$el,
                    my: "right top",
                    at: "right bottom",
                    collision: "fit"
                });

            $("." + this.css.buttonMenuContainer + " ul li:first-child input").focus();
        },

        render:function () {
            this.$el.attr('title', this.strings.buttonLabel);
        }

    });
}).call(this, $, _, Backbone);

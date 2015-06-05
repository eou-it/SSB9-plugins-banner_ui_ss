/*********************************************************************************
 Copyright 2011-2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

$(document).ready(function() {

    window.Notification = Backbone.Model.extend({
        save: function() {
            throw new Error("A notification object cannot be persisted.  Save Not Supported");
        },
        addPromptAction: function(label, action) {
            var prompts = this.get( "prompts" );

            if (!prompts) {
                prompts = [];
                this.set( {prompts: prompts} );
            }

            prompts.push({label: label, action: action});
        },
        hasPrompts: function() {
            var prompts = this.get( "prompts" );

            return prompts && prompts.length > 0;
        },
        isEqual: function( that ) {

            var comparisonAttributes = [ "message", "type", "model", "attribute", "ignoreForGroupBy" ]

            var returnValue = true;

            _.each( comparisonAttributes, function(attribute) {
                if (returnValue && (this.get( attribute ) !== that.get( attribute ))) {
                    returnValue = false;
                }
            }, this );

            return returnValue;
        },
        prompts: []
    });

    window.Notifications = Backbone.Collection.extend({
        initialize: function () {
            this.bind('add', this.addComponentErrorStyle, this);
            this.bind('remove', this.removeComponentErrorStyle, this);
        },
        model: Notification,
        addNotification: function( notification ) {
            var foundNotification = this.find( function(n) {
                return _.isEqual( n, notification );
            });

            if (foundNotification) {
                return foundNotification;
            }
            else {
                this.add( notification );
                // If the notification gets orphaned remove it from the collection.
                if (notification.has( "model" ) && notification.get( "model" )) {
                    var model = notification.get( "model" );

                    notification.get("flash") || model.collection.bind( "reset", function(models) {
                        if (_.isUndefined( model.collection )) {
                            this.remove( notification );
                        }
                    }, this );
                }

                // If the notification is a flash, we are going to set to remove it automagically.
                if (notification.get( "flash" )) {
                    var removeNotification = function() {
                        this.remove( notification );
                    };

                    removeNotification = _.bind( removeNotification, this );
                    _.delay( removeNotification, 5000 );
                }
                return notification;
            }
        },
        fetch: function() {
            throw new Error("not supported");
        },
        clearNotifications: function( model, attributes ) {
            if (model) {
                // Remove all notifications that are bound to the model
                var notificationsToRemove = this.filter( function( n ) {
                    if (n.get( "flash" )) {
                        return false; // allow flash notifications to persist until they time out or are explicitly removed
                    }

                    var notificationModel = n.get( "model" );
                    if (notificationModel && notificationModel.id === model.id) {
                        if (attributes) {
                            if (n.has( "attribute" )) {
                                // We are going to only select the the notifications that have the same model and attribute
                                var keys = _.keys( attributes );

                                var found = _.find( keys, function(k) {
                                    return k === n.get( "attribute" );
                                });

                                // If we got to this point we do not want to mark this notification for removal because none of the attributes are in the notification.
                                return found;
                            }
                            else {
                                // This specific notification does not have an attribute so we will not include it since the request to clear notifications was by model and attributes.
                                return false;
                            }
                        }
                        else {
                            // We are not inspecting attributes and will return this notification.
                            return true;
                        }
                    }
                });

                if (notificationsToRemove) {
                    _.each( notificationsToRemove, function( n ) {
                        this.remove( n );
                    }, this );
                }
            }
            else {
                _.each(this.models,function(model){
                    notifications.removeComponentErrorStyle(model);
                });
                // Remove all models
                this.remove(this.models);
            }
        },
        addNotificationsFromModel: function(model) {
            if (model) {
                function evaluateModel(model) {
                    this.clearNotifications( model );

                    if (model.has && model.has("messages")) {
                        _.each(model.get("messages"), function(message) {

                            var notification = new Notification( {message: message.message, type: message.type, model: model, attribute: message.field } );

                            if (message.type === "success") {
                                notification.set( {
                                    flash: true,
                                    message: $.i18n.prop("js.notification.success"),
                                    ignoreForGroupBy: ["model"]
                                } );
                            }

                            this.addNotification( notification );

                            model.bind( "change:messages", function( m ) {
                                // Reset the notifications that are associated with the model that has new or updated messages
                                var associatedNotifications = _.select( notifications.models, function(n) {
                                    return n.get( "model" ) === m;
                                });

                                _.each( associatedNotifications, function( n ) {
                                    n.get( "flash" ) || notifications.remove( n );
                                });
                            }, this );
                        }, this);
                    } else {
                        var notification = new Notification({message: $.i18n.prop("js.notification.NoChangesToSave"), type: "warning", model: model, attribute: "" });
                        notification.set({
                            flash: true,
                            ignoreForGroupBy: ["model"]
                        });
                        this.addNotification(notification);
                    }
                }

                evaluateModel = _.bind(evaluateModel, this);

                if (!model.models) {
                    evaluateModel(model);
                }
                else if (model.models.length === 0) {
                    evaluateModel(model.models);
                }
                else {
                    _.each(model.models, function(m) {
                        evaluateModel(m);
                    });
                }
            }
        },
        generateCompareHash: function ( notification ) {
            var prefix;

            if (notification.get("type") === "success") {
                prefix = "0";
            } else if (notification.hasPrompts()) {
                prefix = "1";
            }
            else {
                prefix = "2";
            }

            if ( notification.has( "model" ) && notification.get( "model" ) ) {
                var model = notification.get( "model" );

                if ( !_.isUndefined( model.collection ) ) {
                    var idx = model.collection.indexOf( model );

                    prefix += "-" + model.collection.getCid() + "-" + idx;
                }
            }

            return prefix + "-" + notification.get("type") + notification.get( "message" );
        },
        comparator: function( a, b ) {
            var x = this.generateCompareHash( a ),
                y = this.generateCompareHash( b );

            x = x.replace( /\\\s/g, " " ).split( /(\d+)/ ); // the split formatting is imperative, everything else can change
            y = y.replace( /\\\s/g, " " ).split( /(\d+)/ ); // the split formatting is imperative, everything else can change

            for ( var i = 0; i < x.length; i++ ) {
                if ( x[ i ] && !y[ i ] || isFinite( x[ i ] ) && !isFinite( y[ i ] ) ) {
                    return -1;
                } else if ( !x[ i ] && y[ i ] || !isFinite(y[ i ] ) && isFinite( y[ i ] ) ) {
                    return 1;
                } else if ( !isFinite( x[ i ] ) && !isFinite( y[ i ] ) ) {
                    x[ i ] = x[ i ].toLowerCase(); y[ i ] = y[ i ].toLowerCase();

                    if ( x[ i ] < y[ i ]) return -1;
                    if ( x[ i ] > y[ i ]) return 1;
                } else {
                    x[ i ] = parseFloat( x[ i ] );
                    y[ i ] = parseFloat( y[ i ] );

                    if ( x[ i ] < y[ i ] ) return -1;
                    if ( x[ i ] > y[ i ] ) return 1;
                }
            }

            return 0;
        },
        hasErrors: function() {
            return this.find( function(model) { return model.get( "type" ) === "error" } );
        },
        grouped: function() {
            var grouper = function( notifications ) {
                return notifications.groupBy( function( notification ) {
                    var props = ["message", "type", "model", "field", "ignoreForGroupBy" ];

                    var key = "";
                    _.each( props, function(p) {
                        if (key !== "") {
                            key += "|";
                        }

                        var value = notification.get( p );

                        // We can uniquely identify the model through the cid.  If the value is not null we should use the cid.
                        if (p === "model" && value) {
                            value = value.cid;
                        }

                        if (notification.has( "ignoreForGroupBy" )) {
                            if (_.include( notification.get( "ignoreForGroupBy" ), p )) {
                                value = "+";  // '+' is shorthand to show a value is grouped.
                            }
                        }

                        key += p + ":" + value;
                    });

                    return key;
                });
            }

            var groupedModels = [];
            var groupedNotificationsSet = grouper( this );

            // The grouper function will return a set of models key'd by a unique key
            // This loop is to pluck out the first model for each key since we only need one to pass back
            // in the collection.
            _.each( groupedNotificationsSet, function(p) {
                // Push the first notification in the group.
                groupedModels.push( p[0] );
            });

            return groupedModels;
        },
        addComponentErrorStyle: function( notification ) {
            var errorComponent = this.getNotificationComponent(notification);
            if(!_.isUndefined(errorComponent)){
                $(errorComponent).addClass("component-error");
            }
        },
        removeComponentErrorStyle: function( notification ) {
            var errorComponent = this.getNotificationComponent(notification);
            if(!_.isUndefined(errorComponent)){
                $(errorComponent).removeClass("component-error");
            }
        },
        getNotificationComponent: function( notification ){
            var notificationType = notification.get("type");
            if (notificationType == "error") {
                var errorComponent = notification.attributes.component;
            }
            return errorComponent;
        }
    });

    window.notifications = new Notifications;

    window.NotificationView = Backbone.View.extend({
        tagName: "li",
        className: "notification-item",
        initialize: function() {
            _.bindAll(this, "render", "removeNotification" );
            this.model.collection.bind("remove", this.removeNotification);
        },
        render: function() {
            //  Evaluate the notification type to determine what css class to append to the notification.
            var notificationType = this.model.get("type");
            var notificationClass = "notification-center-message-error";

            var ariaNotificationItemText = $.i18n.prop("js.notification.flashmessage");

            if (!this.model.get("flash")) {
                ariaNotificationItemText=$.i18n.prop("js.notification.messageinfo", [this.options.notificationIdx,this.options.notificatioLength,this.model.get("type")]);
            }

            if (this.model.hasPrompts()) {
                ariaNotificationItemText+=" ";
                ariaNotificationItemText+=$.i18n.prop("js.notification.promptmessage");
            }

            switch (notificationType) {
                case "error":
                    notificationClass = "notification-center-message-error";
                    break;
                case "warning":
                    notificationClass = "notification-center-message-warning";
                    break;
                case "success":
                    notificationClass = "notification-center-message-success";
                    break;
            }

            $(this.el).addClass( notificationClass );

            var view = this;
            var messageContainer = $("<span tabindex='0'></span>");
            var component = this.model.get("component");
            if(notificationType=="error" && component){
                messageContainer = $("<a href='#'></a>");
                messageContainer.addClass('notification-message');
                messageContainer.on('click', function(){
                    if($('body .notification-center-shim').length == 0) {
                        view.navigateToErrorComponent(view.model);
                    }
                });
            }
            var ariaNotificationItemTextElement = "<b class='offscreen' id='ariaNotificationCountText'>"+ariaNotificationItemText+"</b>";
            $(messageContainer).prepend(ariaNotificationItemTextElement);

            messageContainer.addClass('notification-flyout-item');

            var messageDiv = $("<div></div>").addClass( "notification-item-message vertical-align" ).html(messageContainer.append( this.model.get("message" ) ) );

            // Manage the prompts if available
            var promptsDiv;
            if (this.model.hasPrompts()) {

                $(this.el).addClass( "notification-center-message-with-prompts" );

                var promptMessage = this.model.get( "promptMessage" );
                if (promptMessage) {
                    messageContainer.append( promptMessage );
                }

                promptsDiv = $( "<div></div>" ).addClass( "notification-item-prompts" );

                _.each(this.model.get( "prompts" ), function(prompt) {
                    var b = $("<button></button>").html( prompt.label ).click( prompt.action );
                    b.addClass('notification-flyout-item');
                    promptsDiv.append( b );
                }, this );
            }

            $(this.el).append("<span class='notification-icon'></span>");
            $(this.el).append( messageDiv );


            if (promptsDiv) {
                $(this.el).append( promptsDiv );
            }
            return this;
        },
        removeNotification: function(notification) {
            if (this.model === notification) {
                $(this.el).fadeOut( 1000 ).remove();
            }
        },
        navigateToErrorComponent: function(model) {
            var component = model.attributes.component;
            if(component){
                if(model.attributes.componentType == "select2" && !component.hasClass('select2-focusser')){
                    component = component.find('.select2-focusser');
                }
                window.notificationCenter.closeNotificationFlyout();
                window.componentToFocusOnFlyoutClose = null;
                component.focus();
            }
        }
    });


    // The notification center will instantiate a notificationCenterAnchor and a notificationCenterFlyout.

    // The notification center will be responsible for capturing events that come from the child components
    // and act as a controller.  E.g. is that the notificationCenter will listen for a click event on the
    // notificationCenterAnchor and instruct the flyout to either open or close.


    window.NotificationCenterAnchor = Backbone.View.extend({
        initialize: function() {
            $(this.el).addClass( "notification-center-anchor" ).addClass( "notification-center-anchor-hidden");
            var notificationCountDiv = $('<div class="notification-center-count vertical-align"><span/></div>' );
            $(this.el).screenReaderLabel( $.i18n.prop("js.notification.description") );
            $(this.el).append( notificationCountDiv );
            _.bindAll(this, "render", "isDisplayed", "display", "hide");

            this.model.bind("add", this.render);
            this.model.bind("remove", this.render);
            this.model.bind("reset", this.render);

            this.render();
        },
        render: function() {
            var displayedNotifications = this.model.grouped();

            if (displayedNotifications.length > 0) {
                $(this.el).removeClass( "notification-center-anchor-hidden");
                $("#notification-center").removeClass("notification-center-hidden").addClass("notification-center-displayed");
            }
            else {
                $(this.el).addClass( "notification-center-anchor-hidden");
                $("#notification-center").removeClass("notification-center-displayed").addClass("notification-center-hidden");
            }
            var notificationCountInfo = displayedNotifications.length+" <p class='offscreen'>"+$.i18n.prop("js.notification.label")+"</p>"
            $(".notification-center-count span", this.el).html( notificationCountInfo );
            return this;
        },
        isDisplayed: function() {
            return $(this.el).hasClass( "notification-center-anchor-displayed" );
        },
        display: function() {
            $(this.el).addClass( "notification-center-anchor-displayed" ).removeClass( "notification-center-anchor-hidden" );
            return this;
        },
        hide: function() {
            $(this.el).addClass( "notification-center-anchor-hidden" ).removeClass( "notification-center-anchor-displayed" );
            return this;
        }
    });


    window.NotificationCenterFlyout = Backbone.View.extend({
        events: {
            "keydown .notification-flyout-item:first":"focusLastMessageItem",
            "keydown .notification-flyout-item:last":"focusFirstMessageItem"
        },
        initialize: function() {
            $(this.el).addClass( "notification-center-flyout" ).addClass( "notification-center-flyout-hidden" );

            _.bindAll(this, "render", "isDisplayed", "display", "hide","addAriaDescription" );
            this.model.bind("all", this.render);
        },
        render: function() {
            $("ul", this.el).empty();
            var notificationIdx = 0;
            var notificationCollection = this.model.grouped();
            //In case of flash messages aria description regarding shortcuts is not required
            if (!(notificationCollection.length == 1 && notificationCollection[0].get("flash"))) {
                this.addAriaDescription(notificationCollection.length);
            }

            _.each(notificationCollection, function(notification) {
                notificationIdx+=1;
                var view = new NotificationView( {model:notification, notificationIdx:notificationIdx, notificatioLength:notificationCollection.length} );
                $("ul", this.el).append( view.render().el );
            }, this);

            this.$('.notification-flyout-item:first').focus();
            return this;
        },
        isDisplayed: function() {
            return $(this.el).hasClass( "notification-center-flyout-displayed" );
        },
        addAriaDescription: function(count) {
            if ($(this.el).children('#notificationCenterAriaInfo').length == 0 ) {
                //First time notification info.
                var notificationCenterAriaInfo = "<p tabindex='-1' class='offscreen' role='alert'  id='notificationCenterAriaInfo'>";
                notificationCenterAriaInfo +=$.i18n.prop("js.notification.countlabel",[count]);
                notificationCenterAriaInfo += $.i18n.prop("js.notification.help");
                notificationCenterAriaInfo +="</p>";
                $(this.el).prepend(notificationCenterAriaInfo);
                $(this.el).attr('aria-describedby','notificationCenterAriaInfo');
            } else {
                //Further time notification info.
                $(this.el).children('#notificationCenterCountAriaInfo').remove();
                var notificationCenterCountAriaInfo = "<p tabindex='-1' class='offscreen' role='alert'  id='notificationCenterCountAriaInfo'>";
                notificationCenterCountAriaInfo +=$.i18n.prop("js.notification.countlabel",[count]);
                notificationCenterCountAriaInfo +="</p>";
                $(this.el).prepend(notificationCenterCountAriaInfo);
                $(this.el).attr('aria-describedby','notificationCenterCountAriaInfo');
            }

        },
        display: function() {
            $(this.el).addClass( "notification-center-flyout-displayed" ).removeClass( "notification-center-flyout-hidden" );


            return this;
        },
        hide: function() {
            $(this.el).addClass( "notification-center-flyout-hidden" ).removeClass( "notification-center-flyout-displayed" );
            return this;
        },
        focusLastMessageItem: function(e){
            if (e.keyCode == $.ui.keyCode.TAB && e.shiftKey) {
                $('.notification-flyout-item:last').focus();
                e.preventDefault();
            }
        },
        focusFirstMessageItem: function(e){
            if (e.keyCode == $.ui.keyCode.TAB && !e.shiftKey) {
                $('.notification-flyout-item:first').focus();
                e.preventDefault();
            }
        }
    });


    window.NotificationCenter = Backbone.View.extend({
        events: {
            "click .notification-center-anchor":"toggle"
        },
        initialize: function() {
            var self  = this;
            $(this.el).addClass("notification-center");
            $(this.el).append( '<a href="#" class="notification-center-anchor"></a>' );
            $(this.el).append( '<div class="notification-center-flyout" tabindex="0"><ul role="alert"/></div>' );

            this.notificationCenterFlyout = new NotificationCenterFlyout({el: $(".notification-center-flyout", this.el), model: this.model, parent: this.el });
            this.notificationCenterAnchor = new NotificationCenterAnchor({el: $(".notification-center-anchor", this.el), model: this.model });

            _.bindAll(this, 'render', 'addNotification', 'removeNotification', 'toggle','pressEscToClose','closeNotificationFlyout','closeNotificationFlyoutAndSetFocus','addNotificationOverlay','checkAndCloseFlyout');
            this.model.bind("add", this.addNotification);
            this.model.bind("remove", this.removeNotification);

            document.addEventListener('mousedown',this.setComponentToFocusOnFlyoutClose,true);
            document.addEventListener('keydown',this.setComponentToFocusOnFlyoutClose,true);
        },
        render: function() {
            return this;
        },
        addNotification: function(notification) {
            this.recreateNotificationOverlay();
            this.openNotificationFlyout();
            this.configNotificationShim();
            return this;
        },
        removeNotification: function(notification) {
            if (this.model.length == 0) {
                this.closeNotificationFlyout();
                this.removeNotificationOverlay();
            }

            this.configNotificationShim();

            return this;
        },
        toggle: function() {
            if (this.notificationCenterFlyout.isDisplayed()) {
                this.closeNotificationFlyoutAndSetFocus();
            }
            else {
                if(this.model.length > 0){
                    this.openNotificationFlyout();
                }
                else{
                    this.notificationCenterAnchor.$el.focus();
                }
            }

            return this;
        },
        openNotificationFlyout: function () {
            if(window.componentToFocusOnFlyoutClose == null){
                window.componentToFocusOnFlyoutClose = $(document.activeElement);
            }
            this.notificationCenterAnchor.display();
            this.notificationCenterFlyout.display();
            this.addNotificationOverlay();
            this.$('.notification-flyout-item:first').focus();
            $('.notification-center-flyout')[0].addEventListener('keydown', this.pressEscToClose , true );
        },
        closeNotificationFlyout: function () {
            this.notificationCenterFlyout.hide();
            this.removeClickListenerOnNotificationOverlay();
            $('.notification-center-flyout')[0].removeEventListener('keydown',  this.pressEscToClose, true );

        },
        closeNotificationFlyoutAndSetFocus: function(){
            this.closeNotificationFlyout();
            this.focusComponentOnFlyoutClose();
            window.componentToFocusOnFlyoutClose = null;
        },
        focusComponentOnFlyoutClose: function(){
                if($('body .notification-center-shim').length == 0) {
                    window.componentToFocusOnFlyoutClose.focus();
                }
                else{
                    this.notificationCenterAnchor.$el.focus();
                }
        },
        pressEscToClose: function(e) {
            if(e.keyCode == $.ui.keyCode.ESCAPE){
                this.closeNotificationFlyoutAndSetFocus();
                e.stopImmediatePropagation();
            }
        },
        configNotificationShim: function() {
            // Check to see if any prompts exist.  If there is a prompt, the user must be forced to address the prompt prior
            // to moving on.
            var target = this.options.shimTarget;

            if (_.isUndefined(target)) {
                target = $("body");
            }

            if (this.model.find( function( n ) { return n.hasPrompts(); } )) {
                if ($(".notification-center-shim", target).length === 0) {
                    target.append( '<div class="notification-center-shim"></div>' );
                }
            }
            else {
                $(".notification-center-shim", target).remove();
            }
        },
        removeClickListenerOnNotificationOverlay: function(){
            if($('#notification-center-div').length > 0) {
                $('#notification-center-div')[0].removeEventListener('mousedown',this.checkAndCloseFlyout,true);
            }
        },
        removeNotificationOverlay: function(){
            if($('#notification-center-div').length > 0) {
                $('#notification-center-div').children().unwrap();
            }
        },
        addNotificationOverlay: function(){
            if($('#notification-center-div').length == 0) {
                var overlay = $('<div id="notification-center-div"></div>');
                var elementsToBeWrapped = $('body').children().not('script');
                elementsToBeWrapped.wrapAll(overlay);
            }

            $('#notification-center-div')[0].addEventListener('mousedown',this.checkAndCloseFlyout,true);
        },
        checkAndCloseFlyout: function(event){
            if($(event.target).closest('.notification-center').length == 0){
                this.closeNotificationFlyoutAndSetFocus();
            }
        },
        setComponentToFocusOnFlyoutClose: function(e) {
            if(e.type == "keydown"){
                if ($(e.target).closest('.notification-center').length == 0) {
                    if (e.keyCode == $.ui.keyCode.TAB && e.shiftKey) {
                        window.componentToFocusOnFlyoutClose = getPreviousTabbableElement(e.target);
                    }
                    else if (e.keyCode == $.ui.keyCode.TAB && !e.shiftKey) {
                        window.componentToFocusOnFlyoutClose = getNextTabbableElement(e.target);
                    }
                }
            }
            else{
                window.componentToFocusOnFlyoutClose = $(e.target);
            }
        },
        recreateNotificationOverlay: function(){
            this.removeClickListenerOnNotificationOverlay();
            this.removeNotificationOverlay();
            this.addNotificationOverlay();
        }
    });

    if ( !_.isUndefined( window[ "EventDispatcher" ] ) ) {
        EventDispatcher.addEventListener( Application.events.initialized, function() {
            var nc = $("<div><div id='notification-center'></div></div>" );
            //TODO: HRU:5803 cleanup
            //ControlBar.append( nc );
            window.notificationCenter = new NotificationCenter({
                el: $("#notification-center"),
                model: notifications
            });
        });
    }
});

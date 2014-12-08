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
                // Remove all models
                this.reset();
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

            var messageLink = $("<span class='notification-message'></span>") ;

            var messageDiv = $("<div></div>").addClass( "notification-item-message" ).html( messageLink.append( this.model.get("message" ) ) );

            var view = this;

            messageLink.on('click', function(){
                view.navigateToErrorComponent(view.model);
            });

            // Manage the prompts if available
            var promptsDiv;
            if (this.model.hasPrompts()) {

                $(this.el).addClass( "notification-center-message-with-prompts" );

                if (this.model.get( "promptMessage" )) {
                    var promptSpan = $("<span></span>").addClass("notification-item-prompt-message").html( "  " + this.model.get( "promptMessage" ));
                    messageDiv.append( promptSpan );
                }

                promptsDiv = $( "<div></div>" ).addClass( "notification-item-prompts" );

                _.each(this.model.get( "prompts" ), function(prompt) {
                    var b = $("<button></button>").html( prompt.label ).click( prompt.action );
                    promptsDiv.append( b );
                }, this );
            }

            $(this.el).html( messageDiv );


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

            $(this.el).append(
              $('<div class="notification-center-count"><span/></div>' )
                .screenReaderLabel($.i18n.prop("js.notification.label"))
            ).append( '<div class="notification-center-label"><span>' + $.i18n.prop("js.notification.label") + '</span></div>');

            _.bindAll(this, "render", "isDisplayed", "display", "hide");

            this.model.bind("add", this.render);
            this.model.bind("remove", this.render);
            this.model.bind("reset", this.render);

            this.render();
        },
        render: function() {
            var displayedNotifications = this.model.grouped();

            if (displayedNotifications.length > 0) {
                $(".notification-center-count", this.el).removeClass( "notification-center-count-nil");
            }
            else {
                $(".notification-center-count", this.el).addClass( "notification-center-count-nil");
            }

            $(".notification-center-count span", this.el).html( displayedNotifications.length );
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
        initialize: function() {
            $(this.el).addClass( "notification-center-flyout" ).addClass( "notification-center-flyout-hidden" );

            _.bindAll(this, "render", "display", "hide" );
            this.model.bind("all", this.render);
        },
        render: function() {
            $("ul", this.el).empty();

            _.each(this.model.grouped(), function(notification) {
                var view = new NotificationView( {model:notification} );
                $("ul", this.el).append( view.render().el );
            }, this);

            if($("ul>li", this.el).find('.notification-item-prompts').length ){
                $("ul", this.el).attr('role','alertdialog');
                $("ul>li", this.el).find('.notification-item-prompts button:first').focus();
            }
            else{
                $("ul", this.el).attr('role','alert');
            }

            return this;
        },
        display: function() {
            $(this.el).addClass( "notification-center-flyout-displayed" ).removeClass( "notification-center-flyout-hidden" );

            // This really should be encapsulated in the notificationCenter
            $(this.el).position({
                my: "right top",
                at: "right bottom",
                of: this.options.parent
            });

            return this;
        },
        hide: function() {
            $(this.el).addClass( "notification-center-flyout-hidden" ).removeClass( "notification-center-flyout-displayed" );
            return this;
        }
    });


    window.NotificationCenter = Backbone.View.extend({
        events: {
            "click .notification-center-anchor":"toggle"
        },
        initialize: function() {
            var self  = this;
            $(this.el).addClass("notification-center");

            $(this.el).append( '<div class="notification-center-flyout"><ul role="alert"/></div>' );
            this.notificationCenterFlyout = new NotificationCenterFlyout({el: $(".notification-center-flyout", this.el), model: this.model, parent: this.el });

            $(this.el).append( '<div class="notification-center-anchor"></div>' );
            this.notificationCenterAnchor = new NotificationCenterAnchor({el: $(".notification-center-anchor", this.el), model: this.model });

            _.bindAll(this, 'render', 'addNotification', 'removeNotification', 'toggle',
                      'clickOutsideToClose' );
            this.model.bind("add", this.addNotification);
            this.model.bind("remove", this.removeNotification);
        },
        render: function() {
            return this;
        },
        addNotification: function(notification) {
            this.toggle(true);
            this.configNotificationShim();

            return this;
        },
        removeNotification: function(notification) {
            if (this.model.length == 0) {
                this.toggle(false);
            }

            this.configNotificationShim();

            return this;
        },
        toggle: function(arg1) {
            var showOrHide = _.isBoolean(arg1) ? arg1 : false;
            if (showOrHide == false && this.notificationCenterAnchor.isDisplayed()) {
                this.notificationCenterAnchor.hide();
                this.notificationCenterFlyout.hide();
                $("body").off( "click", this.clickOutsideToClose );
            }
            else if (this.model.length > 0) {
                this.notificationCenterAnchor.display();
                this.notificationCenterFlyout.display();
                _.delay( function() {
                    $("body").on( "click", this.clickOutsideToClose );
                }, 50 );
            }

            return this;
        },
        clickOutsideToClose: function(e) {
            var outside = $(e.target).closest(".notification-center").length == 0;
            if ( outside ) {
                this.toggle(false);
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
        }
    });

    if ( !_.isUndefined( window[ "EventDispatcher" ] ) ) {
        EventDispatcher.addEventListener( Application.events.initialized, function() {
            var nc = $("<div><div id='notification-center'></div></div>" );
            ControlBar.append( nc );
            window.notificationCenter = new NotificationCenter({
                el: $("#notification-center"),
                model: notifications
            });
        });
    }
});

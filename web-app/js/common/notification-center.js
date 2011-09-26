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

            var comparisonAttributes = [ "message", "type", "model", "attribute", "groupBy" ]

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
        addNotificationsFromModel: function(model) {
            if (model) {
                function evaluateModel(model) {
                    if (model.has("messages")) {
                        _.each( model.get("messages"), function( message ) {

                            var notification = new Notification( {message: message.message, type: message.type, model: model} );

                            if (message.type === "success") {
                                notification.set( { flash: true, message: $.i18n.prop("js.notification.success"), groupBy: ["message"] } );
                            }

                            this.addNotification( notification );

                            model.bind( "change:messages", function( m ) {
                                // Reset the notifications that are associated with the model that has new or updated messages

                                log.debug( "Update notification for model", m );

                                var associatedNotifications = _.select( notifications.models, function(n) {
                                    return (n.get( "model" ) === m);
                                })

                                _.each( associatedNotifications, function( n ) {
                                    notifications.remove( n );
                                });

                                log.debug( "associatedNotifications", associatedNotifications );

                            }, this );
                        }, this);
                    }
                }

                evaluateModel = _.bind(evaluateModel, this);

                if (!model.models) {
                    evaluateModel(model);
                }
                else {
                    _.each(model.models, function(m) {
                        evaluateModel(m);
                    });
                }
            }
        },
        comparator: function(notification) {

            var prefix;

            if (notification.get("type") === "success") {
                prefix = "0";
            } else if (notification.hasPrompts()) {
                prefix = "1";
            }
            else {
                prefix = "2";
            }

            log.debug( 'comparator: ' + prefix + "-" + notification.get("type") );

            return prefix + "-" + notification.get("type");
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
            for each (var p in groupedNotificationsSet) {
                // Push the first notification in the group.
                groupedModels.push( p[0] );
            }

            return groupedModels;
        }
    });

    window.notifications = new Notifications;

    window.NotificationView = Backbone.View.extend({
        tagName: "li",
        className: "notification-item",
        initialize: function() {
            _.bindAll(this, "render", "removeNotification" );
            notifications.bind("remove", this.removeNotification);
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

            var messageDiv = $("<div></div>").addClass( "notification-item-message" ).html( $("<span></span>" ).append( this.model.get("message" ) ) );

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
        }
    });


    // The notification center will instantiate a notificationCenterAnchor and a notificationCenterFlyout.

    // The notification center will be responsible for capturing events that come from the child components
    // and act as a controller.  E.g. is that the notificationCenter will listen for a click event on the
    // notificationCenterAnchor and instruct the flyout to either open or close.


    window.NotificationCenterAnchor = Backbone.View.extend({
        initialize: function() {
            $(this.el).addClass( "notification-center-anchor" ).addClass( "notification-center-anchor-hidden");

            $(this.el).append( '<div id="notification-center-count"><span/></div>' ).append( '<div id="notification-center-label"><span>Notifications</span></div>');

            _.bindAll(this, "render", "display", "hide" );

            notifications.bind("add", this.render);
            notifications.bind("remove", this.render);

            this.render();
        },
        render: function() {
            var displayedNotifications = notifications.grouped();

            if (displayedNotifications.length > 0) {
                $( "#notification-center-count" ).removeClass( "notification-center-count-nil");
            }
            else {
                $( "#notification-center-count" ).addClass( "notification-center-count-nil");
            }

            $( "#notification-center-count span" ).html( displayedNotifications.length );
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
            notifications.bind("all", this.render);
        },
        render: function() {
            $(this.el.selector + ' ul').empty();

            _.each(notifications.grouped(), function(notification) {
                var view = new NotificationView( {model:notification} );
                $(this.el.selector + ' ul').append( view.render().el );
            }, this);

            return this;
        },
        display: function() {
            $(this.el).addClass( "notification-center-flyout-displayed" ).removeClass( "notification-center-flyout-hidden" );

            // This really should be encapsulated in the notificationCenter
            $(this.el).position({
                my: "left top",
                at: "left bottom",
                of: "#notification-center"
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
            "click #notification-center-anchor":"toggle"
        },
        initialize: function() {
            $(this.el).addClass("notification-center");

            $(this.el).append( '<div id="notification-center-flyout"><ul/></div>' );
            this.notificationCenterFlyout = new NotificationCenterFlyout({el: $( "#notification-center-flyout" )});

            $(this.el).append( '<div id="notification-center-anchor"></div>' );
            this.notificationCenterAnchor = new NotificationCenterAnchor({el: $( "#notification-center-anchor" )});

            _.bindAll(this, 'render', 'addNotification', 'removeNotification', 'toggle' );
            notifications.bind("add", this.addNotification);
            notifications.bind("remove", this.removeNotification);
        },
        render: function() {
            return this;
        },
        addNotification: function(notification) {
            this.notificationCenterAnchor.display();
            this.notificationCenterFlyout.display();

            this.configNotificationShim();

            return this;
        },
        removeNotification: function(notification) {
            if (notifications.length == 0) {
                this.notificationCenterAnchor.hide();
                this.notificationCenterFlyout.hide();
            }

            this.configNotificationShim();

            return this;
        },
        toggle: function() {
            if (notifications.length > 0) {
                if (this.notificationCenterAnchor.isDisplayed()) {
                    this.notificationCenterAnchor.hide();
                    this.notificationCenterFlyout.hide();
                }
                else {
                    this.notificationCenterAnchor.display();
                    this.notificationCenterFlyout.display();
                }
            }

            return this;
        },
        configNotificationShim: function() {
            // Check to see if any prompts exist.  If there is a prompt, the user must be forced to address the prompt prior
            // to moving on.
            if (_.any( notifications, function( context, index, list ) { return list.at(index).hasPrompts(); })) {
                // Only ever add one shim
                if ($("#notification-center-shim").length == 0) {
                    $("body").append( '<div id="notification-center-shim"></div>');
                }
            }
            else {
                $("#notification-center-shim").remove();
            }
        }
    });

    // Speak with Aurora and add a DIV to it.
    // TODO:  Figure out the right way to add features to Aurora.
    var auroraHeader = $("#aurora-header" );
    auroraHeader.append( '<div id="notification-center"></div>' );

    window.notificationCenter = new NotificationCenter({el: $("#notification-center") });

});
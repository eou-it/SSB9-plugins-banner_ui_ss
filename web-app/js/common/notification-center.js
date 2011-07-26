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
            var comparisonAttributes = [ "message", "type", "model", "attribute" ]

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
                return notification;
            }
        },
        fetch: function() {
            throw new Error("not supported");
        },
        addNotificationsFromModel: function(model) {
            if (model) {
                function evaluateModel(model) {
                    if (model.get("errors")) {
                        _.each( model.get("errors"), function( errorObject ) {
                            this.addNotification( new Notification( {message: errorObject, type: "error", model: this.model} ) );
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
        addSaveSuccessful: function( options ) {
            options || (options = {});

            var defaults = {
                message:        'Save Successful'
            };

            options = $.extend(defaults, options);

            var n = new Notification( {message: options.message, type:"success", flash: true } );
            this.addNotification( n );
        },
        comparator: function(notification) {

            var prefix;

            if (notification.hasPrompts()) {
                prefix = "0";
            }
            else {
                prefix = "1";
            }

            return prefix + "-" + notification.get("type");
        },
        hasErrors: function() {
            return this.find( function(model) { return model.get( "type" ) === "error" } );
        }
    });

    window.notifications = new Notifications;

    window.NotificationView = Backbone.View.extend({
        tagName: "li",
        className: "notification-item",
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

            if (!this.model.hasPrompts() && this.model.get( "flash" ) === true) {
                // Set a timer to remove this model.
                var removeNotification = function() {
                    this.model.collection.remove( this.model );
                }
                removeNotification = _.bind( removeNotification, this );
                $(this.el).delay( "5000" ).fadeOut( "1000", removeNotification );
            }


            // Manage the prompts if available
            var promptsDiv;
            if (this.model.hasPrompts()) {

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
        }
    });


    window.NotificationCenter = Backbone.View.extend({
        events: {
            "click .toggle":"toggle"
        },
        initialize: function() {
            $(this.el).addClass("notification-center");
            $(this.el).addClass("notification-center-hidden");

            $(this.el).html('<div class="notification-center-count"></div><div class="notification-center-message"><div class="notification-center-toggle"><img class="toggle" src="images/arrow_closed.png" alt="Open"/><img class="toggle" src="images/icon_exit.png" alt="Close"/></div><ul/></div>');

            _.bindAll(this, 'render', 'add');
            notifications.bind("add", this.add);
            notifications.bind("reset", this.render);
            notifications.bind("remove", this.render);
            notifications.bind("all", this.render);
        },
        render: function() {
            $(this.el.selector + ' .notification-center-message ul').empty();

            _.each(notifications.models, function(notification) {
                this.add(notification);
            }, this);

            if (notifications.length > 0) {
                $(this.el.selector + ' .notification-center-count').html(notifications.length);
                $(this.el).removeClass("notification-center-hidden");
            }
            else {
                $(this.el).addClass("notification-center-hidden");
            }

            return this;
        },
        add: function(notification) {

            var view = new NotificationView( {model:notification} );
            $(this.el.selector + ' .notification-center-message ul').append( view.render().el );

            if (notifications.length > 0) {
                $(this.el.selector + ' .notification-center-count').html(notifications.length);
                $(this.el).removeClass("notification-center-hidden");
            }
            else {
                $(this.el).addClass("notification-center-hidden");
            }

            return this;
        },
        toggle: function() {
            console.log('toggling');
        }
    });

    window.notificationCenter = new NotificationCenter({el: $("#notification-center") });

});
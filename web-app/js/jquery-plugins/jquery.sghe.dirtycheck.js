/**
 * dirtyCheck is a jQuery function that is used to add dirty checking prior to accepting an event.
 *
 * We will loop through all elements that are selected.
 *
 * We will store the already registered event listeners/handlers in an array on the element.
 *
 * We will then register our own event handler.
 *
 * When the event is fired, the dirtyCheck event handler will be fired.  It'll call the 'isDirty' function
 * sent in the options.  If the event is dirty it'll create a notification to prompt the user to save, not save
 * or cancel the entire operation.
 *
 * If isDirty returned true and the user requested to save the function will first call the 'save' function passed
 * in the options.  The save function requires an options map to be accepted and specifically should be looking for a
 * success callback function to call.  Once the save completes, the save function calls the success callback.  At this
 * point the function will bind the existing handlers and trigger the event.  See section below about ignoring internal
 * dirtyCheck handler.
 *
 * If isDirty returned true and the user said they did not want to save, the function will immediatelly call the
 * existing handlers.  See section below about ignoring internal dirtyCheck handler.
 *
 * If isDirty returned true and the user said they wanted to cancel the function does nothing.  The function return
 * false and is done.
 *
 * For the internal dirtyCheck handler the function needs to know when it is executing the existing handlers and make
 * sure it does not re-excute itself when it triggers the handlers.
 *
 * This function was derived from the jQuery confirm plug-in.
 */
jQuery.fn.dirtyCheck = function(options) {
    options = jQuery.extend({
        isDirty: function() {
            return false;
        },
        eventType: "click",
        notifications: notifications
    }, options);

    var type = options.eventType;

    return this.each(function() {
        var target = this;
        var $target = jQuery(target);

        //log.debug( "registering target for dirty check.", target );

        var saveHandlers = function() {
            var events = jQuery.data(target, 'events');
            if (!events && target.href) {
                // No handlers but we have href
                $target.bind( type, function() {
                    document.location = target.href;
                });
                events = jQuery.data(target, 'events');
            } else if (!events) {
                // There are no handlers to save.
                return;
            }
            target._handlers = new Array();

            if (events[type]) {
                for (var i = 0; i < events[type].length; i++) {
                    target._handlers.push(events[type][i]);
                }
            }
        }

        var executeExistingHandlers = _.bind( function() {
            // Rebind the saved handlers.
            if (target._handlers != undefined) {
                jQuery.each(target._handlers, function(indexInArray, valueOfElement) {
                    $target.bind( type, valueOfElement.handler );
                });

                $target.unbind( type, handler );
                $target.trigger( type );
                $target.bind( type, handler );

            }
        }, this );


        var handler = function() {
            if (options.isDirty()) {
                var n = new Notification( {message: "Changes have been made.", type:"warning", promptMessage: "Do you want to save changes?"} );

                n.addPromptAction( "Cancel", function() {
                    options.notifications.remove( n );
                });

                n.addPromptAction( "No", function() {
                    options.notifications.remove( n );
                    executeExistingHandlers();
                });

                n.addPromptAction( "Yes", function() {
                    options.save( {
                        callback: function() {
                            executeExistingHandlers();
                        }
                    });

                    options.notifications.remove( n );
                });

                options.notifications.addNotification( n );
            }
            else {
                executeExistingHandlers();
            }

            // We'll always return false and let the handling of the notificaiton and existing handlers do their thing.
            return false;
        };

        saveHandlers();

        // Remove the type.
        $target.unbind(type);

        target._confirm = handler
        target._confirmEvent = type;

        $target.bind( type, handler );
    });
}

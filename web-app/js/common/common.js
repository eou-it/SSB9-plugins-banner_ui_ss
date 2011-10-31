//IE fix to support indexOf method on Array objects
Array.prototype.indexOf=[].indexOf||function(a,b,c,r) {
    for(b=this,c=b.length,r=-1;~c;r=b[--c]===a?c:r);
    return r;
}

function getUrl(name) {
    var url = $("#endpoint-" + name).attr('data-endpoint');

    if (url === null || url === undefined) {
        console.log("#endpoint-" + name + " was not found or does not include a data-endpoint.");
    }

    return url;
}

// [name] is the name of the event "click", "mouseover", ..
// same as you'd pass it to bind()
// [fn] is the handler function
$.fn.bindFirst = function(name, fn) {
    // bind as you normally would
    // don't want to miss out on any jQuery magic
    this.bind(name, fn);

    // Thanks to a comment by @Martin, adding support for
    // namespaced events too.
    var handlers = this.data('events')[name.split('.')[0]];
    // take out the handler we just inserted from the end
    var handler = handlers.pop();
    // move it at the beginning
    handlers.splice(0, 0, handler);
};


function validateDate( dateString ) {

    var dateFormat = $.i18n.prop("js.datepicker.dateFormat");
      var result = false;
      try{
          if (dateString == $.datepicker.formatDate( dateFormat, $.datepicker.parseDate( dateFormat, dateString))){
            result = true;
          }
      } catch(e){
          result = false;
      }
      return result;
}

window.ActivityTimer = Backbone.Model.extend({
    saveTimerId: 0,
    initialize: function( options ) {
        if (!options.delay) {
            this.set( {delay: 1000} );
        }
    },
    start: function() {
        var events = this.activityEvents;

        if (events) {
            _.each( events, function ( event ) {
                this.activityTarget().bind( event, _.bind( this.lazyResetter, this ) );
            }, this );
        }

        this.saveTimerId = window.setTimeout( _.bind( this.timeoutHandler, this ), this.get( "delay" ));

        this.trigger( 'timer:start' );
    },
    stop: function( options ) {
        if (this.saveTimerId) {
            window.clearTimeout( this.saveTimerId );
        }

        var events = this.activityEvents;
        if (events) {
            _.each( events, function ( event ) {
                this.activityTarget().unbind( event, _.bind( this.lazyResetter, this ) );
            }, this );
        }

        this.trigger( 'timer:stop' );
    },
    reset: function( options ) {
        this.stop();
        this.start();
        this.trigger( 'timer:reset' );
    },
    lazyResetter: _.throttle( function(e) {
        if (this.saveTimerId) {
            log.debug( "reseting timer '" + this.saveTimerId + "' due to '" + e.type  + "' type." );
            this.reset();
        }
    }, 1500 )
});

window.InactivityTimer = ActivityTimer.extend({
    timeoutHandler: function() {
        var n = new Notification( {
            message: $.i18n.prop("js.notification.inactivityTimer.message"),
            type:"warning",
            promptMessage: $.i18n.prop("js.notification.inactivityTimer.promptMessage")
        });

        this.logoutAction = function() {
            // Logout the user
            log.debug( "logout due to inactivity" );

            // disable dirty checking
            $("#signOutText").data( "ignoreDirtyCheckOneTime", true );

            $("#signOutText").click();
        };

        this.keepAliveAction = function() {
            $.ajax({
                url: $("meta[name='keepAliveURL']").attr( "content" ),
                dataType: "html",
                success: function(data, textStatus, jqXHR) {
                    inactivityTimer.reset();
                    notifications.remove( n );
                }
            });
        };

        _.bindAll( this, "logoutAction", "keepAliveAction" );

        n.addPromptAction( $.i18n.prop("js.notification.inactivityTimer.keepAliveButton"), this.keepAliveAction );
        n.addPromptAction( $.i18n.prop("js.notification.inactivityTimer.logoutButton"), this.logoutAction );

        notifications.addNotification( n );

        // Create another timer that will monitor of the notification is still in the notifications collection.
        // If it is when the timer fires, we are goign to automatically call the logoutAction.

        window.setTimeout( _.bind( function() {
            if (notifications.find( function( notification ) { return notification === n; })) {
                this.logoutAction();
            }
        }, this ),
        20 * 1000 /** 20 seconds */ );

    },
    activityEvents: [ "ajaxStart" ],
    activityTarget: function() { return $(document); }
});

var inactivityTimer = new InactivityTimer({
    delay: parseInt( $("meta[name='maxInactiveInterval']").attr( "content" ) ) * 1000
})

inactivityTimer.start();



// #################################################################################################################
// Name: SaveTimer
// Type: JavaScript 'class' used to manage the actions involved with prompting the user to save over an interval.
//       The use of 'this' is a bit much in here, but was necessary to manage the scopes of 'this'.  I suspect
//       this can be simplified, but have validated this works.
// Req:  This requires notification center to be usable.
// #################################################################################################################
window.SaveTimer = ActivityTimer.extend({
    initialize: function( options ) {
        console.log( "init SaveTimer" );
    },
    timeoutHandler: function() {
        var isDirty = this.get( "isDirty" );
        var saveAction = this.get( "saveAction" );

        if (isDirty()) {
            this.save = function() {
                saveAction();
            };

            var n = new Notification( {
                message: "",
                type:"warning",
                promptMessage: $.i18n.prop("js.notification.savePrompt.message")
            });

            this.doNotSavePromptAction = function() {
                notifications.remove( n );

                if (isDirty()) {
                    // Reset the timer
                    this.reset();
                }
            };

            this.savePromptAction = function() {
                this.save();
                notifications.remove( n );
                this.stop();
            };

            _.bindAll( this, "doNotSavePromptAction", "savePromptAction" );

            n.addPromptAction( $.i18n.prop("js.notification.savePrompt.doNotSaveActionButton"), this.doNotSavePromptAction );
            n.addPromptAction( $.i18n.prop("js.notification.savePrompt.saveActionButton"), this.savePromptAction );

            notifications.addNotification( n );
        }
    },
    activityEvents: [ "mousemove", "keypress" ],
    activityTarget: function() { return $("body"); }
});


// #################################################################################################################
// Name: Logging
// Type: Neccessary setup configs for setting up log4javascript.
// #################################################################################################################

// Setup the default logging.
// TODO:  Logging appenders and layout formats should come from the server via the HTML and used to dynmically setup logging.
var log = log4javascript.getLogger();

var level = log4javascript.Level.DEBUG;  // Default value

if ($("meta[name='logLevel']")) {
    switch($("meta[name='logLevel']").attr('content')) {
        case "OFF":
            level = log4javascript.Level.OFF;
            break;
        case "FATAL":
            level = log4javascript.Level.FATAL;
            break;
        case "ERROR":
            level = log4javascript.Level.ERROR;
            break;
        case "WARN":
            level = log4javascript.Level.WARN;
            break;
        case "INFO":
            level = log4javascript.Level.INFO;
            break;
        case "DEBUG":
            level = log4javascript.Level.DEBUG;
            break;
        case "TRACE":
            level = log4javascript.Level.TRACE;
            break;
        case "ALL":
            level = log4javascript.Level.ALL;
            break;
    }
}

log.setLevel( level );

var browserConsoleAppender = new log4javascript.BrowserConsoleAppender();
var browserConsoleUpLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
browserConsoleAppender.setLayout( browserConsoleUpLayout );
log.addAppender(browserConsoleAppender);



$(document).ready(function() {
    var dir = $('meta[name=dir]').attr("content");

    if (dir == 'rtl') {
        var selector = $(".ui-layout-east");

        if (selector.length) {
            selector.removeClass("ui-layout-east");
            selector.addClass("ui-layout-west");
        }
    }

    $(window).bind({
        'ajaxStart': function(e, xhr, settings) {
            $('.spinner').show();
        },
        'ajaxStop': function(e, xhr, settings) {
            $('.spinner').fadeOut();
        }
    });


    // All ajax requests will use a prefilter to add a request header of the token to ensure
    // that only one request is sent per token eliminating.
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        var synchronizerToken = $("meta[name='synchronizerToken']").attr('content');
        if (synchronizerToken) {
            jqXHR.setRequestHeader("X-Synchronizer-Token", synchronizerToken);
        }
    });

    var switcher = $('#switcher');
    if (switcher.length) {
        switcher.themeswitcher();
    }
});
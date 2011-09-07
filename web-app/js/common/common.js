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
    var validformat = /^\d{2}\/\d{2}\/\d{4}$/; //Basic check for format validity
    if (!validformat.test(dateString)) {
         return false;
    }
    else {
        //Detailed check for valid date ranges
        var monthfield = dateString.split("/")[0];
        var dayfield = dateString.split("/")[1];
        var yearfield = dateString.split("/")[2];
        var dayobj = new Date(yearfield, monthfield - 1, dayfield);

        if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield)) {
            console.log("Invalid Day, Month, or Year range detected. Please correct and submit again.");
            return false;
        }
    }

    return true;
}


// #################################################################################################################
// Name: SaveTimer
// Type: JavaScript 'class' used to manage the actions involved with prompting the user to save over an interval.
//       The use of 'this' is a bit much in here, but was necessary to manage the scopes of 'this'.  I suspect
//       this can be simplified, but have validated this works.
// Req:  This requires notification center to be usable.
// #################################################################################################################
function SaveTimer( options ) {
    this.saveTimerId = 0;
    this.start = function() {
        this.notificationPrompt = function() {
            if (options.isDirty()) {
                var n = new Notification( {message: "Changes have been made.", type:"warning", promptMessage: "Do you want to save changes?"} );

                this.doNotSavePromptAction = function() {
                    notifications.remove( n );
                    this.stop();
                };

                this.savePromptAction = function() {
                    this.save();
                    notifications.remove( n );
                    this.stop();
                };

                _.bindAll( this, "doNotSavePromptAction", "savePromptAction" );

                n.addPromptAction( "No", this.doNotSavePromptAction );
                n.addPromptAction( "Yes", this.savePromptAction );

                notifications.addNotification( n );
            }
        };

        _.bindAll( this, "notificationPrompt" );

        this.save = function() {
            if (options.saveAction) {
                options.saveAction();
            }
        }

        this.saveTimerId = window.setTimeout( this.notificationPrompt, options.delay);
    };

    this.stop = function() {
        if (this.saveTimerId) {
            window.clearTimeout( this.saveTimerId );
        }
    };

    this.reset = function() {
        this.stop();
        this.start();
    };

    _.bindAll(this, "start", "stop", "reset" );
}


// #################################################################################################################
// Name: Logging
// Type: Neccessary setup configs for setting up log4javascript.
// #################################################################################################################

// Setup the default logging.
// TODO:  Logging appenders and layout formats should come from the server via the HTML and used to dynmically setup logging.
var log = log4javascript.getLogger();
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
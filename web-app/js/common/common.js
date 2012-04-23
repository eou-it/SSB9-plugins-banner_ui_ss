/*********************************************************************************
 Copyright 2009-2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is limited
 solely to SunGard Higher Education licensees, and is further subject to the terms
 and conditions of one or more written license agreements between SunGard Higher
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/
//IE fix to support indexOf method on Array objects
Array.prototype.indexOf=[].indexOf||function(a,b,c,r) {
    for(b=this,c=b.length,r=-1;~c;r=b[--c]===a?c:r);
    return r;
}

function encodeHTML(string) {
    if (string == null) return null;
    return string.toString().replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
}

function getUrl(name) {
    var url = $("#endpoint-" + name).attr('data-endpoint');

    if (url === null || url === undefined) {
        log.debug("#endpoint-" + name + " was not found or does not include a data-endpoint.");
    }

    return url;
}


function validateDate( dateString ) {
    //var dateFormat = $.i18n.prop("js.datepicker.dateFormat");
    var defaultCalendar = $.i18n.prop("default.calendar");
    var result = false;
    try {
        if($.multicalendar.isValidDateFormat(defaultCalendar, dateString)) {
        //if (dateString == $.datepicker.formatDate( dateFormat, $.datepicker.parseDate( dateFormat, dateString))){
            result = true;
        }
    } catch (e) {
      result = false;
    }

    return result;
}


window.InactivityTimer = ActivityTimer.extend({
    timeoutHandler: function() {
        var n = new Notification( {
            message: $.i18n.prop("js.notification.inactivityTimer.message"),
            type:"warning",
            promptMessage: $.i18n.prop("js.notification.inactivityTimer.promptMessage")
        });

        this.logoutAction = function( event ) {
            // Logout the user
            log.debug( "logout due to inactivity" );

            if (event && event.type === "click") {
                window.location = 'logout';
            }
            else {
                window.location = "logout/timeout";
            }
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
        60 * 1000 /** 60 seconds */ );

    },
    activityEvents: [ "ajaxStart" ],
    activityTarget: function() { return $(document); }
});


var inactivityTimer = new InactivityTimer({
    delay: (parseInt( $("meta[name='maxInactiveInterval']").attr( "content" ) ) - 90 /** Subtract 90 seconds to give a notification prior session invalidating **/ ) * 1000
});

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
        log.debug( "init SaveTimer" );
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


    $(document).ajaxComplete( function(event, jqXHR, ajaxOptions) {
        // We will inspect each response header.  If a customer header exists where we are requested to show the login page
        // we will inform the user that their session is no longer valid and that they have to log back in.
        if (jqXHR.getResponseHeader( "X-Login-Page" ) === "true") {

            var n = new Notification( {
                message: $.i18n.prop("js.com.sungardhe.banner.logout.timeout.message"),
                type:"warning",
                promptMessage: $.i18n.prop("js.com.sungardhe.banner.logout.timeout.promptMessage")
            });

            n.addPromptAction( $.i18n.prop("js.com.sungardhe.banner.logout.timeout.acknowledgement"), function() { window.location.reload() } );

            notifications.addNotification( n );
        }
    });

    // Initialize Aurora
    CommonPlatform.initialize( {
        standalone : true,
        globalNav : true,
        header : true,
        footer : true,
        showHelp: false,
        langDir: $.i18n.prop( "default.language.direction" ),
        resourceMap : {
            areas_label_browse :                    $.i18n.prop( "aurora.areas_label_browse" ),
            areas_label_opened :                    $.i18n.prop( "aurora.areas_label_opened" ),
            areas_label_tools :                     $.i18n.prop( "aurora.areas_label_tools" ),
            areas_label_browse_shortcut :           $.i18n.prop( "aurora.areas_label_browse_shortcut" ),
            areas_label_home_shortcut :             $.i18n.prop( "aurora.areas_label_home_shortcut" ),
            areas_label_opened_shortcut :           $.i18n.prop( "aurora.areas_label_opened_shortcut" ),
            areas_label_tools_shortcut :            $.i18n.prop( "aurora.areas_label_tools_shortcut" ),
            openitems_label_closeSelected :         $.i18n.prop( "aurora.openitems_label_closeSelected" ),
            openitems_label_closeAll :              $.i18n.prop( "aurora.openitems_label_closeAll" ),
            preferences_label :                     $.i18n.prop( "aurora.preferences_label" ),
            userdetails_signin :                    $.i18n.prop( "aurora.userdetails_signin" ),
            userdetails_signout :                   $.i18n.prop( "aurora.userdetails_signout" ),
            userdetails_help :                      $.i18n.prop( "aurora.userdetails_help" )
        },
        handler : function( data ) {
        }
    } );
});
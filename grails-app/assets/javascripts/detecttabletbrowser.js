(function ( $, _ ) {
    var pattern = /ipad|android/i,
        ua = navigator.userAgent;

    $.browser.tablet = !_.isNull( ua.match( pattern ) );
}).call( window, jQuery, _ );


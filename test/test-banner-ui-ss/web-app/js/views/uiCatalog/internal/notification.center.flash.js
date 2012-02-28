$(document).ready(function() {
    $(".notification-center-flash-warning").click(function(e) {
        var notification = new Notification({
            message: "I am a flashed warning message!",
            type:    "warning",
            flash:   true
        });

        notifications.addNotification(notification);
    });


    $(".notification-center-flash-error").click(function(e) {
        var notification = new Notification({
            message: "I am a flashed error message!",
            type:    "error",
            flash:   true
        });

        notifications.addNotification(notification);
    });

    $(".notification-center-flash-success").click(function(e) {
        var notification = new Notification({
            message: "I am a flashed success message!",
            type:    "success",
            flash:   true
        });

        notifications.addNotification(notification);
    });
});

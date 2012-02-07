$(document).ready(function() {
    $(".actual button.button-one").button({label: "Button 1"});
    $(".actual button.button-two").button();

    $(".actual button.button-one").click(function() {
        $(".actual .button-result").html($(this).button("option", "label"));
    });

    $(".actual button.button-two").click(function() {
        $(".actual .button-result").html($(this).button("option", "label"));
    });
});

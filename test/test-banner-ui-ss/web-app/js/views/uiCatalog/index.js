
//
// jEditable Utilities
//

function editableTypeDefaults(options) {
    return _.extend( {}, options, {
        onblur: function(val, settings) {
//                var form = $('form', this).submit();
        },
        placeholder: "",
        onedit: function() {
            /* no-op */
        },
        onreset: function() {
            /* no-op */
        }
    });
}

$(document).ready(function() {

    _.each($(".catalog-entry .code pre"), function(it) {
        var sane = encodeHTML($(it).html());
        $(it).empty();
        $(it).html(sane);
    });

    SyntaxHighlighter.all();

    //
    // page layout
    //

    $('#content').layout({
        applyDefaultStyles: true,
        defaults: {
            spacing_open: 13,
            spacing_closed: 13,
            togglerLength_open: 13,
            togglerLength_closed: 13
        },
        north: {
            slidable: false,
            resizable: false,
            spacing_open: 0,
            spacing_closed: 0
        },
        south: {
            slidable: false,
            resizable: false,
            spacing_open: 0,
            spacing_closed: 0
        },
        east: {
            size: 350
        },
        west: {
            size: 350
        }
    });

    //
    // non-HTML5 inputs
    //

    $('.number').editable(submit, { type: 'number', onblur: 'submit' });

    function submit(value, settings) {
        $(".button-result").html(value);
        return value;
    }

    //
    // display widget code event bindings
    //

    $(".widget-code.show-code").click(function(event) {
        var el = $(event.target);
        el.siblings(".code").slideDown();

        el.css("visibility", "hidden");
        el.siblings(".widget-code.hide-code").show();
    });

    $(".widget-code.hide-code").click(function(event) {
        var el = $(event.target);
        el.siblings(".code").slideUp();

        el.hide();
        el.siblings(".widget-code.show-code").css("visibility", "visible");
    });

    $(".code-demonstration").mouseenter(function(event) {
        var el = $(event.target).closest(".code-demonstration");

        if ($(".code", el).css("display") == "none") {
            $(".widget-code.show-code", el).css("visibility", "visible");
        }
    });

    $(".code-demonstration").mouseleave(function(event) {
        var el = $(event.target).closest(".code-demonstration");

        $(".widget-code.show-code", el).css("visibility", "hidden");
    });
});
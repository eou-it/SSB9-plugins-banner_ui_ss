
var submitOnce = function(form) {
    if (!form.data('submitted')) {
        form.submit();
        form.data('submitted',true);
    }
}

var datePickerOptions = editableTypeDefaults({
    name: "datePicketExample",
    type: "datepicker",
    datepicker: {
        onSelect: function(val,ui) {
            var form = ui.input.closest('form');
            submitOnce( form );
        },
        onClose: function(val,ui) {
            var form = ui.input.closest('form');
            submitOnce( form );
        }
    }
});

$(".date-picker-control-demo").editable(function (value, settings) {
        return value;
    },
    datePickerOptions
);

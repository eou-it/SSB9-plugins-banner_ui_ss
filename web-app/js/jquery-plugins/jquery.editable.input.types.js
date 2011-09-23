(function($) {
    /*
     * Create a 'validated input type that requires entered value to
     * pass validation function.
     * Requires:
     *     settings.validate( value ) -> numeric value, or false
     */
    $.editable.addInputType('validated', {
        element: function( settings, original ) {
            // any assertions about state
            // these will be invoked when the user first invokes the element
            if (!settings.validate) {
                throw 'Validated input element requires a validate function';
            }

            // add our input field markup
            var ele = $('<input />');
            $(this).append(ele);

            // return the input that holds the value and
            // controls onblur, etc.
            return ele;
        },
        submit: function( settings, original ) {
            /*
             * Update the hidden value in the form if the visible value validates,
             * otherwise, reset the form to the original value.
             */
            var ele = $('input', this);
            var value = settings.validate(ele.val(), settings, original);
            if (false === value ) {
                original.reset(this); // reset the value
                return false;
            } else {
                return true;
            }
        }
    });

    /*
     * return numeric value, or false
     */
    function validateNumber(value, settings, original) {
        if (isNaN(value)) {
            $(original).addClass('error');
            alert( 'Value: "' + value + '" must be a number.' );
            return false;
        } else {
            $(original).removeClass('error');
            return value;
        }
    }

    /*
     * create a validated input type that accepts only numeric values
     * Note the poor-man's inheritance.
     */
    var validatedTypeSettings = $.editable.types['validated'];
    var numericTypeSettings = $.extend( {}, validatedTypeSettings, {
        element: function( settings, original ) {
            settings.validate = settings.validate || validateNumber;
            return validatedTypeSettings.element.call( this, settings, original );
        }
    });
    $.editable.addInputType( 'numeric', numericTypeSettings );

    /*
     * create an input type that allows only numbers.
     *
     * Allows:
     *  numberOptions: map. default is {decimal:false, negative:false}
     */
    $.editable.addInputType( 'number', {
        element: function( settings, original ) {
            settings.numberOptions = settings.numberOptions || {decimal: false, negative: false};

            // add our input field markup
            var ele = $(settings.element || '<input />');
            $(this).append(ele);
            $(ele).numeric(settings.numberOptions);

            // return the input that holds the value and
            // controls onblur, etc.
            return ele;
        }
    });
})(jQuery);

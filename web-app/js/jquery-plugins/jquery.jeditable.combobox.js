/*
 * $(...).combobox( options ) makes an input element into an autoselect combobox.
 * based on jQuery UI autocomplete combobox example.
 */
(function( $ ) {
	$.widget( "ui.combobox", {
		_create: function() {
			var self = this,
            input = this.input = this.element;
            input.addClass('combobox');
            input.autocomplete( this.options ).attr('style','') //autocomplete adds a style attribute
				.addClass( "ui-widget ui-widget-content ui-corner-left" );

			this.button = $( "<button type='button'>&nbsp;</button>" )
				.attr( "tabIndex", -1 )
				.attr( "title", "Show All Items" )
				.insertAfter( input )
				.button({
					text: true,
                    label:'...'
				})
				.removeClass( "ui-corner-all" ).removeClass( "ui-icon-only" )
                .addClass( "combobox" )
				.addClass( "ui-corner-right" )
				.click(function() {
					// close if already visible
					if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
						input.autocomplete( "close" );
						return;
					}

                    // copied the following from original, but haven't seen the bug...
                    // needed to work around a bug (likely same cause as #5265)
					//$( this ).blur();

					// pass empty string as value to search for, displaying all results
					input.autocomplete( "search", "" );
					input.focus();
				});
		},

		destroy: function() {
			this.button.remove();
			$.Widget.prototype.destroy.call( this );
		}
	});


    ////////// create an editable 'combobox' type
    
    // enhance the focus selector to support elements that can't usually be focused
    // hesitant to modify ':focus', but copied from jquery.jeditable.datepicker.js
    // redundant with datepicker, but necessary here if combobox is used in isolation
    jQuery.expr[':'].focus = function( elem ) {
        return elem === document.activeElement && ( elem.type || elem.href );
    };
    
    var onclosedelay = 150,
        onblurdelay = onclosedelay + 150;
    
    /*
     * editable inputType 'combobox' provides an autocomplete with a button
     * to restrict to just the values in the source data, do $(...).editable( submitFunc, {
     *     validate: function(value, settings, original) {
     *          return _.include(settings.combobox.data, value) ? value : false;
     *      }, ... });
     */
    $.editable.addInputType('combobox', {
        element : $.editable.types.text.element,
        submit:function(settings, original){
            // from validated input type jquery.editable.input.types.js
            // Update the hidden value in the form if the visible value validates,
            // otherwise, reset the form to the original value.
            if (settings.validate && !settings.validate($('input',this).val(), settings, original)) {
                original.reset(this); //!! do we need an alert msg?
                return false;
            } else {
                return true;
            }
        },
        plugin : function(settings, original) {
            var form = this,
                input = form.find('input');
            var isOpen = false;
            settings.onblur = function() {
                setTimeout( function() {
                    if (!isOpen) { // clicked elsewhere
                        original.reset( form );
                    }
                    // otherwise, lost focus because dropdown opened, so do nothing
    
                    // the delay is necessary to allow the dropdown to be closed
                    // and the submit to have occurred (in the close callback below).
                }, onblurdelay); 
            };
            var combobox = {
                source: settings.combobox.data,
                minLength: 0,
                delay:0,
                open:function(evt,ui){
                    isOpen = true;
                },
                close:function(evt,ui){
                    isOpen = false;
                    // from jquery.jeditable.datepicker.js
                    setTimeout( function() {
                        if ( !input.is( ':focus' ) ) {
                            // input has NO focus after 150ms which means
                            // dropdown was closed due to click outside of it
                            // so let's close the input field without saving
                            original.reset( form );
                        } else {
                            // input still HAS focus after 150ms which means
                            // dropdown was closed due to Enter in the input field
                            // so lets submit the form and close the input field
                            form.submit();
                        }
    
                        // the delay is necessary; dropdown must be already
                        // closed for the above :focus checking to work properly;
                        // without a delay the form is submitted in all scenarios, which is wrong
                    }, onclosedelay );
                },
            };
            if (settings.combobox) {
                jQuery.extend(combobox, settings.combobox);
            }
            input.combobox(combobox);
        },
    });
})( jQuery );

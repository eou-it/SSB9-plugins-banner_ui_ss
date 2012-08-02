( function ( $, _ ) {
    $.widget("ui.textbox", {

        // default options
        options: {
              html : "<input/>",
              model : null,
              name : "input1",
              form : ""
        },
        _create: function() {

            // render
            var sibling = $(this.options.form).find(this.options.sibling)
            if (sibling){
                sibling.before(this.options.html);
            } else {
                $(this.options.form).append( this.options.html);
            }

            Backbone.ModelBinding.bind(this.options.boundForm);

        }
    });

} ).call( this, $, _ );
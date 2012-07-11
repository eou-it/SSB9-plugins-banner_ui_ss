( function ( $, _ ) {
    $.widget("ui.pillbox", {
        options: {
            styles: {
                container: "ui-pillbox",
                highlight: "ui-state-highlight",
                disabled:  "ui-state-disabled",
                normal:    "ui-state-default"
            },
            items: [
                // { name: String, abbreviation: String, enabled: Boolean (Default true), highlight: Boolean (Default false) }
            ]
        },
        elements: {
            div:  "<div></div>",
            span: "<span></span>",
            ul:   "<ul></ul>",
            li:   "<li></li>"
        },
        _create: function() {
            var self    = this,
                list    = $( this.elements.ul ),
                tooltip = [ ],
                el      = $( this.element );

            el.addClass( this.options.styles.container );

            _.each( this.options.items, function ( it ) {
                var item = $( self.elements.li ).addClass( self.options.styles.normal );

                if ( !it.enabled )
                    item.addClass( self.options.styles.disabled );

                if ( it.highlight ) {
                    item.addClass( self.options.styles.highlight );

                    tooltip.push( it.name );
                }

                item.append( $( self.elements.div ).text( it.abbreviation ) );

                list.append( item );
            });

            el.append( list );

            var tooltipText = tooltip.length > 0 ? tooltip.join( $.i18n.prop( "ui.pillbox.tooltip.separator" ) ) : $.i18n.prop( "default.none" );

            el.attr( "title", $.i18n.prop( "ui.pillbox.tooltip.label", [ tooltipText ] ) );

            if ( _.isFunction( self.element.tooltip ) )
                el.tooltip();
        }
    });

} ).call( this, $, _ );
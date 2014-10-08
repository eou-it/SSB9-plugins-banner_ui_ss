( function ( $, _ ) {
    $.widget("ui.pillbox", {
        options: {
            styles: {
                container: "ui-pillbox",
                highlight: "ui-state-highlight",
                disabled:  "ui-state-disabled",
                normal:    "ui-state-default",
                screenReader: "screen-reader"
            },
            editable: false,
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
        updateItemState: function (el, highlight) {
            var $el = $(el),
                name = $el.attr( "data-name" ),
                flag = _.isUndefined(highlight) ? !$(el).is('.' + this.options.styles.highlight) : highlight;
                text = flag ?
                    $.i18n.prop( "ui.pillbox.on", [name] ) :
                    $.i18n.prop( "ui.pillbox.off", [name] );

            $el.toggleClass( this.options.styles.highlight, flag ).find('.' + this.options.styles.screenReader).text( text );
        },
        updateTooltipText: function () {
            var items = _.map( $( this.element ).find ( "." + this.options.styles.highlight ), function ( it ) {
                return $( it ).attr( "data-name" );
            });

            var tooltipText = items.length > 0 ? items.join( $.i18n.prop( "ui.pillbox.tooltip.separator" ) ) : $.i18n.prop( "default.none" );

            $( this.element ).attr( "title", $.i18n.prop( "ui.pillbox.tooltip.label", [ tooltipText ] ) );
        },
        _create: function() {
            var self    = this,
                list    = $( this.elements.ul ),
                el      = $( this.element );

            el.addClass( this.options.styles.container ).attr( "tabindex", 0 );

            var toggleSelected = function ( el ) {
                if ( !$( el ).hasClass( self.options.styles.disabled ) ) {
                    self.updateItemState( el );
                    self.updateTooltipText();
                }
            };

            var onClick = function ( e ) {
                var el = $( e.target ).is( "li" ) ? $( e.target ) : $( e.target ).closest( "li" );

                toggleSelected( el );

                e.preventDefault();
                e.stopPropagation();
            };

            var onKeypress = function ( e ) {
                var key = e.keyCode ? e.keyCode : e.which;

                if ( key == 32 || key == 13 ) {
                    var el = $( e.target ).is( "li" ) ? $( e.target ) : $( e.target ).closest( "li" );

                    toggleSelected( el );

                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            _.each( this.options.items, function ( it ) {
                var item = $( self.elements.li ).addClass( self.options.styles.normal );

                if ( !it.enabled )
                    item.addClass( self.options.styles.disabled );

                item.attr( "data-name", it.name );
                item.attr( "data-abbreviation", it.abbreviation );

                item.append( $( self.elements.div ).text( it.abbreviation ).attr('aria-hidden','true' ) );
                item.append( $( self.elements.span ).addClass( self.options.styles.screenReader ).attr( 'aria-live', 'assertive'));

                self.updateItemState( item, it.highlight )

                if ( self.options.editable ) {
                    item.attr( "tabindex", 0 );

                    item.click( onClick );
                    item.keypress( onKeypress );
                }


                list.append( item );
            });

            el.append( list );

            this.updateTooltipText();

            // if ( _.isFunction( self.element.tooltip ) )
            //     el.tooltip();
        }
    });

} ).call( this, $, _ );

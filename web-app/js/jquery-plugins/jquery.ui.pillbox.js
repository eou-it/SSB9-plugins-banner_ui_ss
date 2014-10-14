( function ( $, _ ) {
    $.widget("ui.pillbox", {
        options: {
            styles: {
                container: "ui-pillbox",
                highlight: "ui-state-highlight",
                disabled:  "ui-state-disabled",
                normal:    "ui-state-default",
                summary:   "ui-pillbox-summary"
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

            $el.toggleClass( this.options.styles.highlight, flag ).attr('aria-checked', flag ? 'true' : 'false');
            //editable:$el.screenReaderLabel(text, 'assertive');
        },
        updateTooltipText: function () {
            var items = _.map( $( this.element ).find ( "." + this.options.styles.highlight ), function ( it ) {
                return $( it ).attr( "data-name" );
            });

            var tooltipText = items.length > 0 ? items.join( $.i18n.prop( "ui.pillbox.tooltip.separator" ) ) : $.i18n.prop( "default.none" );

            $( this.element ).attr( "title", $.i18n.prop( "ui.pillbox.tooltip.label", [ tooltipText ] ) );

            //editable:$( this.element ).screenReaderLabel( tooltipText, 'assertive' );
            $( "." + this.options.styles.summary, this.element ).screenReaderOnly().text( tooltipText );
        },
        _create: function() {
            var self    = this,
                summary = $( this.elements.div ).addClass(this.options.styles.summary),
                list    = $( this.elements.ul ),
                el      = $( this.element );

            el.addClass( this.options.styles.container ).attr( "tabindex", 0 ).attr('role','group');

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
                var tabindex = 0;

                if ( !it.enabled ) {
                    item.addClass( self.options.styles.disabled ).attr({
                        'aria-disabled': 'true'
                    });
                    tabindex=-1;
                } else if ( self.options.editable ) {
                    item.attr( "tabindex", 0 ).attr('role','checkbox')
                        .click( onClick )
                        .keypress( onKeypress );
                }

                item.attr( "data-name", it.name );
                item.attr( "data-abbreviation", it.abbreviation );

                item.append( $( self.elements.div ).text( it.abbreviation ));

                self.updateItemState( item, it.highlight );

                list.append( item );
            });

            if ( !self.options.editable ) {
                list.screenReaderHide(true);
            }
            el.append( summary );
            el.append( list );

            this.updateTooltipText();

            // if ( _.isFunction( self.element.tooltip ) )
            //     el.tooltip();
        }
    });

} ).call( this, $, _ );

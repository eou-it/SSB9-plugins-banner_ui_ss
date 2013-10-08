(function ( $, _, Backbone ) {

  Backbone.ButtonMenu = Backbone.View.extend({
    name: "",
    items: [ ],
    callback: null,

    css: {
      buttonMenuItemCheckbox: "button-menu-item-checkbox",
      buttonMenuContainer:    "button-menu-container",
      buttonMenuOverlay:      "button-menu-overlay"
    },

    elements: {
      div:      "<div></div>",
      ul:       "<ul></ul>",
      li:       "<li></li>",
      label:    "<label></label>",
      checkbox: "<input type='checkbox'/>",
    },

    events: {
      "click .button-menu-item-checkbox": "toggleItem",
      "click": "toggleMenu"
    },

    strings: {
      buttonLabel:  null,
      itemIdPrefix: "menuItemId"
    },

    toggleMenu: function ( e ) {
      var view = this;

      if ( $( "." + this.css.buttonMenuContainer ).is( ":visible" ) ) {
        $( "." + this.css.buttonMenuOverlay ).unbind( "click" ).remove();
      } else {
        var overlay = $( this.elements.div ).addClass( this.css.buttonMenuOverlay )
                                            .height( $( document ).height() )
                                            .click( function ( e ) { view.toggleMenu(); } );
        $( "body" ).append( overlay );
      }

      if ( $( "." + this.css.buttonMenuContainer ).is( ":visible" ) ) {
        this.removeMenu();
      } else {
        this.renderMenu();
      }
    },

    toggleItem: function ( e ) {
      var name = $( e.target ).attr( "data-name" ),
          item = _.find( this.items, function ( it ) { return it.name == name; } );

      item.checked = ( item.checked == true ? false : true );

      if ( _.isFunction( this.callback ) )
        this.callback.call( this, item, e );
    },

    initialize: function () {
      if ( this.strings.buttonLabel === null ) {
          this.strings.buttonLabel = $.i18n.prop( "js.grid.columns.button" );
      }
      this.items    = this.options.items    || [ ];
      this.callback = this.options.callback || null;
      this.container = this.options.container || this.$el.parent();

      var self = this;
      var resizeButton = function() {
        self.$el.height( self.container.height() ).
          position({
            of: self.container,
            my: "right top",
            at: "right top",
            collision: "none"
          });
      };
      $(self.container).mutate( 'height top width', resizeButton );
      _.defer( resizeButton );
    },

    removeMenu: function () {
      $( "." + this.css.buttonMenuContainer + " input[type=checkbox]" ).unbind( "click" );
      $( "." + this.css.buttonMenuContainer ).remove();
    },

    renderMenu: function () {
      var view = this,
          ul   = $( this.elements.ul );

      _.each( this.items, function ( it, idx ) {
        var label = $( view.elements.label ),
            input = $( view.elements.checkbox ).addClass( view.css.buttonMenuItemCheckbox ),
            li    = $( view.elements.li ),
            id    = _.string.camelize( view.strings.itemIdPrefix + view.name + idx );

        if ( it.checked )
          input.attr( "checked", "checked" );

        if ( !_.isUndefined( it.name ) )
          input.attr( "data-id", it.id );

        if ( !_.isUndefined( it.name ) )
          input.attr( "data-name", it.name );

        input.click( function ( e ) {
          view.toggleItem.call( view, e );
        });

        input.attr( "id", id );
        label.attr( "for", id ).text( it.title );

        li.append( input ).append( label );
        ul.append( li );
      });

        $( "body" ).remove( this.css.buttonMenuContainer ).append( $( this.elements.div ).addClass( this.css.buttonMenuContainer ).append( ul ) );

      $( "." + this.css.buttonMenuContainer ).position({
        of: this.$el,
        my: "right top",
        at: "right bottom",
        collision: "fit"
      });
    },

    render: function () {
        this.$el.attr( 'title', this.strings.buttonLabel );
    }

  });
}).call (this, $, _, Backbone);

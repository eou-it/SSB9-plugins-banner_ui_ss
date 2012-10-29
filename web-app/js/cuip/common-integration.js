var Encoder = {
    //properties
    /**
     * @private
     */
    _keyString: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // methods
    /**
     * Encodes the supplied input.
     * @param {string} input The string to encode.
     */
    encode: function(input) {
        if ( !_.isString( input ) )
            input = JSON.stringify( input );

        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output
                   + this._keyString.charAt(enc1)
                   + this._keyString.charAt(enc2)
                   + this._keyString.charAt(enc3)
                   + this._keyString.charAt(enc4);

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },
    /**
     * Decodes the supplied input.
     * @param {string} input The encoded string to decode.
     */
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4 = "";
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this._keyString.indexOf(input.charAt(i++));
            enc2 = this._keyString.indexOf(input.charAt(i++));
            enc3 = this._keyString.indexOf(input.charAt(i++));
            enc4 = this._keyString.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    }
};


var Messenger = {
    commtype:            "hash",
    channel:             "about:blank",
    channelIframeSource: "/upcomm.html",
    supportedChannels:   [ "hash", "xdm" ],
    supportsXDM:         false,
    origin:              "*",
    messageHandler:      null ,

    initialize: function( callback ) {
        var message = this.checkFragmentIdentifier();

        if ( message == null )
            window.location.hash = "none";
        else {
            var deepLink = message;
        }

        if ( _.isFunction( callback ) )
            this.messageHandler = callback;

        if ( window.postMessage ) {
            this.commtype    = "xdm";
            this.supportsXDM = true;

            // establish XDM listeners, regardless of the communication channel this child uses.
            if ( window.addEventListener )
                window.addEventListener( 'message', this.handleCrossDomainMessage, false );
            else
                window.attachEvent( 'onmessage', this.handleCrossDomainMessage, false );
        }
        else {
            this.commtype = "hash";

            setInterval(this.pollFragmentIdentifier, 250);
        }

        if ( message != null
          && !_.isString( message )
          && !_.isUndefined( message["context"]["host"] ) ) {
            this.setCommunicationChannel( message.context.host );
        }

        //ErrorManager.show('commtype: ' + this.commtype + ', channel: ' + this.channel);
    },

    /**
     * @private
     *
     * Sets the reference for the parent's URL. This function is called automatically
     * during by initialize(). It will also establish the channel iframe if using 'hash' based
     * communication.
     *
     * @param {String} parentURL The host parent's URL. (optional)
     */
    setCommunicationChannel: function( parentURL ) {
        this.channel = parentURL + this.channelIframeSource;

        if ( this.commtype == "hash" ) {
            var channelIFrame = document.createElement("iframe");
            channelIFrame.setAttribute("id",    "up_comm");
            channelIFrame.setAttribute("name",  "up_comm");
            channelIFrame.setAttribute("src",   "about:blank");
            channelIFrame.style.display = "none";

            document.body.appendChild( channelIFrame );
        }
    },

    /**
     * @private
     *
     * Checks the URL fragment identifier (hash) for messages.
     */
    checkFragmentIdentifier: function() {
        var frag = window.location.hash;

        if ( frag && frag.substr( 1 ) != "none" )
            return ( frag.indexOf( "/" ) == -1 ? this.getJsonFromFragment( frag ) : frag.substr( 1 ) );
        else
            return null;
    },

    /**
     * @private
     *
     * Polls the URL fragment identifier (hash) for changes.
     */
    pollFragmentIdentifier: function() {
        var frag = Messenger.checkFragmentIdentifier();

        if ( frag ) {
            if ( _.isFunction( this.messageHandler ) )
                this.messageHandler( frag );
            else
                ErrorManager.show( 'pollFragmentIdentifier: no messageHandler established' );
        }
    },

    getJsonFromFragment: function( fragment ) {
        return JSON.parse( this.decode( fragment ) );
    },

    handleCrossDomainMessage: function( xdmEvent ) {
        if ( _.isFunction( Messenger.messageHandler ) )  {
            var msg = xdmEvent.data;

            if ( _.isString( msg ) ) {
                msg = ( xdmEvent.data.match( /[A-Za-z0-9+/=]/ ) != null ? Encoder.decode( msg ) : msg );
                msg = JSON.parse( msg );
            }

            console.log( "XDM " + msg.type + " message recieved" );

            Messenger.messageHandler( msg );
        } else {
            ErrorManager.show('handleCrossDomainMessage: no messageHandler established!');
        }
    },

    send: function( json ) {
        var message = this.encode( JSON.stringify( json ) );

        switch ( this.commtype ) {
            case "hash":
                try {
                    document.getElementById('up_comm').src = this.channel + "#" + message;
                } catch (e) {
                    ErrorManager.show("An exception occurred in the script. Error name: " + e.name + ". Error message: " + e.message)
                }
                break;
            case "xdm":
                parent.postMessage( message, this.origin );
                break;
            default:
                ErrorManager.show("No communication method has been defined.");
                break;
        }
    },

    /**
     * Supports passing of callback handlers for responses recieved
     * Places messages on the proper communication channel.
     *
     * @param {String} message The XML message to send.
     */
    load: function( url, callback ) {
        EventDispatcher.addEventListener( url, callback );

        message = this.createServiceCallMessage( url );

        Messenger.send( message );
    },

    encode: function(input) {
        return Encoder.encode(input);
    },

    decode: function( input ) {
        if ( input.substring( 0, 1 ) == "#" ) {
            input = input.substr( 1 );
        }

        return Encoder.decode( input );
    },

    createStyleMessage: function() {
        var message = {
            type:  "style",
            style: Theme.custom
        };

        return message;
    },

    createRequestMessage: function( message ) {
        return {
            type:    "request",
            request: message
        };
    },

    createHostMessage: function( message ) {
        return {
            type: "host",
            host: message
        };
    },

    createContextMessage: function( context ) {
        var message = {
            type:    "context",
            context: context
        };

        _.extend( message, this.createStyleMessage() );

        return message;
    },

    createNameValuePairMessage: function( values ) {
        return {
            type:   "values",
            values: values
        };
    },

    broadcastHelpMessageByURL: function( url ) {
        Messenger.send( this.createHelpMessageByURL( url ) );
    },

    createHelpMessageByURL: function( url ) {
        return {
            type: "help",
            help: { url: url }
        };
    },

    createNavigationMessageByLocation: function( locationEntry ) {
        return {
            type:     "navigate",
            navigate: { location: locationEntry }
        };
    },

    createApplicationPageNavigationMessage: function( pageName ) {
        return {
            type: "navigate",
            page: pageName
        };
    },

    createStatusMessage: function( message ) {
        return {
            type:   "status",
            status: message
        };
    },

    createErrorMessage: function( errors ) {
        var out = {
            type:   "error",
            errors: [ ]
        };

        if ( _.isString( errors ) ) {
            out.errors.push( { message: errors } );
        } else if ( _.isArray( errors ) ) {
            _.each( errors, function ( it ) {
                if ( _.isString( it ) )
                    errors.push( { message: it } );
                else
                    errors.push( { code: it.code, message: it.message } );
            });
        }

        return out;
    },

    // title:     string
    // message:   string
    // responses: [ { label: string, response: value } ]
    createConfirmationMessage: function( title, message, responses ) {
        var out = {
            type: "confirmation",
            confirmation: {
                title:     title,
                message:   message,
                responses: responses
            }
        };

        return out;
    },

    createConfirmationResponseMessage: function( response ) {
        return {
            type: "confirmationResponse",
            confirmationResponse: response
        };
    },

    createServiceCallMessage: function( url ) {
        return {
            type: "service",
            service: url
        };
    },

    createServiceResponseMessage: function( response, url ) {
        return {
            type: "serviceResponse",
            serviceResponse: { response: response, url: url }
        };
    }
};


var ErrorManager = {
    show: function ( message ) {
        switch( typeof( message ) ) {
            case 'string':
                MessageProcessor.processMessage( Messenger.encode( Messenger.createErrorMessage( message ) ) );
                break;
            case 'array':
                MessageProcessor.processMessage( Messenger.encode( Messenger.createErrorMessage("got an array of error messages" ) ) );
                break;
            default:
                break;
        }
    }
};


var CookieManager = {
    /**
     * @private
     * Domain name to define the cookie for. TODO: external config somehow
     */
    DOMAIN: "ellucian.com",
    /**
     * Cookie name for the default home for the user.
     */
    MAGELLAN_HOME_COOKIE: "sghe_magellan_home",
    /**
     * Cookie name for the default home for the user.
     */
    MAGELLAN_COOKIE_MARKER: "sghe_magellan_",
    /**
     * Creates a new cookie or modifies an existing cookie.
     * @param {string} name The name for the cookie.
     * @param {string} value The value for the cookie.
     * @param {string} domain The domain the cookie is applicable to.
     */
    set: function(name, value, domain, minutes) {
        var ttl = 7200;

        var name = CookieManager.MAGELLAN_COOKIE_MARKER + CommonContext.user + "_" + name;

        if (minutes) {
            ttl = minutes;
        }

        var date = new Date();
        date.setTime(date.getTime()+(ttl*60*1000));

        var expires = "expires=" + date.toGMTString();

        document.cookie = name + "=" + value + "; " + expires + "; path=/; domain=" + CookieManager.DOMAIN;
    },
    /**
     * Returns the specified cookie, if it exists.
     * @param {string} name The name of the cookie to retrieve.
     */
    get: function(name) {
        var name = CookieManager.MAGELLAN_COOKIE_MARKER + CommonContext.user + "_" + name + "=";
        var cookies = document.cookie.split(';');
        for (var i=0; i < cookies.length; i++) {
            var c = ' ' + cookies[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);

                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
        }
        return null;
    },
    /**
     * Removes a cookie.
     * @param {string} name The name of the cookie to remove.
     */
    remove: function(name, domain) {
        document.cookie = name + "=; expires=-1; path=/; domain=" + CookieManager.DOMAIN;
    }
};

function EventListener(type, listener) {
    this.type = type;
    this.listener = listener;
}

EventListener.prototype.getType = function() {
    return this.type;
}

EventListener.prototype.getListener = function() {
    return this.listener;
}

/**
 * @class Handles dispatched events and executes the cooresponding callback methods that are defined.
 * @author jmiller
 */
var EventDispatcher = {
    /**
     * @private
     *
     * The bound event listeners.
     */
    listeners: [],
    /**
     * Adds an event listener.
     *
     * @param {String} type The type of the event.
     * @param {Function} listener The listener to invoke when the event is dispatched.
     */
    addEventListener: function(type, listener) {
        if (!(type instanceof EventListener)) {
            type = new EventListener(type, listener);
        }

        if (!EventDispatcher.hasEventListener(type)) {
            EventDispatcher.listeners.push(type);
        }
    },
    /**
     * Dispatches the specified event.
     *
     * @param {String} type The type of the event.
     */
    dispatchEvent: function(type, data) {
        for (var x = 0; x < EventDispatcher.listeners.length; x++) {
            if (EventDispatcher.listeners[x].getType() == type) {
                EventDispatcher.listeners[x].getListener()(data);
            }
        }
    },
    /**
     * Determines if an event listener is defined for the specified event type.
     *
     * @param {String} type The type of the event.
     */
    hasEventListener: function(type) {
        if (type instanceof EventListener) {
            for (var x = 0; x < EventDispatcher.listeners.length; x++) {
                if (EventDispatcher.listeners[x].getType() == type.getType()
                 && EventDispatcher.listeners[x].getListener() == type.getListener()) {
                    return true;
                }
            }
        } else {
            for (var x = 0; x < EventDispatcher.listeners.length; x++) {
                if (EventDispatcher.listeners[x].getType() == type) {
                    return true;
                }
            }
        }

        return false;
    },
    /**
     * Removes an event listener.
     *
     * @param {String} type The type of the event.
     * @param {Function} listener The listener to invoke when the event is dispatched.
     */
    removeEventListener: function(type, listener) {
        for (var x = 0; x < EventDispatcher.listeners.length; x++) {
            if (EventDispatcher.listeners[x].getType() == type) {
                EventDispatcher.listeners.splice(x, 1);
                return true;
            }
        }
        return false;
    }
}

/**
 * @class Helper class to simplify XML parsing.
 * @author jmiller
 */
var XMLHelper = {
    /**
     * Cross-browser compatible access to the data in a specified XML Element.
     * @param {XMLDocument} xmldoc The XML document (or document fragment) to parse.
     * @param {string} name The name of the element to retrieve the data from.
     */
    getElementData: function(xmldoc, name) {
        var val = null;

        if (xmldoc.getElementsByTagName(name).length > 0) {
            if (xmldoc.getElementsByTagName(name)[0].textContent) {
                val = xmldoc.getElementsByTagName(name)[0].textContent;
            } else {
                val = xmldoc.getElementsByTagName(name)[0].text;
            }
        }
        return val;
    },
    /**
     * Returns a single child element using its index in the supplied XMLDocument.
     *
     * @param {XMLDocument} xmldoc
     * @param {String} name
     * @param {Number} index
     */
    getChildByIndex: function(xmldoc, name, index) {
        var children = XMLHelper.getChildren(xmldoc, name);

        if (children
         && children[index]) {
            return children[index];
        }
        return null;
    },
    /**
     * Returns all child elements matching the specified name.
     *
     * @param {XMLDocument} xmldoc
     * @param {String} name
     */
    getChildren: function(xmldoc, name) {
        if (xmldoc.getElementsByTagName(name).length > 0) {
            return xmldoc.getElementsByTagName(name);
        }
        return null;
    },
    /**
     * Returns the first child element matching the specified name.
     *
     * @param {XMLDocument} xmldoc
     * @param {String} name
     */
    getFirstChild: function(xmldoc, name) {
        return XMLHelper.getChildByIndex(xmldoc, name, 0);
    }
};

/**
 * @author jmiller
 */
var StyleManager = {
    getRule: function(selector) {
        var sheets = document.styleSheets;

        for (var x = 0; x < sheets.length; x++) {
            var sheet = sheets.item(x);

            var rules = null;

            if (sheet.cssRules) {
                rules = sheet.cssRules;
            } else {
                rules = sheet.rules;
            }

            for (var y = 0; y < rules.length; y++) {
                if (rules.item(y).selectorText == selector) {
                    return rules.item(y);
                }
            }
        }
        return null;
    },
    getStyle: function(selector, property) {
        var rule = StyleManager.getRule(selector);

        if (rule
         && rule.style
         && rule.style[property]) {
            return rule.style[property];
        }
        return null;
    },
    setStyle: function(selector, property, value) {
        var rule = StyleManager.getRule(selector);

        if (!rule) {
            return;
        }

        if (rule.style) {
            rule.style[property] = value;
        }
    }
};

/**
 * @author jmiller
 */
var Theme = {
    themes: {
        institution: {
            colors: {
                primary: "#4d1f5c",
                secondary: "#aa1064",
                selection: "#d9f4fb",
                interaction: "#d9f4fb"
            },
            backgrounds: {
                primary: "url('/AuroraApp/cuip/css/images/areas_background_gradient.png') repeat-x bottom left",
                institutionLogo: "url('/AuroraApp/cuip/css/images/ellucian-university-logo-sm-black.png') no-repeat"
            },
            text: {
                primary: {
                    color: "#5c5c5c"
                },
                secondary: {
                    color: "#294478"
                }
            }
        },
        spring: {
            colors: {
                primary: "#a7de9b",
                secondary: "#2e7835",
                selection: "#a5deb4",
                interaction: "#cae3ae"
            },
            backgrounds: {
                primary: "url('/AuroraApp/cuip/css/images/backgrounds/canyon.png') repeat-x bottom left",
                institutionLogo: "url('/AuroraApp/cuip/css/images/ellucian-university-logo-sm-dropshadow.png') no-repeat"
            },
            text: {
                primary: {
                    color: "#ffffff"
                },
                secondary: {
                    color: "#ffffff"
                }
            }
        },
        summer: {
            colors: {
                primary: "#e02f2f",
                secondary: "#bd3838",
                selection: "#f2a2c1",
                interaction: "#e7b2e8"
            },
            backgrounds: {
                primary: "url('/AuroraApp/cuip/css/images/backgrounds/summer.png') repeat-x bottom left",
                institutionLogo: "url('/AuroraApp/cuip/css/images/ellucian-university-logo-sm-dropshadow.png') no-repeat"
            },
            text: {
                primary: {
                    color: "#edc2c2"
                },
                secondary: {
                    color: "#edc2c2"
                }
            }
        },
        fall: {
            colors: {
                primary: "#ffffeb",
                secondary: "#d69200",
                selection: "#e0a77e",
                interaction: "#bd6b38"
            },
            backgrounds: {
                primary: "url('/AuroraApp/cuip/css/images/backgrounds/fall.png') repeat-x bottom left",
                institutionLogo: "url('/AuroraApp/cuip/css/images/ellucian-university-logo-sm-dropshadow.png') no-repeat"
            },
            text: {
                primary: {
                    color: "#5c5c5c"
                },
                secondary: {
                    color: "#294478"
                }
            }
        },
        winter: {
            colors: {
                primary: "#b293ed",
                secondary: "#8653d9",
                selection: "#a5a2f2",
                interaction: "#b2c2e8"
            },
            backgrounds: {
                primary: "url('/AuroraApp/cuip/css/images/backgrounds/winter_alpha.png') repeat-x bottom left",
                institutionLogo: "url('/AuroraApp/cuip/css/images/ellucian-university-logo-sm-dropshadow.png') no-repeat"
            },
            text: {
                primary: {
                    color: "#754091"
                },
                secondary: {
                    color: "#490e54"
                }
            }
        },
        wild: {
            colors: {
                primary: "#e8cfcf",
                secondary: "#a388a0",
                selection: "#dea5a5",
                interaction: "#edd6d0"
            },
            backgrounds: {
                primary: "url('/AuroraApp/cuip/css/images/backgrounds/blue_tile.png') repeat-x bottom left",
                institutionLogo: "url('/AuroraApp/cuip/css/images/ellucian-university-logo-sm-dropshadow.png') no-repeat"
            },
            text: {
                primary: {
                    color: "#ffffff"
                },
                secondary: {
                    color: "#ffffff"
                }
            }
        },
        blueflowers: {
            colors: {
                primary: "#b293ed",
                secondary: "#8653d9",
                selection: "#a5a2f2",
                interaction: "#b2c2e8"
            },
            backgrounds: {
                primary: "url('/AuroraApp/cuip/css/images/backgrounds/blue_flowers.png') repeat-x bottom left",
                institutionLogo: "url('/AuroraApp/cuip/css/images/ellucian-university-logo-sm-dropshadow.png') no-repeat"
            },
            text: {
                primary: {
                    color: "#ffffff"
                },
                secondary: {
                    color: "#ffffff"
                }
            }
        }
    },
    defaultTheme: "institution",
    currentThemeName: null,
    custom: {
        colors: {
            primary: "#76afdc",
            secondary: "#0084d5",
            selection: "#d9f4fb",
            interaction: "#d9f4fb"
        },
        backgrounds: {
            primary: "url('/AuroraApp/cuip/css/images/areas_background_gradient.png') repeat-x bottom left",
            institutionLogo: "url('/AuroraApp/cuip/css/images/SHGE_uni_logo_small_new.png') no-repeat"
        },
        text: {
            primary: {
                color: "#5c5c5c"
            },
            secondary: {
                color: "#294478"
            }
        }
    },
    save: function() {
        CookieManager.set("theme", Theme.currentThemeName);

        for (var x in Theme.custom.colors) {
            CookieManager.set("color_" + x, Theme.custom.colors[x]);
        }
        for (var x in Theme.custom.backgrounds) {
            CookieManager.set("bg_" + x, Theme.custom.backgrounds[x]);
        }
        for (var x in Theme.custom.text) {
            for (var y in Theme.custom.text[x]) {
                CookieManager.set("text_" + x + "_" + y, Theme.custom.text[x][y]);
            }
        }
    },
    getTheme: function(name) {
        return Theme.themes[name];
    },
    getDefaultTheme: function() {
         for (var x in Theme.themes) {
             if (Theme.defaultTheme == x) {
                return Theme.themes[x];
             }
         }
         return false;
    },
    load: function() {
        var theme = CookieManager.get("theme");

        if (!theme) {
            Theme.setTheme(Theme.defaultTheme);
        } else {
            if (theme != "custom"
             && Theme.getTheme(theme)) {
                Theme.setTheme(theme);
                return;
            }
        }

        for (var x in Theme.custom.colors) {
            var hex = CookieManager.get("color_" + x);

            if (hex) {
                Theme.custom.colors[x] = hex;

                switch(x) {
                    case "primary":
                        Theme.setPrimaryColor();
                        $('#primaryColorSelector').ColorPickerSetColor(Theme.custom.colors.primary);
                        break;
                    case "secondary":
                        Theme.setSecondaryColor();
                        $('#secondaryColorSelector').ColorPickerSetColor(Theme.custom.colors.secondary);
                        break;
                    case "selection":
                        Theme.setSelectionColor();
                        $('#selectionColorSelector').ColorPickerSetColor(Theme.custom.colors.selection);
                        break;
                    case "interaction":
                        Theme.setInteractionColor();
                        $('#interactionColorSelector').ColorPickerSetColor(Theme.custom.colors.interaction);
                        break;
                    case "text":
                    default:
                        break;
                }
            }
        }

        for (var x in Theme.custom.backgrounds) {
            var img = CookieManager.get("bg_" + x);

            if (img) {
                Theme.custom.backgrounds[x] = img;
            }

            switch(x) {
                case "primary":
                    Theme.updateHeaderImage();
                    break;
                case "institutionLogo":
                    Theme.updateInstitutionalLogoImage();
                    break;
                default:
                    break;
            }
        }

        for (var x in Theme.custom.text) {
            for (var y in Theme.custom.text[x]) {
                var val = CookieManager.get("text_" + x + "_" + y);

                if (val) {
                    Theme.custom.text[x][y] = val;
                }

                switch(x) {
                    case "primary":
                        if (y == "color") {
                            Theme.setTextPrimaryColor();
                            $('#primaryTextColorSelector').ColorPickerSetColor(Theme.custom.text.primary.color);
                            break;
                        }
                        break;
                    case "secondary":
                        if (y == "color") {
                            Theme.setTextSecondaryColor();
                            $('#secondaryTextColorSelector').ColorPickerSetColor(Theme.custom.text.secondary.color);
                            break;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    },
    setTheme: function(name) {
        var theme = Theme.getTheme(name);

        if (!theme) {
            return;
        }

        Theme.currentThemeName = name;

        if (theme.colors) {
            var c = theme.colors;

            for (var x in c) {
                switch(x) {
                    case "primary":
                        Theme.setPrimaryColor(c[x]);
                        $('#primaryColorSelector').ColorPickerSetColor(c[x]);
                        break;
                    case "secondary":
                        Theme.setSecondaryColor(c[x]);
                        $('#secondaryColorSelector').ColorPickerSetColor(c[x]);
                        break;
                    case "selection":
                        Theme.setSelectionColor(c[x]);
                        $('#selectionColorSelector').ColorPickerSetColor(c[x]);
                        break;
                    case "interaction":
                        Theme.setInteractionColor(c[x]);
                        $('#interactionColorSelector').ColorPickerSetColor(c[x]);
                        break;
                    default:
                        break;
                }
            }
        }

        if (theme.backgrounds) {
            var b = theme.backgrounds;

            for (var x in b) {
                switch(x) {
                    case "primary":
                        Theme.updateHeaderImage(b[x]);
                        break;
                    case "institutionLogo":
                        Theme.updateInstitutionalLogoImage(b[x]);
                        break;
                    default:
                        break;
                }
            }
        }

        if (theme.text) {
            var t = theme.text;

            for (var x in t) {
                for (var y in t[x]) {
                    switch (y) {
                        case "color":
                            if (x == "primary") {
                                Theme.setTextPrimaryColor(t[x][y]);
                            } else if (x == "secondary") {
                                Theme.setTextSecondaryColor(t[x][y]);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        MessageProcessor.broadcast( Messenger.createStyleMessage() );
    },
    resetPrimaryColor: function() {
        Theme.setPrimaryColor(Theme.getTheme().primary);

        MessageProcessor.broadcast(  Messenger.createStyleMessage() );
    },
    resetSecondaryColor: function() {
        Theme.setSecondaryColor(Theme.getDefaultTheme().colors.secondary);

        MessageProcessor.broadcast(  Messenger.createStyleMessage() );
    },
    resetSelectionColor: function() {
        Theme.setSelectionColor(Theme.getDefaultTheme().colors.selection);

        MessageProcessor.broadcast(  Messenger.createStyleMessage() );
    },
    resetInteractionColor: function() {
        Theme.setInteractionColor(Theme.getDefaultTheme().colors.interaction);

        MessageProcessor.broadcast(  Messenger.createStyleMessage() );
    },
    resetTextPrimaryColor: function() {
        Theme.setTextPrimaryColor(Theme.getDefaultTheme().text.primary.color);

        MessageProcessor.broadcast(  Messenger.createStyleMessage() );
    },
    resetTextSelectionColor: function() {
        Theme.setTextSecondaryColor(Theme.getDefaultTheme().text.secondary.color);

        MessageProcessor.broadcast(  Messenger.createStyleMessage() );
    },
    setPrimaryColor: function(hex) {
        if (hex) {
            Theme.custom.colors.primary = '#' + hex.replace("#", "");
        }

        StyleManager.setStyle('#header', "backgroundColor", Theme.custom.colors.primary);
        $('#primaryColorSelector div').css('backgroundColor', Theme.custom.colors.primary);
    },
    updateHeaderImage: function(img) {
        if (img) {
            Theme.custom.backgrounds.primary = img;
        }

        var val = StyleManager.getStyle('#header', "backgroundColor");

        StyleManager.setStyle('#header', "background", Theme.custom.backgrounds.primary);
        StyleManager.setStyle('#header', "backgroundColor", val);
    },
    updateInstitutionalLogoImage: function(img) {
        if (img) {
            Theme.custom.backgrounds.institutionLogo = img;
        }

        var val = StyleManager.getStyle('.institutionalBranding', "backgroundColor");

        StyleManager.setStyle('.institutionalBranding', "background", Theme.custom.backgrounds.institutionLogo);
        StyleManager.setStyle('.institutionalBranding', "backgroundColor", val);
    },
    setInteractionColor: function(hex) {
        if (hex) {
            Theme.custom.colors.interaction =  '#' + hex.replace("#", "");
        }

        StyleManager.setStyle('.navList > .parent > span:hover', "backgroundColor", Theme.custom.colors.interaction);
        StyleManager.setStyle('.navList > .scrollableListItem > span:hover', "backgroundColor", Theme.custom.colors.interaction);
        $('#interactionColorSelector div').css('backgroundColor', Theme.custom.colors.interaction);
    },
    setSelectionColor: function(hex) {
        if (hex) {
            Theme.custom.colors.selection =  '#' + hex.replace("#", "");
        }

        StyleManager.setStyle('.selectedListItem > span', "backgroundColor", Theme.custom.colors.selection);
        $('#selectionColorSelector div').css('backgroundColor', Theme.custom.colors.selection);
    },
    setSecondaryColor: function(hex) {
        if (hex) {
            Theme.custom.colors.secondary = '#' + hex.replace("#", "");
        }

        StyleManager.setStyle('.footerOpenItemsIcon', "backgroundColor", Theme.custom.colors.secondary);
        $('#secondaryColorSelector div').css('backgroundColor', Theme.custom.colors.secondary);
    },
    setTextPrimaryColor: function(hex) {
        if (hex) {
            Theme.custom.text.primary.color = '#' + hex.replace("#", "");
        }

        StyleManager.setStyle('.information span', "color", Theme.custom.text.primary.color);
        $('#primaryTextColorSelector div').css('backgroundColor', Theme.custom.text.primary.color);
    },
    setTextSecondaryColor: function(hex) {
        if (hex) {
            Theme.custom.text.secondary.color = '#' + hex.replace("#", "");
        }

        StyleManager.setStyle('#areasMenu > li > #workspaceText', "color", Theme.custom.text.secondary.color);
        $('#secondaryTextColorSelector div').css('backgroundColor', Theme.custom.text.secondary.color);
    }
};

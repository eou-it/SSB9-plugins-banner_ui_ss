$(document).ready(function() {


    var i18nCache = null;

    if (Modernizr.localstorage) {
        var i18nCacheKey = $('meta[name=i18nCacheKey]').attr("content");

        if (i18nCacheKey) {
            if (localStorage["i18n.cacheKey"] === i18nCacheKey) {
                try {
                    i18nCache = JSON.parse( localStorage["i18n.cache"] );
                }
                catch (err) {
                    // There was an error parsing the cache from local storage.  We are going to ignore the cache and rebuild it.
                }
            }
        }
    }

    if (i18nCache) {
        $.i18n.map = i18nCache;
        if (typeof i18nSetup === 'function') {
            i18nSetup();
        }
    }
    else {
        $.i18n.properties({
            name: 'messages',
            path: 'i18n/',
            mode: "map",
            language: "i", // Note:  'i' is an invalid language and used on purpose.  By using this code we'll only make one request for the base properties file.
            callback: function() {
                if (Modernizr.localstorage) {
                    if (i18nCacheKey) {
                        localStorage["i18n.cacheKey" ] = i18nCacheKey
                        localStorage["i18n.cache"] = JSON.stringify($.i18n.map);
                    }
                }

                if (typeof i18nSetup === 'function') {
                    i18nSetup();
                }
            }
        });
    }
});
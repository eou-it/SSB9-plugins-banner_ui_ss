/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui.theme


import grails.util.Holders
import net.sf.ehcache.Cache
import net.sf.ehcache.CacheManager
import net.sf.ehcache.Element
import net.sf.ehcache.config.CacheConfiguration
import org.apache.log4j.Logger

/**
 * Utility class instead of service to avoid BannerDS database connections
*/

class ThemeUtil {
    def static themeCache = "theme"
    private static final Logger log = Logger.getLogger( this.getClass() )


    def static sanitizeName( name ) {
        return name.replaceAll(/[.*\/\\]/, '_')
    }

    def static CSSFileName(themeName, templateName) {
        return "${themeName}-${templateName}.css".toString()
    }

    def static formatTheme(templateSCSS, themeJSON) {
        def sorted = new TreeMap( { a,b ->
            def v = b.length() <=> a.length();
            if ( v ) {
                return v;
            } else {
                return b.compareTo(a);
            }
        })
        sorted.putAll( themeJSON )
        def content = templateSCSS
        sorted.each { k, v ->
            if ( v ) {
                content = content.replace( "\$theme$k", v ) // also add "/*theme$k*/ " +  except for logo
            }
        }
        return content
    }

    def static getThemeCache() {
        Cache cache
        CacheManager cacheManager = CacheManager.getInstance()
        cache = cacheManager.getCache(themeCache)
        def ttl = Holders.getConfig().banner.theme?.cacheTimeOut
        if(!ttl || ttl < 0) {
            ttl = 900  //900 seconds
        }
        if(!cache) {
            cacheManager.addCache(themeCache)
            cache = cacheManager.getCache(themeCache)
            CacheConfiguration config = cache.getCacheConfiguration()
            config.setTimeToLiveSeconds(ttl)
        }
        return cache
    }

    def static expired(final key, Cache cache) {
        boolean expired = true;
        final Element element = cache.getQuiet(key);
        if (element != null) {
            expired = cache.isExpired(element);
        }
        return expired;
    }

    def static clearCache() {
        CacheManager manager = CacheManager.getInstance()
        Cache cache = manager.getCache(themeCache)
        cache.removeAll()
    }

}

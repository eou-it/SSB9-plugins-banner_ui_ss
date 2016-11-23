/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme

import grails.converters.JSON
import grails.util.Holders
import groovy.io.FileType
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import net.sf.ehcache.Cache
import net.sf.ehcache.CacheManager
import net.sf.ehcache.Element
import net.sf.ehcache.config.CacheConfiguration
import org.apache.log4j.Logger

/**
 * Utility class instead of service to avoid BannerDS database connections
 */
class ThemeUtil {
    def static themesPath = Holders.getConfig().banner.theme.path
    def static themeCache = "theme"
    private static final Logger log = Logger.getLogger( this.getClass() )

    static {
        assert themesPath
        new File( themesPath ).mkdirs()
    }

    def sanitizeName( name ) {
        return name.toLowerCase().replaceAll(/[.*\/\\]/, '_')
    }

    def fileName( name ) {
        return "${sanitizeName( name )}"
    }


    def formatTheme(templateName, themeJSON) throws IOException {
        def sorted = new TreeMap( { a,b ->
            def v = b.length() <=> a.length();
            if ( v ) {
                return v;
            } else {
                return b.compareTo(a);
            }
                                  })

        sorted.putAll( themeJSON )

        def templateFile = new File( themesPath, "${sanitizeName( templateName )}.scss")
        def template = templateFile.getText( 'utf-8' )

        def content = template
        sorted.each { k, v ->
            if ( v ) {
                content = content.replace( "\$theme$k", v ) // also add "/*theme$k*/ " +  except for logo
            }
        }
        return content
    }

    def CSSFileName(themeName, templateName) {
        return "${themeName}-${templateName}.css".toString()
    }

    /*
        Deletes the theme CSS file from disk storage
    */
    def clearCSSFile(themeName, templateName) {
        File file = new File("${themesPath}/${CSSFileName(themeName, templateName)}")
        if(file.exists()){
            file.delete()
        }
    }

    /*
        Configures the cache: sets TTL time, removes the css file if the cache is expired
    */
    def getThemeCache(themeName, templateName) {
        Cache cache
        CacheManager cacheManager = CacheManager.getInstance()
        cache = cacheManager.getCache(themeCache)
        def ttl = Holders.getConfig().banner.theme?.cacheTime
        if(!ttl || ttl < 0) {
            ttl = 900  //set 900 seconds
        }
        if(!cache) {
            clearCSSFile(themeName, templateName)
            cacheManager.addCache(themeCache)
            cache = cacheManager.getCache(themeCache)
            CacheConfiguration config = cache.getCacheConfiguration()
            config.setTimeToLiveSeconds(ttl)
        }
        return cache
    }

    /*
        Checks if theme CSS file exists in the cache
    */
    def expired(final key, Cache cache) {
        boolean expired = true;
        final Element element = cache.getQuiet(key);
        if (element != null) {
            expired = cache.isExpired(element);
        }
        return expired;
    }

    /*
        Stores the theme CSS file in the cache and Retrieves it from cache for subsequent requests
    */
    def getCSSFromCache(themeName, templateName, themeUrl)     {
        def fileName = CSSFileName(themeName, templateName)
        Cache cache = getThemeCache(themeName, templateName)
        if(expired(fileName, cache)) {
            File file = new File("${themesPath}/${fileName}")
            def themeJSON = JSON.parse(new URL( "${themeUrl}/get?name=${themeName}" ).text)
            def content = formatTheme(templateName, themeJSON)
            file.withWriter( 'utf-8' ) {
                file.write( content )
            }
            cache.put(new Element(file.name, file.text))
        }
        Element ele = cache.get(fileName)
        return ele.objectValue
    }

    /*
        Clears Theme Cache
    */
    def clearCache() {
        CacheManager manager = CacheManager.getInstance()
        Cache cache = manager.getCache(themeCache)
        cache.removeAll()
    }

}

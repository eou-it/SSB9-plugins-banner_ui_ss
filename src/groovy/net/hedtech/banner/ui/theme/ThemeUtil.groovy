/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
****************************************************************************** */

package net.hedtech.banner.ui.theme


import grails.converters.JSON
import grails.util.Holders

import groovy.io.FileType
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

import java.io.File
import java.util.TreeMap

import org.apache.log4j.Logger

/**
 * Utility class instead of service to avoid BannerDS database connections
 */
class ThemeUtil {
    def static extensionsPath = Holders.getConfig().webAppExtensibility.locations.extensions
    def static themesPath = extensionsPath + "/themes"
    private static final Logger log = Logger.getLogger( this.getClass() )

    static {
        assert extensionsPath
        new File( themesPath ).mkdirs()
    }

    def getThemes() {
        def dir = new File( themesPath )
        def names = []
        dir.eachFileRecurse( FileType.FILES ) { file ->
            if ( file.getName().endsWith( '.json' )) {
                def name = file.getName().replace( 'theme.', '' ).replace( '.json', '' )
                names << name
            }
        }
        return names
    }

    def sanitizeName( name ) {
        return name.toLowerCase().replace('.', '_')
    }

    def fileName( name ) {
        return "theme.${sanitizeName( name )}.json"
    }

    def saveTheme(name, data) {
        assert extensionsPath

        def file = new File( themesPath, fileName( name ))
        file.withWriter( 'utf-8' ) {
            file.write( JsonOutput.toJson( data ))
        }
    }

    def getThemeJson( name ) {
        def file = new File( themesPath, fileName( name ))
        def text = file.getText( 'utf-8' )
        def json = new JsonSlurper().parseText( text ) // parse to validate it's JSON
        return json
    }

    def deleteTheme( name ) {
        def file = new File( themesPath, fileName( name ))
        return file.delete();
    }

    def formatTheme(themeName, templateName) throws IOException {
        def json = getThemeJson( themeName )
        def sorted = new TreeMap( { a,b ->
            def v = b.length() <=> a.length();
            if ( v ) {
                return v;
            } else {
                return b.compareTo(a);
            }
                                  })

        sorted.putAll( json )

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
}

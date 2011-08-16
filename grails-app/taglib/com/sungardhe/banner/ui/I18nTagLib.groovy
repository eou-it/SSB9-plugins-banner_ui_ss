package com.sungardhe.banner.ui

import java.security.MessageDigest

/**
 * Tag lib used to support JavaScript localization utilizing the messages.properties from Grails.
 */
class I18nTagLib {

    def i18nProperties = { attrs ->
        out << getProperties( attrs.name )
    }

    def i18nCacheKey = { attrs ->
        out << createHashKey( getProperties( attrs.name ) )
    }

    private def getProperties( name ) {
        // Scan properties file for the js.* properties.  They follow a convention that states that they are used by JavaScript
        // This is to ensure the bare minimum of properities are sent down.
        def props = new java.util.Properties()

        if (new File("grails-app/i18n/${name}.properties").exists()) {
            props.load(new FileInputStream("grails-app/i18n/${name}.properties"))
        }

        // Should we get the keys, then with the locale we have in Grails do get.message on each key?

        def output = ""
        props.keySet().findAll { key -> key.startsWith("js.") }.each {
            if (output) output += "\n"
            output += "$it=${g.message(code: it)}"
        }

        output
    }

    private def createHashKey( message ) {
        def hex = { byte[] array ->
            def val = ""

            array.each {
                val += Integer.toHexString((it & 0xFF) | 0x100).toUpperCase().substring(1, 3).toString()
            }

            return val
        }

        MessageDigest md = MessageDigest.getInstance("MD5");
        hex(md.digest(message.toString().getBytes()));
    }
}
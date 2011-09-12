package com.sungardhe.banner.ui

import java.security.MessageDigest
import com.sungardhe.banner.BannerPluginAwareResourceBundleMessageSource

/**
 * Tag lib used to support JavaScript localization utilizing the messages.properties from Grails.
 */
class I18nTagLib {

    def messageSource

    def i18nProperties = { attrs ->
        out << getProperties( attrs.name )
    }

    def i18nCacheKey = { attrs ->
        out << createHashKey( getProperties( attrs.name ) )
    }

    private def getProperties( name ) {
        def output

        if (messageSource instanceof BannerPluginAwareResourceBundleMessageSource) {
            messageSource.getJavaScriptKeys().each { key ->
                if (output) output += "\n"
                output += "$key=${g.message(code: key)}"
            }
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
/** *****************************************************************************
 Copyright 2008-2011 SunGard Higher Education. All Rights Reserved.

 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is
 limited solely to SunGard Higher Education licensees, and is further subject
 to the terms and conditions of one or more written license agreements between
 SunGard Higher Education and the licensee in question. SunGard, Banner and
 Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 ****************************************************************************** */
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
        String output = ""

        if (messageSource instanceof BannerPluginAwareResourceBundleMessageSource) {
            messageSource.getJavaScriptKeys().each { key ->
                if (output) output += "\n"

                def value = g.message(code: key)
                output += "$key=${value?.encodeAsHTML()}"
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
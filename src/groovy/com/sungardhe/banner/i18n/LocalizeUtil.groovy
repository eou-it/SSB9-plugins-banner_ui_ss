/****************************************************************************************
# Copyright 2011 SunGard Higher Education. All Rights Reserved.                         *
# This copyrighted software contains confidential and proprietary information of        *
# SunGard Higher Education and its subsidiaries. Any use of this software is limited    *
# solely to SunGard Higher Education licensees, and is further subject to the terms     *
# and conditions of one or more written license agreements between SunGard Higher       *
# Education and the licensee in question. SunGard is either a registered trademark or   *
# trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.*
# Banner and Luminis are either registered trademarks or trademarks of SunGard Higher   *
# Education in the U.S.A. and/or other regions and/or countries.                        *
# ***************************************************************************************/

package com.sungardhe.banner.i18n

import com.sungardhe.banner.exceptions.ApplicationException

import java.text.NumberFormat
import java.text.ParseException

import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.MessageSource
import org.springframework.context.i18n.LocaleContextHolder as LCH

/**
 * Utility methods for parsing and formatting fields with the current locale from LocaleContextHolder
 *
 * Format methods accept anything, and return the original value if it cannot be formatted.
 *
 * Parse methods return null and empty string unchanged, and throw ApplicationException if the value is not parseable correctly.
 */
class LocalizeUtil {
    def public static formatNumber = { n ->
        def fmt = { it ->
            try {
                NumberFormat.getInstance(LCH.getLocale()).format(it)
            } catch ( IllegalArgumentException x ) {
                it
            }
        }
        fmt(n)
    }

    def public static parseNumber = {
        def val = it
        if (val) {
            try {
                val = NumberFormat.getInstance(LCH.getLocale()).parse( it )
//            } catch ( MissingMethodException x ) {
//                // already parsed number
            } catch ( Exception x ) {
                throw new ApplicationException( "", x )
            }
        }
        val
    }

    private static String message(key, args = null, locale = null) {
        // copied from banner-general:com.sungardhe.banner.MessageUtility rather than introducing new plugin-plugin dependency

        String value = "";
        if (key){
              if(!locale) locale = Locale.getDefault()
              MessageSource messageSource = ApplicationHolder.application.mainContext.getBean('messageSource')
              value = messageSource.getMessage(key,args,locale)
        }
        return value
    }

    public static getDateFormat() {
        message("default.date.format", null, LCH.getLocale())
    }

    def public static formatDate = { 
        def v = it
        try {
            v = it.format(getDateFormat())
        } catch ( Exception x )
        {}
        v
    }

    def public static parseDate = {
        def val = it
        //TODO: log println( "parseDate: ${it} ${it?.class}" )
        if ( val ) {
            try {
                def pattern = getDateFormat();
                val = Date.parse( pattern, it )
                if ( val.format( pattern ) != it ) {
                    //println("Got date mismatch: ${val}  ${val.format(pattern)}  ${it}" )
                    throw new ParseException( it, 0 )
                }
            } catch ( Exception x ) {
                //println("failed to parse date: ${it}  ${it.class}  ${x}" )
                throw new ApplicationException( "", x )
            }
        }
        //println("parseDate converted ${it} to ${val}" )
        val
    }
}
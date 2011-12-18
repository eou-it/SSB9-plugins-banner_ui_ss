/*********************************************************************************
 Copyright 2009-2011 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/

package com.sungardhe.banner.i18n

import org.springframework.context.i18n.LocaleContextHolder as LCH

import com.sungardhe.banner.exceptions.ApplicationException
import java.text.NumberFormat
import java.text.ParseException
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.MessageSource

/**
 * Utility methods for parsing and formatting fields with the current locale from LocaleContextHolder
 *
 * Format methods accept anything, and return the original value if it cannot be formatted.
 *
 * Parse methods return null and empty string unchanged, and throw ApplicationException if the value is not parseable correctly.
 */
class LocalizeUtil {
    def static formatNumber = { n ->
        def formatClosure = { it ->
            try {
                NumberFormat.getInstance(LCH.getLocale()).format(it)
            } catch (IllegalArgumentException x) {
                it
            }
        }

        return formatClosure(n)
    }


    def static parseNumber = {
        def value = it
        if (value) {
            try {
                value = NumberFormat.getInstance(LCH.getLocale()).parse(it)
            }
            catch (Exception x) {
                throw new ApplicationException("", x)
            }
        }

        return value
    }


    def static getDateFormat() {
        message("default.date.format", null, LCH.getLocale())
    }


    def static formatDate = {
        def pattern = getDateFormat()
        def value = it
        try {
            try {
                value = it?.format(pattern)
            }
            catch (IllegalArgumentException x) {
                Logger.getLogger( LocalizeUtil ).error "Invalid default.date.format=${pattern} in locale: ${LCH.getLocale()}"
                // return an unusual format to highlight the error
                // but not Java default format because it is locale-specific and breaks JSON rendering in Arabic.
                value = it?.format('yyyy-MM-dd')
            }
        }
        catch (Exception x) {
            Logger.getLogger( LocalizeUtil ).debug( "Unexpected exception formatting date", x )
            // Eat the exception and do nothing
        }

        return value
    }


    def static parseDate = {
        def value = it

        if (value) {
            try {
                def pattern = getDateFormat();
                value = Date.parse(pattern, it)
                if (value.format(pattern) != it) {
                    throw new ParseException(it, 0)
                }
            }
            catch (Exception x) {
                throw new ApplicationException("", x)
            }
        }

        return value
    }


    private static String message(key, args = null, locale = null) {
        // copied from banner-general:com.sungardhe.banner.MessageUtility rather than introducing new plugin-plugin dependency

        String value = "";
        if (key) {
            if (!locale) locale = Locale.getDefault()
            MessageSource messageSource = ApplicationHolder.application.mainContext.getBean("messageSource")
            value = messageSource.getMessage(key, args, locale)
        }
        return value
    }
}
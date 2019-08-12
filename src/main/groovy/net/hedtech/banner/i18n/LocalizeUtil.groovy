/*******************************************************************************
Copyright 2009-2019 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

package net.hedtech.banner.i18n

import groovy.util.logging.Slf4j
import org.springframework.context.i18n.LocaleContextHolder as LCH

import net.hedtech.banner.exceptions.ApplicationException
import java.text.NumberFormat
import java.text.ParseException
import grails.util.Holders
import org.springframework.context.MessageSource

/**
 * Utility methods for parsing and formatting fields with the current locale from LocaleContextHolder
 *
 * Format methods accept anything, and return the original value if it cannot be formatted.
 *
 * Parse methods return null and empty string unchanged, and throw ApplicationException if the value is not parseable correctly.
 */
@Slf4j
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
                log.error "Invalid default.date.format=${pattern} in locale: ${LCH.getLocale()}"
                // return an unusual format to highlight the error
                // but not Java default format because it is locale-specific and breaks JSON rendering in Arabic.
                value = it?.format('yyyy-MM-dd')
            }
        }
        catch (Exception x) {
            log.debug( "Unexpected exception formatting date", x )
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
        // copied from banner-general:net.hedtech.banner.MessageUtility rather than introducing new plugin-plugin dependency

        String value = "";
        if (key) {
            if (!locale) locale = Locale.getDefault()
            MessageSource messageSource = Holders.grailsApplication.mainContext.getBean("messageSource")
            value = messageSource.getMessage(key, args, locale)
        }
        return value
    }
}

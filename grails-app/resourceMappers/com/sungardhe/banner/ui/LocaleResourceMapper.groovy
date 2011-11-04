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

import org.grails.plugin.resource.mapper.MapperPhase

/**
 * Scans javascript files for references to message codes and adds them to the ResourceMeta
 * for later processing.
 */
class LocaleResourceMapper {

    static defaultIncludes = [ '**/*.js' ]

    def phase = MapperPhase.NOTIFICATION

    def map(resource, config) {

        // Search for any place where we are referencing message codes
        def regex = ~/\(*\.i18n.prop\(.*?\"(.*?)\".*?\)/

        Set keys = []
        def matcher = regex.matcher( resource.processedFile.text )
        while (matcher.find()) {
            keys << matcher.group(1)
        }

        if (keys) {
            // We are going to add to the resource the keys that are used in the processed JavaScript.
            if (resource.hasProperty( "localeKeys")) {
                resource.metaClass.localeKeys.addAll( keys )
            }
            else {
                resource.metaClass.localeKeys = keys
            }
        }
    }
}
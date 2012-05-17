/*********************************************************************************
 Copyright 2009-2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/

modules = {
    'overrides' {
        'jquery-theme' {
            resource id: 'theme', url:[plugin:'banner-ui-ss', dir:'css/themeroller/jquery-ui-1.8.13-lt.gry.ov/css/custom-theme', file:'jquery-ui-1.8.13.custom.css'], attrs:[media:'screen, projection']
        }
    }

    'bannerSelfService' {
        dependsOn "jquery, jquery-ui, aurora"

        defaultBundle environment == "development" ? false : "bannerSelfService"

        resource url:[plugin: 'banner-ui-ss', file: 'js/html5shim.js'],
            disposition: 'head',
            wrapper: { s -> "<!--[if lt IE 9]>$s<![endif]-->" }

        resource url:[plugin: 'banner-ui-ss', file: 'css/banner-ui-ss.css'],             attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/notification-center.css'],      attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/jquery/jquery.ui.tooltip.css'], attrs:[media:'screen, projection']

        resource url:[plugin: 'banner-ui-ss', file: 'js/underscore.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.modelbinding.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/yepnope.1.0.1-min.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/log4javascript.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/backbone-custom.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/activity-timer.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/modernizr-2.0.6.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/logging.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/common.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.sghe.dirtycheck.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/notification-center.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.hoverintent.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.simplemodal-1.4.1.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.datepicker.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.autocomplete.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.autocomplete.autoSelect.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.autocomplete.selectFirst.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.combobox.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.editable.input.types.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.layout-latest.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.timers-1.2.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.i18n.properties.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.numeric.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.form.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ajaxmanager.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/ajax-manager.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/jquery.dataTables.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/fnReloadAjaxPlugin.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/fnFilterClearPlugin.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/KeyTable.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/datatables-custom.js']

        resource url:[plugin: 'i18n-core', file: 'js/calendars/jquery.calendars.js']
        resource url:[plugin: 'i18n-core', file: 'js/calendars/jquery.calendars.plus.js']
        resource url:[plugin: 'i18n-core', file: 'js/calendars/jquery.calendars.picker.js']
        resource url:[plugin: 'i18n-core', file: 'js/calendars/jquery.calendars.picker.ext.js']
        resource url:[plugin: 'i18n-core', file: 'js/calendars/jquery.calendars.islamic.js']

        resource url:[plugin: 'i18n-core', file: 'js/jquery.multi.calendars.picker.js']
        resource url:[plugin: 'i18n-core', file: 'js/jquery.jeditable.multi.datepicker.js']
        resource url:[plugin: 'i18n-core', file: 'js/jquery.multi.calendars.picker.ext.js']

        resource url:[plugin: 'i18n-core', file: 'js/multi.calendar.init.js']

        resource url:[plugin: 'i18n-core', file: 'css/multiCalendar.css']
    }

    'bannerSelfServiceRTL' {
        dependsOn "bannerSelfService, auroraRTL"
        defaultBundle environment == "development" ? false : "bannerSelfServiceRTL"

        resource id: 'themeRTL', url:[plugin:'banner-ui-ss', dir:'css/themeroller/jquery-ui-1.8.13-lt.gry.ov/css/custom-theme', file:'jquery-ui-1.8.13.custom-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/banner-ui-ss-rtl.css'],             attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/notification-center-rtl.css'],      attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/banner-ui-ss-rtl-patch.css'],       attrs:[media:'screen, projection']
        resource url:[plugin: 'i18n-core', file: 'css/multiCalendar-rtl-patch.css'],         attrs:[media:'screen, projection']
    }
}
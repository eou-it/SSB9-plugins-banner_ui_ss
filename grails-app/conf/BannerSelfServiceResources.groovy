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

modules = {
    'overrides' {
        'jquery-theme' {
            resource id: 'theme',
            url:[plugin:'banner-ui-ss', dir:'css/themeroller/jquery-ui-1.8.13-lt.gry.ov/css/custom-theme', file:'jquery-ui-1.8.13.custom.css'],
                dispostion: 'head',
                attrs:[media:'screen, projection']
        }
    }

    'bannerSelfService' {
        dependsOn "jquery, jquery-ui"
        defaultBundle environment == "development" ? false : "bannerSelfService"
        //defaultBundle false


        resource url: 'http://html5shim.googlecode.com/svn/trunk/html5.js',
            disposition: 'head',
            wrapper: { s -> "<!--[if lt IE 9]>$s<![endif]-->" }

        resource url:[plugin: 'banner-ui-ss', file: 'css/banner-ui-ss.css'],             attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/notification-center.css'],      attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/jquery/jquery.ui.tooltip.css'], attrs:[media:'screen, projection']

        resource url:[plugin: 'sghe-aurora', file: 'css/common-controls.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'sghe-aurora', file: 'css/common-platform.css'], attrs:[media:'screen, projection']

        resource url:[plugin: 'banner-ui-ss', file: 'js/underscore.js'],                                        disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.js'],                                          disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/log4javascript.js'],                                    disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/backbone-custom.js'],                            disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/activity-timer.js'],                             disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/modernizr-2.0.6.js'],                                   disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/logging.js'],                                    disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/common.js'],                                     disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.sghe.dirtycheck.js'],             disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/notification-center.js'],                        disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.hoverintent.js'],                 disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.js'],                   disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.simplemodal-1.4.1.js'],           disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.datepicker.js'],        disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.autocomplete.js'],      disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.autocomplete.autoSelect.js'],  disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.autocomplete.selectFirst.js'], disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.combobox.js'],          disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.editable.input.types.js'],        disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.layout-latest.js'],               disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.timers-1.2.js'],                  disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.i18n.properties.js'],             disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.numeric.js'],                     disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.themeswitcher.js'],            disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.form.js'],                        disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ajaxmanager.js'],                 disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/ajax-manager.js'],                               disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/jquery.dataTables.js'],                disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/fnReloadAjaxPlugin.js'],               disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/fnFilterClearPlugin.js'],              disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables-1.8.2/KeyTable.js'],                         disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/datatables-custom.js'],                          disposition: 'head'
    }
}
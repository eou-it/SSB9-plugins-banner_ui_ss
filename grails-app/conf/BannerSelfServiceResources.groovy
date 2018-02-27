/*******************************************************************************
 Copyright 2009-2018 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

modules = {

    'jquery' {
        resource url:[plugin: 'banner-ui-ss', file: 'css/themeroller/jquery-ui-1.8.13-lt.gry.ov/css/custom-theme/jquery-ui-1.8.13.custom.css'], attrs:[media:'screen, projection']

        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery/jquery-1.7.2.js'], disposition: 'head'
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery/jquery-ui-1.8.15.custom.js'], disposition: 'head'
    }

    'bootstrap' {
        dependsOn "jquery"
        defaultBundle environment == "development" ? false : "bootstrap"

        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/bootstrap.css'],            attrs: [media: 'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/bootstrap-fixes.css'],                attrs: [media: 'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/js/bootstrap.js']
    }

    'bootstrapRTL' {
        dependsOn "jquery"
        defaultBundle environment == "development" ? false : "bootstrap"

        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/bootstrap-rtl.css'],            attrs: [media: 'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/bootstrap-fixes-rtl.css'],                attrs: [media: 'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/js/bootstrap.js']
    }

    'glyphicons' {
        defaultBundle environment == "development" ? false : "bannerSelfService"

        resource url:[plugin: 'banner-ui-ss', file: 'glyphicons/style.css'], attrs: [media: 'screen, projection']
    }

    'bannerSelfServiceWithoutAurora' {
        dependsOn "jquery, i18n-core"

        resource url:[plugin: 'banner-ui-ss', file: 'js/html5shim.js'],
            disposition: 'head',
            wrapper: { s -> "<!--[if lt IE 9]>$s<![endif]-->" }

        resource url:[plugin: 'banner-ui-ss', file: 'js/underscore.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/underscore.string.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/backbone-custom.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.modelbinding.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.datagridview.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.pagedcollection.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.i18n.properties.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/yepnope.1.0.1-min.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/log4javascript.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/activity-timer.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/modernizr-2.5.3.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/ICanHaz.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/handlebars.js']
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
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.tooltip.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.pillbox.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.combobox.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.editable.input.types.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.layout-latest.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.timers-1.2.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.numeric.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.form.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ajaxmanager.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.mutate.events.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.mutate.min.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.simulate.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/ajax-manager.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables/jquery.dataTables.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables/fnReloadAjaxPlugin.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables/fnFilterClearPlugin.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables/KeyTable.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables/ColReorderWithResize.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables/ColVis.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/datatables/FixedColumns.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/common/datatables-custom.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.buttonmenu.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.pagingcontrols.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/backbone.grid.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/grid-support/resizable.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/grid-support/columnreorder.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/detectmobilebrowser.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/detecttabletbrowser.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/select2/select2.js']
    }

    'bannerSelfServiceCommonLTR' {
        dependsOn "bannerSelfServiceWithoutAurora, aurora"
        defaultBundle environment == "development" ? false : "bannerSelfServiceLTR"

        resource url:[plugin: 'banner-ui-ss', file: 'css/banner-ui-ss.css'],             attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/notification-center.css'],      attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/jquery/jquery.ui.tooltip.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/datatables-colvis.css'],        attrs:[media:'screen, projection']

        resource url:[plugin: 'banner-ui-ss', file: 'css/backbone.grid.css'],            attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/backbone.pagingcontrols.css'],  attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'js/select2/select2.css'],           attrs:[media:'screen, projection']
    }

    'bannerSelfServiceCommonRTL' {
        dependsOn "bannerSelfServiceWithoutAurora, auroraRTL"
        defaultBundle environment == "development" ? false : "bannerSelfServiceRTL"

        resource id: 'themeRTL', url:[plugin:'banner-ui-ss', dir:'css/themeroller/jquery-ui-1.8.13-lt.gry.ov/css/custom-theme', file:'jquery-ui-1.8.13.custom-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/banner-ui-ss-rtl.css'],             attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/notification-center-rtl.css'],      attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/jquery/jquery.ui.tooltip-rtl.css'], attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/datatables-colvis-rtl.css'],        attrs:[media:'screen, projection']

        resource url:[plugin: 'banner-ui-ss', file: 'css/backbone.grid-rtl.css'],            attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/backbone.pagingcontrols-rtl.css'],  attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'js/select2/select2-rtl.css'],           attrs:[media:'screen, projection']

        resource url:[plugin: 'banner-ui-ss', file: 'css/banner-ui-ss-rtl-patch.css'],       attrs:[media:'screen, projection']

        resource url:[plugin: 'i18n-core', file: 'css/multiCalendar-rtl.css'],               attrs:[media:'screen, projection']
        resource url:[plugin: 'i18n-core', file: 'css/multiCalendar-rtl-patch.css'],         attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'js/select2/select2-rtl-patch.css'],     attrs:[media:'screen, projection']
    }

    'bannerSelfService' {
        dependsOn "bannerSelfServiceCommonLTR, angularApp, extensibilityJQuery"
        resource url: [plugin: 'banner-ui-ss', file: 'js/about/about.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/menu/tools-menu.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/preference/userpreference.js']
        resource url: [plugin: 'banner-ui-ss', file: 'css/preference/userpreference.css', attrs: [media: 'screen, projection']]
    }

    'bannerSelfServiceRTL' {
        dependsOn "bannerSelfServiceCommonRTL, angularApp, extensibilityJQueryRTL"
        resource url: [plugin: 'banner-ui-ss', file: 'js/about/about.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/menu/tools-menu.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/preference/userpreference.js']
        resource url: [plugin: 'banner-ui-ss', file: 'css/preference/userpreference-rtl.css', attrs: [media: 'screen, projection']]
        resource url: [plugin: 'banner-ui-ss', file: 'css/preference/userpreference-rtl-patch.css', attrs: [media: 'screen, projection']]
    }

    'bannerWebLTR' {
        dependsOn "bannerSelfServiceCommonLTR,angularApp,extensibilityAngular"
        resource url: [plugin: 'banner-ui-ss', file: 'js/about/about.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/menu/tools-menu.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/preference/userpreference.js']
        resource url: [plugin: 'banner-ui-ss', file: 'css/preference/userpreference.css', attrs: [media: 'screen, projection']]

    }

    'bannerWebRTL' {
        dependsOn "bannerSelfServiceCommonRTL,angularApp,extensibilityAngularRTL"
        resource url: [plugin: 'banner-ui-ss', file: 'js/about/about.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/menu/tools-menu.js']
        resource url: [plugin: 'banner-ui-ss', file: 'js/preference/userpreference.js']
        resource url: [plugin: 'banner-ui-ss', file: 'css/preference/userpreference-rtl.css', attrs: [media: 'screen, projection']]
        resource url: [plugin: 'banner-ui-ss', file: 'css/preference/userpreference-rtl-patch.css', attrs: [media: 'screen, projection']]
    }

    'angularApp' {
        dependsOn "extensibilityCommon"
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/load-angular-locale.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-resource.min.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-route.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-sanitize.min.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-animate.min.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-ui-router.min.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-messages.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-translate.min.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/ui-bootstrap-tpls.min.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/lrInfiniteScroll.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/moment.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-common.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/locale-numeric-input/custom-number-input.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/locale-numeric-input/directives/currency-directive.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/locale-numeric-input/directives/decimal-directive.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/locale-numeric-input/directives/percent-directive.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/locale-numeric-input/directives/only-number.js']
        resource url:[plugin: 'banner-ui-ss',file: 'css/custom-number-input/custom-number-input.css'],     attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/locale-numeric-input/services/readonly-service.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/date-picker/directives/date-picker-directive.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular-components/i18n/i18n-filter.js']
    }

    'colorPicker' {
        dependsOn 'angularApp'
        resource url:[plugin: 'banner-ui-ss', file: 'js/colorPicker/tinycolor.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/colorPicker/angularjs-color-picker.js']
    }

    'colorPickerLTR' {
        dependsOn 'colorPicker'
        resource url:[plugin: 'banner-ui-ss', file: 'js/colorPicker/angularjs-color-picker.css'], attrs:[media:'screen, projection']
    }

    'colorPickerRTL' {
        dependsOn 'colorPicker'
        resource url:[plugin: 'banner-ui-ss', file: 'js/colorPicker/angularjs-color-picker-rtl.css'], attrs:[media:'screen, projection']
    }

    'themeEditor' {
        dependsOn "angularApp,commonComponents "
        resource url:[plugin: 'banner-ui-ss', file: 'js/theme/themeEditor.js']
    }

    'themeEditorLTR' {
        dependsOn "bannerWebLTR, colorPickerLTR, bootstrap, themeEditor, commonComponentsLTR"
    }

    'themeEditorRTL' {
        dependsOn "bannerWebRTL, colorPickerRTL, bootstrapRTL, themeEditor, commonComponentsRTL"
    }

    'uploadProperties' {
        dependsOn "bootstrap", "angularApp", "commonComponents"
        resource url:[plugin: 'banner-ui-ss', file: 'js/uploadProperties/uploadProperties.js']
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/uploadProperties.css'], attrs: [media: 'screen, projection']
    }

    'uploadPropertiesLTR' {
        dependsOn "bannerWebLTR, uploadProperties, commonComponentsLTR"
    }

    'uploadPropertiesRTL' {
        dependsOn "bannerWebRTL, uploadProperties, commonComponentsRTL"
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/uploadProperties-rtl.css'], attrs: [media: 'screen, projection']
    }

}

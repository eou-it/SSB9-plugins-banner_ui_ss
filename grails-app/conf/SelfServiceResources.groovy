modules = {
    'overrides' {
        'jquery-theme' {
            resource id: 'theme',
            url:[plugin:'banner-ui-ss', dir:'css/themeroller/jquery-ui-1.8.13-lt.gry.ov/css/custom-theme', file:'jquery-ui-1.8.13.custom.css'],
                dispostion: 'head',
                attrs:[media:'screen, projection']
        }
    }

//    'jquery-ui-plugins' {
//        dependsOn "jquery-ui"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.ui.themeswitcher.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.ui.tooltip.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.ui.flyoutmenu.js']
//
//        resource url:[plugin:'banner-ui-ss', dir:'css/jquery', file:'jquery.ui.tooltip.css']
//    }
//
//    'jquery-plugins' {
//        dependsOn "jquery"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.hoverintent.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.jeditable.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.simplemodal-1.4.1.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.jeditable.datepicker.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.jeditable.autocomplete.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.ui.autocomplete.autoSelect.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.ui.autocomplete.selectFirst.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.jeditable.combobox.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.editable.input.types.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.layout-latest.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.timers-1.2.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.i18n.properties-min.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.numeric.js']
//    }
//
//    'datatables' {
//        dependsOn "jquery"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js/datatables-1.8.2', file:'jquery.dataTables.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/datatables-1.8.2', file:'fnReloadAjaxPlugin.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/datatables-1.8.2', file:'fnFilterClearPlugin.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/datatables-1.8.2', file:'KeyTable.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/common', file:'datatables-custom.js']
//        resource url:[plugin:'banner-ui-ss', dir:'css', file:'datatables-demo_table_jui.css']
//        resource url:[plugin:'banner-ui-ss', dir:'css', file:'demo_table.css']
//    }
//
//    'sghe-common' {
//        dependsOn "jquery"
//        dependsOn "backbone"
//        dependsOn "modernizr"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js/common', file:'i18n.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/common', file:'common.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/common', file:'notification-center.js']
//        resource url: 'http://html5shim.googlecode.com/svn/trunk/html5.js',
//            disposition: 'head',
//            wrapper: { s -> "<!--[if lt IE 9]>$s<![endif]-->" }
//
//        resource url:[plugin:'banner-ui-ss', dir:'css', file:'main.css']
//        resource url:[plugin:'banner-ui-ss', dir:'css', file:'notification-center.css']
//    }
//
//    'blueprint' {
//        resource url:[plugin:'banner-ui-ss', dir:'css/blueprint/plugins/fluid', file:'fluid.css']
//        resource url:[plugin:'banner-ui-ss', dir:'css/blueprint/plugins/fancy-type', file:'screen.css']
//    }
//
//
//    'file-upload' {
//        dependsOn "jquery"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins/fileupload', file:'jquery.fileupload.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins/fileupload', file:'jquery.iframe-transport.js']
//    }
//
//    'backbone' {
//        dependsOn "underscore"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js', file:'backbone.js']
//        resource url:[plugin:'banner-ui-ss', dir:'js/common', file:'backbone-custom.js']
//    }
//
//    'underscore' {
//        resource url:[plugin:'banner-ui-ss', dir:'js', file:'underscore.js']
//    }
//
//    'modernizr' {
//        resource url:[plugin:'banner-ui-ss', dir:'js', file:'modernizr-2.0.6.js']
//    }
//
//    'colorbox' {
//        dependsOn "jquery"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js', file:'jquery.colorbox.js']
//        resource url:[plugin:'banner-ui-ss', dir:'css', file:'colorbox.css']
//    }
//
//    'rss' {
//        dependsOn "jquery"
//
//        resource url:[plugin:'banner-ui-ss', dir:'js/jquery-plugins', file:'jquery.zrssfeed.js']
//    }

}
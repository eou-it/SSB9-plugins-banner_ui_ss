<%@ page contentType="text/html;charset=UTF-8" %>
%{--<!DOCTYPE html>--}%
<html lang="${message(code: 'default.language.direction')}">
    <head>
        <meta charset="${message(code: 'default.character.encoding')}"/>
        <meta name="dir" content="${message(code:'default.language.direction')}"/>
        <meta name="i18nCacheKey" content="${g.i18nCacheKey(name:'messages')}"/>
        <meta name="synchronizerToken" content="${org.codehaus.groovy.grails.web.servlet.mvc.SynchronizerToken.store( session ).currentToken}"/>

        <title><g:layoutTitle default="Banner"/></title>

        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon"/>

        %{--<g:resource plugin="banner-ui-ss" file="js/jquery/"/>--}%

        %{--<r:layoutResources/>--}%
        <script src="${resource(plugin: 'jquery', file: 'js/jquery/jquery-1.6.1.min.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'jquery-ui', file: 'jquery-ui/js/jquery-ui-1.8.11.custom.min.js')}" type="text/javascript" ></script>

        <!--[if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js" type="text/javascript" ></script><![endif]-->

        <link href="${resource(plugin: 'banner-ui-ss', file: 'css/main.css')}" type="text/css" rel="stylesheet" media="screen, projector" />
        <link href="${resource(plugin: 'banner-ui-ss', file: 'css/notification-center.css')}" type="text/css" rel="stylesheet" media="screen, projector" />
        <link href="${resource(plugin: 'banner-ui-ss', file: 'css/themeroller/jquery-ui-1.8.13-lt.gry.ov/css/custom-theme/jquery-ui-1.8.13.custom.css')}" type="text/css" rel="stylesheet" media="screen, projection" />
        <link href="${resource(plugin: 'banner-ui-ss', file: 'css/colorbox.css')}" type="text/css" rel="stylesheet" media="screen, projector" />
        <link href="${resource(plugin: 'banner-ui-ss', file: 'css/datatables-demo_table_jui.css')}" type="text/css" rel="stylesheet" media="screen, projector" />
        <link href="${resource(plugin: 'banner-ui-ss', file: 'css/demo_table.css')}" type="text/css" rel="stylesheet" media="screen, projector" />
        <link href="${resource(plugin: 'banner-ui-ss', file: 'css/jquery/jquery.ui.tooltip.css')}" type="text/css" rel="stylesheet" media="screen, projector" />

        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/underscore.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/backbone.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/common/backbone-custom.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/modernizr-2.0.6.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/common/i18n.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/common/common.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/common/notification-center.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.hoverintent.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.jeditable.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.editable.input.types.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.layout-latest.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.timers-1.2.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.i18n.properties.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.numeric.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.themeswitcher.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.tooltip.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/jquery.ui.flyoutmenu.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/datatables-1.8.0/jquery.dataTables.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/datatables-1.8.0/fnReloadAjaxPlugin.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/datatables-1.8.0/fnFilterClearPlugin.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/datatables-1.8.0/KeyTable.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/common/datatables-custom.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery.colorbox.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/fileupload/jquery.fileupload.js')}" type="text/javascript" ></script>
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/jquery-plugins/fileupload/jquery.iframe-transport.js')}" type="text/javascript" ></script>

        <g:viewResources/>

        <g:layoutHead />
    </head>
    <body>
        <div id="spinner" class="spinner" style="display:none;">
            <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
        </div>
        <div id="grailsLogo"><a href="http://grails.org"><img src="${resource(dir:'images',file:'grails_logo.png')}" alt="Grails" border="0" /></a></div>

        <div class="dialog-confirm"><p></p></div>
        <div id="notification-center"></div>
        <g:layoutBody />
        %{--<r:layoutResources/>--}%
    </body>
</html>

<%@ page contentType="text/html;charset=UTF-8" %>
<%-- 
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
--%>
<html>
    <head>
        <meta name="layout" content="bannerSelfServicePage"/>
        <r:require modules="uiCatalog"/>
        <link rel="icon" href="${resource(dir: 'images/poc', file: 'events-favicon.png')}" sizes="32x32" type="image/png">
        <title><g:message code="banner.self.service.ui.catalog"/></title>

    </head>
    <body>
        <div id="content" class="page-with-sidebar">
            <div class="ui-layout-north">
                <div class="datePicker-img-pre-loader"></div>
            </div>
            <div class="ui-layout-south"></div>
            <div class="ui-layout-center inner-content" id="inner-content">
                %{--<div class="inner-center" id="inner-content-center">--}%
                    %{----}%
                %{--</div>--}%
                %{--<div class="inner-south">--}%
                    %{--<div class="footer main-button-bar">--}%
                        %{--<button id="resetButton" class="secondary-button"><g:message code="grades.button.reset.label" /></button>--}%
                        %{--<button id="saveButton" class="primary-button"><g:message code="grades.button.save.label" /></button>--}%
                    %{--</div>--}%
                %{--</div>--}%
                <div class="component ui-widget catalog-entry" data-component="jquery-ui" data-desc="${g.message(code: 'jquery-ui')}">
                    <div class="ui-widget-header content-container-header"><span><g:message code="ui.catalog.widgets.jqueryui" /></span></div>
                    <div class="ui-widget-content">

                        <g:widgetCode template="jquery-ui/buttons" />
                        <g:widgetCode template="jquery-ui/tabs" />
                        <g:widgetCode template="jquery-ui/datePicker" model="[ date: (new Date()).format(g.message( code: 'default.date.format')) ]" />
                        <g:widgetCode template="jquery-ui/autoComplete.comboBox.jeditable" />
                        <g:widgetCode template="jquery-ui/autoComplete.comboBox" />

                    </div>
                </div>
                <div class="component ui-widget catalog-entry" data-component="backbone" data-desc="${g.message(code: 'backbone')}">
                    <div class="ui-widget-header content-container-header"><span><g:message code="ui.catalog.backbone" /></span></div>
                    <div class="ui-widget-content">

                        <g:widgetCode template="backbone/scrollable.content" />
                        <g:widgetCode template="backbone/sidebar.navigation" />
                        <g:widgetCode template="backbone/collection.fetch" />
                        <g:widgetCode template="backbone/data.bind.form" />

                    </div>
                </div>
                <div class="component ui-widget catalog-entry" data-component="data-tables" data-desc="${g.message(code: 'data-tables')}">
                    <div class="ui-widget-header content-container-header"><span><g:message code="ui.catalog.jqueryui.dataEntryGrid" /></span></div>
                    <div class="ui-widget-content">

                        <g:widgetCode template="jquery-ui/dataTables" />

                    </div>
                </div>
                <div class="component ui-widget catalog-entry" data-component="notification-center" data-desc="${g.message(code: 'notification-center')}">
                    <div class="ui-widget-header content-container-header"><span><g:message code="notification-center" /></span></div>
                    <div class="ui-widget-content">

                        <g:widgetCode template="internal/notification.center.flash" />

                    </div>
                </div>
            </div>
            <div class="ui-layout-east" id="sidebar">
                <div class="ul-container">
                    <ul class="ui-catalog-navigation-list"></ul>
                </div>
            </div>
        </div>
    </body>
</html>

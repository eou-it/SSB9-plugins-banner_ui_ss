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
        <title><g:message code="ui.catalog.index.title"/></title>

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
                <div class="jquery-ui-components component ui-widget catalog-entry">
                    <div class="ui-widget-header content-container-header"><span><g:message code="ui.catalog.widgets.jqueryui" /></span></div>
                    <div class="ui-widget-content">

                        <g:widgetCode template="buttons" />
                        <g:widgetCode template="tabs" />
                        <g:widgetCode template="datePicker" model="[ date: (new Date()).format(g.message( code: 'default.date.format')) ]" />
                        <g:widgetCode template="autoComplete.comboBox" />

                    </div>
                </div>
                <div class="data-tables-components component catalog-entry">
                    <g:widgetCode template="dataTables" />
                </div>
            </div>
            <div class="ui-layout-east" id="sidebar">
                <ul class="ui-catalog-index-list">
                    <li>
                        <span>${g.message(code: 'ui.catalog.jqueryui.widgets')}</span>
                        <ul class="ui-catalog-index-list-sub">
                            <li><span>${g.message(code: 'ui.catalog.jqueryui.buttons')}</span></li>
                            <li><span>${g.message(code: 'ui.catalog.jqueryui.tabs')}</span></li>
                        </ul>
                    </li>
                    <li><span>${g.message(code: 'ui.catalog.jqueryui.dataEntryGrid')}</span></li>
                </ul>
            </div>
        </div>
    </body>
</html>

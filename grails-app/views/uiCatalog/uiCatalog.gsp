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
        <meta name="layout" content="mainManual"/>
        <link rel="icon" href="${resource(dir: 'images/poc', file: 'events-favicon.png')}" sizes="32x32" type="image/png">
        <title><g:message code="ui.catalog.index.title"/></title>
        %{--<r:use modules="sghe-common, jquery-ui, jquery-ui-plugins, jquery-plugins, datatables"/>--}%

    </head>
    <body>
        <div class="jquery-ui-components component ui-widget catalog-entry">
            <div class="ui-widget-header"><g:message code="ui.catalog.widgets.jqueryui" /></div>
            <div class="ui-widget-content">
                <button class="button-one component"></button>
                <button class="button-two component"><g:message code="ui.catalog.button.two.label"/></button>
                <span class="button-result"></span>

                <div class="progress-bar component"></div>

                <div class="demo-tabs">
                    <ul>
                        <li><a href="#tabs-1" id="demoTabOne" class="demo-tab-one"><g:message code="ui.catalog.tab.one"/></a></li>
                        <li><a href="#tabs-2" id="demoTabTwo" class="demo-tab-two"><g:message code="ui.catalog.tab.two"/></a></li>
                    </ul>
                    <div id="tabs-1" class="ui-widget-content">
                        <span><g:message code="ui.catalog.html5" /></span>
                        <br/>
                        <input type='number' value=75 />
                    </div>
                    <div id="tabs-2" class="ui-widget-content">
                        <span><g:message code="ui.catalog.nonhtml5" /></span>
                        <br>
                        <span><g:message code="ui.catalog.only.digits" /> </span><span class='number'>17</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="ui-widget catalog-entry">
            <div class="ui-widget-header"><g:message code="ui.catalog.datatables.demo"/></div>
            <div class="ui-widget-content">
                <table class="display" id="demoPersonTable" data-endpoint="${createLink(controller:"uiCatalog", action:"demoPersonTableData")}">
                    <thead>
                        <tr>
                            <th id="first-name-col"><g:message code="ui.catalog.first.name"/></th>
                            <th id="last-name-col"><g:message code="ui.catalog.last.name"/></th>
                            <th id="banner-id-col"><g:message code="ui.catalog.banner.id"/></th>
                            <th id="birth-date-col"><g:message code="ui.catalog.birth.date"/></th>
                            <th id="phone-col"><g:message code="ui.catalog.phone"/></th>
                            <th id="email-col"><g:message code="ui.catalog.email"/></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </body>
</html>

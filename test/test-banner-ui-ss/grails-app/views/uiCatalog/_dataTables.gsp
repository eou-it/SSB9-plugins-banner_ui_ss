<div class="ui-widget">
    <div class="ui-widget-header content-container-header">
        <span><g:message code="ui.catalog.datatables.demo"/></span>
    </div>
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

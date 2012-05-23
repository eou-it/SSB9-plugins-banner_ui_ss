<div class="ui-widget">
    <div class="echo-endpoint" data-endpoint="${createLink(controller:"uiCatalog", action:"echo")}"></div>
    <div class="ui-widget-header content-container-header">
        <span><g:message code="ui.catalog.datatables.demo"/></span>
    </div>
    <div class="ui-widget-content">
        <table class="display" id="demoPersonTable" data-endpoint="${request.contextPath}/ssb/resource/demoPerson">
            <thead>
                <tr>
                    <th id="first-name-col" class="biodem-firstName"><g:message code="ui.catalog.first.name"/></th>
                    <th id="last-name-col"  class="biodem-lastName"><g:message code="ui.catalog.last.name"/></th>
                    <th id="banner-id-col"  class="biodem-bannerId"><g:message code="ui.catalog.banner.id"/></th>
                    <th id="phone-col"      class="biodem-phone"><g:message code="ui.catalog.phone"/></th>
                    <th id="email-col"      class="biodem-email"><g:message code="ui.catalog.email"/></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        <button class="demo-person-refresh-button"><g:message code="default.button.refresh.label" /></button>
        <button class="demo-person-save-button"><g:message code="default.button.save.label" /></button>
    </div>
</div>

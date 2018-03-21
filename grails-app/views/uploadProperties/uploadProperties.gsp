<%-- Copyright 2017-2018 Ellucian Company L.P. and its affiliates. --%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html xmlns:ng="http://angularjs.org" ng-strict-di>
<head>
    <title><g:message code="upload.properties.title"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="menuEndPoint" content="${g.createLink(controller: 'selfServiceMenu', action: 'data')}" />
    <meta name="menuBaseURL" content="${request.contextPath}/ssb"/>
    <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
        <r:require modules="uploadPropertiesRTL"/>
    </g:if>
    <g:else>
        <r:require modules="uploadPropertiesLTR"/>
    </g:else>
    <g:applyLayout name="bannerWebPage">
    </g:applyLayout>

    <link rel="apple-touch-icon" sizes="57x57" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-57x57.png"/>
    <link rel="apple-touch-icon" sizes="60x60" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-60x60.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-72x72.png"/>
    <link rel="apple-touch-icon" sizes="76x76" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-76x76.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-114x114.png"/>
    <link rel="apple-touch-icon" sizes="120x120" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-120x120.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-144x144.png"/>
    <link rel="apple-touch-icon" sizes="152x152" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-152x152.png"/>
    <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/apple-touch-icon-180x180.png"/>
    <link rel="icon" type="image/png" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/favicon-32x32.png" sizes="32x32"/>
    <link rel="icon" type="image/png" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/android-chrome-192x192.png" sizes="192x192"/>
    <link rel="icon" type="image/png" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/favicon-96x96.png" sizes="96x96"/>
    <link rel="icon" type="image/png" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/favicon-16x16.png" sizes="16x16"/>
    <link rel="manifest" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/manifest.json"/>
    <meta name="msapplication-TileColor" content="#9f00a7"/>
    <meta name="msapplication-TileImage" content="https://cdn.elluciancloud.com/assets/1.3.0/favicon/mstile-144x144.png"/>
    <meta name="theme-color" content="#783084"/>
    <link rel="icon" href="https://cdn.elluciancloud.com/assets/1.3.0/favicon/favicon.ico"/>

</head>

<body>

<div id="content" ng-app="uploadProperties">

<div id="uploadContent" ng-controller="uploadPropCtrl">
<div id="header1">
    <h2><g:message code="upload.properties.header1.content"/></h2>
    <span><g:message code="upload.properties.header1.subcontent"/></span>
</div>

<div id="header2">
    <h2><g:message code="upload.properties.header2.content"/></h2>
    <span><g:message code="upload.properties.header2.subcontent"/></span>
    <div>
        <select ng-model="selectedLanguage" place class="pb-block pb-select pb-item  ng-valid ng-touched ng-dirty ng-valid-parse"
                ng-change="selectCheckbox()">
            <option ng-repeat="x in lanProperties" value="{{x.code}}">{{x.language}}</option>
        </select>
    </div>
</div>

<div id="checkboxSection" ng-hide="!selectedLanguage">
    <div class="catalog-entry-sub">
        <div>
            <g:message code="upload.properties.other.message"/>
        </div>
        <div xe-field="checkboxInput" id="checkboxInputContainer" aria-labelledby="checkboxInputLabel">
            <div ng-repeat="x in lanProperties" ng-if="x.code"  class="pb-detail-item-container pb-boolean">
                <input type="checkbox" name="checkboxInput" id="checkboxInput{{x.code}}" value="{{x.code}}"
                       class="pb-block pb-boolean pb-item  ng-untouched ng-valid ng-dirty ng-valid-parse">
                <label class="pb-block pb-boolean pb-item pb-label" for="checkboxInput{{x.code}}">
                    {{x.language}}
                </label>

            </div>
        </div>

        <div>
            <h2><g:message code="upload.properties.header3.content"/></h2>
            <button class="pb-block pb-button pb-item primary" ng-click="uploadFiles()" ng-disabled="isDisabled"
                    ng-model="isDisabled"><g:message code="upload.properties.uploadall.properties"/></button>
            <div xe-field="file">
                <label class="pb-block pb-number pb-item pb-label  " for="files-saved">
                    <g:message code="upload.properties.files.saved"/></label>
                <input id="files-saved" class="text-field" ng-model="name" value="{{filesSaved}}"/>
            </div>
            <div xe-field="total">
                <label for="total-files" class="pb-block pb-number pb-item pb-label  ">
                    <g:message code="upload.properties.total.files"/></label>
                <input id="total-files" class="text-field" ng-model="name" value="{{propFiles.length}}"/>
            </div>
            <div xe-field="resource">
                <label for="resource-saved" class="pb-block pb-number pb-item pb-label  ">
                    <g:message code="upload.properties.resource.processed"/></label>
                <input id="resource-saved" class="text-field" ng-model="name" value="{{textSaved}}"/>
            </div>
            <div>
                <xe-text-box xe-label="{{textboxLabel}}" ng-model="textbox.readonlyVal" xe-id="readonly" xe-type="text"
                             xe-placeholder="{{textboxPlaceholderReadonly}}" xe-readonly="true">
                    </xe-text-box>
                </div>
            <div>
                <div class="pb-detail-item-container pb-boolean">
                    <input  type="checkbox" name="checkboxInputAd" id="checkboxInputAdvanced" ng-model="tablehide"
                           class="pb-block pb-boolean pb-item  ng-untouched ng-valid ng-dirty ng-valid-parse" >
                    <label class="pb-block pb-boolean pb-item pb-label" for="checkboxInputAdvanced">
                        <g:message code="upload.properties.input.advanced"/>
                    </label>
                </div>
                <div ng-hide="!tablehide">
                    <div style="overflow-y: scroll; height:400px;">
                    <div class="ui-widget-header content-container-header">
                        <span> <g:message code="upload.properties.resources"/></span>
                    </div>
                    {{name}}
                    <div class="ui-widget-content" xe-field="propFiles">
                        <table class="display" id="demoPersonTable">
                            <thead>
                            <tr>
                                <th id="include-col" class="biodem-firstName">
                                    <g:message code="upload.properties.language.includeandPath"/>
                                <th id="link-col" class="biodem-bannerId"><g:message code="upload.properties.language.link"/></th>
                                <th id="loaded-col" class="biodem-phone"><g:message code="upload.properties.resource.processed"/></th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="filename in propFiles track by $index">
                                    <td>
                                        <div class="pb-detail-item-container pb-boolean">
                                           <input class="pb-block pb-boolean pb-item  ng-untouched ng-valid ng-dirty ng-valid-parse"
                                                   type="checkbox" name="checkboxTable"
                                                   id="checkboxInput{{$index}}" dataId="{{filename.id}}"
                                                   value="{{filename.basename}}">
                                            <label class="pb-block pb-boolean pb-item pb-label" for="checkboxInput{{$index}}">
                                                {{filename.basename}}
                                                </label></div>
                                    </td>
                                    <td><a href="${request.contextPath}/admin/i18n?locale={{fileLoc}}&amp;name={{filename.basename}}"
                                           target="_blank"><g:message code="upload.properties.viewother.window"/></a></td>
                                    <td id="count{{$index}}"></td>
                                </tr>
                            </tbody>
                        </table>
                </div>
                </div>
                    <div xe-section="upload-controls">
                        <button class="primary"  ng-click="uploadcheckedfiles()" >
                            <g:message code="upload.properties.uploadall.save"/></button>
                        <button class="secondary"  ng-click="resetfiles()">
                            <g:message code="upload.properties.uploadall.reset"/></button>
                    </div>
            </div>
        </div>
    </div>
</div>


</div>
</div>
</body>
</html>
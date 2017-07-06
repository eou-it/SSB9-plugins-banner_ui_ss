<!DOCTYPE html>
<%-- Copyright 2016 Ellucian Company L.P. and its affiliates. --%>

<%@ page contentType="text/html;charset=UTF-8" defaultCodec="none" %>
<html xmlns:ng="http://angularjs.org" ng-app="themeEditor" ng-strict-di>
<head>
    <title><g:message code="theme.editor.title"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="menuEndPoint" content="${g.createLink(controller: 'selfServiceMenu', action: 'data')}" />
    <meta name="menuBaseURL" content="${request.contextPath}/ssb"/>

    <g:set var="lang_dir" value="${message(code: 'default.language.direction')}" scope="page" />
    <g:if test="${lang_dir  == 'rtl'}">
        <r:require modules="themeEditorRTL"/>
    </g:if>
    <g:else>
        <r:require modules="themeEditorLTR"/>
    </g:else>
    <g:applyLayout name="bannerWebPage">
    </g:applyLayout>
</head>

<body dir="${lang_dir}">

<div id="style-container" style="display:none">
<!-- style included here so it is available to JS to replace -->
<style id="preview-style">
.theme-name-placeholder-style {
  content:/*name*/ theme-name;
}

.ui-widget-content {
    color: #333333;
}

.header {
    color: /*color1_text*/ #ffffff; /* use text version of chosen color */
}


.header h3 {
    margin: 0;
    line-height: 2.5;
}

.header a {
    margin-left: 20px;
    margin-right: auto;
    font-size: 18px;
    color: #e2bce9;
}

[dir=rtl] .header a {
    margin-left: auto;
    margin-right: 20px;
}

.themes {
    width: 500px;
    display: inline-block;
    margin: 30px 20px;
    border: 1px solid #323232;
}

.properties {
    margin-top: 30px;
}

.properties > div {
    border: 1px solid #323232;
    padding: 20px;
    background-color: #f8f8f8;
}

.properties .download-links {
    float: right;
    line-height: 3;
}

[dir=rtl] .properties .download-links {
    float: left;
}

.properties a {
    margin-right: 10px;
    margin-left: auto;
    font-size: 1.1em;
}


[dir=rtl] .properties a {
    margin-right: auto;
    margin-left: 10px;
}

.properties a:first-child {
/*    border-right: 1px solid #CCCCCC;*/
    padding: 0 10px;
}

.properties input {
    border: 2px solid /*color1-3*/#206E9F;
    padding: 10px;
    border-radius: 5px;
    background-color: /*color1-5*/#FFFFFF;
    width: 55%;
}

.themes h4, .properties h4 {
    background-color: /*color1*/#206E9F; /*use chosen color */
    color: /*color1_text*/#FFFFFF;
    padding: 10px;
    margin: 0;
}

.themes ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.themes li {
    border-bottom: 1px solid #CCCCCC;
    text-decoration: none;
    cursor: pointer;
}

.themes li:last-child {
    border-width: 2px;
}

.themes li a {
    display: block;
    padding: 15px 20px;
    font-size: 1.1em;
    text-decoration: none;
    font-weight: bold;
}

.themes button, .properties button {
    padding: 10px 20px;
    margin: 10px 20px;
    border-radius: 5px;
    border: 1px solid;
}

.properties button {
    margin: 0;
}

.preview {
    padding: 10px;
    height: 650px;
}

.preview h4 {
    background-color: #CCCCCC;
    padding: 10px;
    margin: 0 0 15px 0;
}

.preview .previewsection {
    box-shadow: 1px 1px 10px 3px #9A9A9A;
    overflow: hidden;
    margin-top: 20px;
    background-color: #f8f8f8;
}

.preview .menu {
    float: left;
    height: 685px;
    width: 65px;
}

[dir=rtl] .preview .menu {
    float: right;
 }

.preview .header {
    height: 55px;
    line-height: 2.5;
    font-size: 1.5em;
}

.preview .header span {
    margin-left: 20px;
    margin-right: auto;
}

[dir=rtl] .preview .header span {
    margin-left: auto;
    margin-right: 20px
}

.preview .right-section {
    float: right;
    height: 100%;
}

[dir=rtl] .preview .right-section {
    float: left;
}


.preview .notification, .preview .close-page {
    float: left;
    height: 100%;
    width: 60px;
}

[dir=rtl] .preview .notification, .preview .close-page {
    float: right;
}

.preview .notification {
    text-align: center;
    margin: 0 5px 0 5px;
    background-color: /*color2-3*/#FECF7F;
    color: #ffffff;
}

.preview .notification-flyout {
    position: absolute;
    right: 89px;
    left: auto;
    top: 85px;
    width: 400px;
}

[dir=rtl] .preview .notification-flyout {
    right: auto;
    left: 89px;
}

.preview .notification-flyout .message {
    background-color: /*color2-5*/ #FFFEEA;
    padding: 20px;
    border: 1px solid /*color2-2*/ #846011;
    color: /*color2-2*/ #846011;
    font-size: 1.1em;
    box-shadow: 0 -6px 0 0 /*color2-4*/#ECE6C8 inset;
}

.preview .notification-flyout .buttons {
    padding: 20px 10px;
    overflow: hidden;
    background-color: #EBEBEB;
    border: 1px solid #C6CBCD;
    width:100%;
}

.form-buttons {
    position: absolute;
    right: 35px;
    left: auto;
    bottom: 0;
}

[dir=rtl] .form-buttons {
    right: auto;
    left: 35px;
}

.form-buttons button {
    padding: 10px 20px;
    margin: 60px 10px 0 10px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    float: right;
}

[dir=rtl] .form-buttons button {
    float: left;
}

.preview .notification-flyout .buttons button {
    float: right;
    padding: 10px 20px;
    margin: 0 10px 0 10px;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
}

[dir=rtl] .preview .notification-flyout .buttons button {
    float: left;
}

.content {
    height: 100%;
}

.bread-crumb {
    font-size: 1.1em;
    border-bottom: 1px solid #E2E2E2;
    height: 50px;
    line-height: 50px;
}

.bread-crumb span {
    margin: 10px;
}

.bread-crumb span.separator {
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #C5C5C5;
    position: relative;
    top: 10px;
}

.page-title {
    margin: 20px 10px;
    font-size: 1.5em;
    display: inline-block;
}

.form {
    border-top: 1px solid #E2E2E2;
    padding: 20px 20px 20px 85px;
}

[dir=rtl] .form {
    padding: 20px 85px 20px 20px;
}

.tabs {
    height: 100px;
    width: 100%;
    background-color: #FFFFFF;
    margin-top: 20px;
    border-bottom: 1px solid #B9B9B9;
}

.tabs > div {
    display: inline-block;
    padding: 35px 25px;
    font-size: 1.3em;
}

.tabs > div.active {
    font-weight: bold;
    border-bottom-width: 4px;
    border-bottom-style: solid;
}


.group {
    border: 1px solid #393939;
    background-color: #f8f8f8;
}

.inputs {
    overflow: hidden;
    padding: 20px;
}

.inputs [name=container] {
    height: 100px;
}

.inputs label {
    display: block;
}

.inputs select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    position: relative;
}

.chevron-down {
    height: 40px;
    width: 40px;
    position: absolute;
    top: 0;
    left: 0;
    right: auto;
}

[dir=rtl] .chevron-down {
    left: auto;
    right: 0;
}

.inputs input, .inputs select {
    border-width: 2px;
    border-style: solid;
    padding: 10px;
    border-radius: 5px;
    background-color: #FFFFFF;
    width: 70%;
}

.badges span {
    padding: 5px 10px;
    border-width: 1px;
    border-style: solid;
    border-radius: 5px;
}

span.pending {
    background-color: #EDEBFE;
    border: 1px solid #897FD0;
}

span.approved {
    background-color: #E2FDF1;
    border: 1px solid #47A173;
}

.chevron-down {
    width: 15px;
    height: 14px;
    margin: -2px -30px;
    position: relative;
}

.global-nav svg,  .close-page svg {
    margin: 10px;
}

.preview .primary,
.preview .primary:hover:not([disabled]),
.preview .primary:active:not([disabled]) {
    color: /*color1-2*/ #393939;
    background-color: /*color1-5*/ #16fc16;
    border-color: /*color1-1*/ #00a400;
    box-shadow: /*color1-1*/ #00a400 0px -4px 0px 0px inset;
}

.preview .secondary,
.preview .secondary:hover:not([disabled]),
.preview .secondary:active:not([disabled]) {
    color: /*color2-2*/ #393939;
    background-color: /*color2-5*/ #b9b9b9;
    border-color: /*color2-1*/ #797979;
    box-shadow: /*color2-1*/ #797979 0px -4px 0px 0px inset;
}

.preview button.tertiary {
    color: #000000;
    background-color: #FFFFFF;
    border: 1px solid #999999;
    box-shadow: 0 -4px 0 0 #E0E0E0 inset;
}

.bg-colors-dark-subsectionHeading {
    background-color: #393939;
}

.colors-dark-headerBackground {
    color: /*color1*/ #a40000; /* Use chosen color */
}

.border-colors-dark-headerBackground {
    border-color: /*color1-3*/ #a40000;
}

.bg-colors-dark-headerBackground {
    background-color: /*color1*/ #a40000;
}

.color-dark-headerTextColor {
    color: /*color1_text*/ #ffffff;
}


.bg-colors-dark-cardListTextColor {
    background-color: #f8f8f8;
}

.colors-dark-globalNavMobileTextColor {
    color: /*color3-2*/ #008b00;
}

.bg-colors-dark-cardListTextColor {
    backgroundColor: #f8f8f8;
}

.colors-dark-globalNavMobileTextColor {
    color: /*color3-2*/ #008b00;
}

.colors-dark-overlayContainerBorder {
    color: #868686;
}

 /* general styles */
 * {
    transition: background-color 0.75s ease, border-color 0.75s ease, color 0.75s ease;
}

#content {
    padding-top:0px;
}

#content, .ui-widget {
    font-size: 14px;
    font-family: "Open Sans", "Helvetica Neue",Helvetica,Arial,sans-serif;
    line-height: 1.42857143;
}


dev[ng-model="theme"] {
    border: 1px solid #888;
}

[xe-field] {
    padding: .5em 0;
}

[xe-section="theme"] input {
    width: 10em;
}

.color-picker-wrapper {
    width:15em;
    display:inline-block;
}

[xe-section="theme-controls"] {
    margin-top:1em;
}

.derived {
    display:none;
    height: 3em;
    vertical-align: top;
    padding: 0 2em;
}

.derived span {
    line-height:3em;
}

.swatch {
    display: inline-block;
    width: 2em;
    height: 2em;
    vertical-align: middle;
    border: 1px dotted #cccccc;
    line-height: 1.5em !important;
    padding: 0 .5em;
}

.w20 {
    display: inline-block;
    width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
}
.w10 {
    display: inline-block;
/*    width:15%;*/
}
.center {
    text-align: center;
}

</style>
</div>

<div id="content">
  <div class="col-md-4 properties" data-reactid=".0.1.0.0">
    <section id="themeComponent">
        <h4><g:message code="theme.editor.title"/></h4>
        <div ng-model="theme" class="inputs group" ng-controller="themeEditorCtrl" xe-section="theme"><!-- xe-theme-editor -->
          <div xe-field="name">
            <label for="theme-name"><g:message code="theme.name"/></label>
            <input id="theme-name" style="width:50%" ng-model="name"></input>
          </div>
          <div xe-field="color1">
            <label for="theme-color1"><g:message code="theme.color1"/></label>
            <color-picker ng-model="color1",
              color-picker-format="'hex'"
              color-picker-alpha="false"
              ></color-picker>
            <span class="derived">
              <span class="swatch" style="color:{{color1-4}};background-color:{{color1-1}}">#</span>
              <span>{{color1_dark}}</span>
              <span class="swatch" style="color:{{color1-2}};background-color:{{color1-5}}">#</span>
              <span>{{color1_light}}</span>
            </span>
          </div>
          <div xe-field="color2">
            <label for="theme-color2"><g:message code="theme.color2"/></label>
            <color-picker ng-model="color2"
              color-picker-format="'hex'"
              color-picker-alpha="false"
              ></color-picker>
            <span class="derived">
              <span class="swatch" style="color:{{color2-4}};background-color:{{color2-1}}">#</span>
              <span>{{color2_dark}}</span>
              <span class="swatch" style="color:{{color2-2}};background-color:{{color2-5}}">#</span>
              <span>{{color2_light}}</span>
            </span>
          </div>
          <div xe-field="color3">
            <label for="theme-color3"><g:message code="theme.color3"/></label>
            <color-picker ng-model="color3"
              color-picker-format="'hex'"
              color-picker-alpha="false"
              ></color-picker>
            <span class="derived">
              <span class="swatch" style="color:{{color3-4}};background-color:{{color3-1}}">#</span>
              <span>{{color3_dark}}</span>
              <span class="swatch" style="color:{{color3-2}};background-color:{{color3-5}}">#</span>
              <span>{{color3_light}}</span>
            </span>
          </div>

          <div xe-field="logo" class="prop">
            <label for="theme-logo" class="name"><g:message code="theme.logo"/></label>
            <input class="value" style="width:100%" id="theme-logo" ng-model="logo"></input>
            <div class="input-lg" style="margin-top:.5em; height:3em;background:{{color1}} url({{logo}}) 1em center no-repeat"></div><!-- TODO:remove<img style='display:none' src='{{logo}}'/>-->
          </div>

<!--          <div xe-field="css" class="prop">
            <label for="theme-css" class="name"><g:message code="theme.css"/></label>
            <input class="value" style="width:100%" id="theme-css" ng-model="css"></input>
          </div>
-->
          <div xe-section="theme-controls">
            <button class="primary" xe-field="theme-save" ng-click="saveTheme()"><g:message code="theme.save"/></button>
            <button class="secondary" xe-field="theme-new" ng-click="newTheme()"><g:message code="theme.new"/></button>
          </div>

          <p></p>
        <br/>
        <div xe-section="theme-upload">
            <input id="file" type="file" id="file" style="width:100%" ng-files="getTheFiles($files)" onchange="angular.element(this).scope().uploadfilechange(this)"><br/>
            <button class="primary" ng-click="uploadFiles()" ng-disabled="isDisabled" ng-model="isDisabled"><g:message code="theme.upload"/></button>
        </div>

            <p></p>

          <h3 xe-for="themes"><g:message code="theme.savedThemes"/></h3>
          <ul xe-field="themes">
            <li style="margin:.2em 0" ng-repeat="theme in themes | orderBy: 'theme'">
                <span class="w20">{{theme}}</span>
                <button class="secondary" ng-click="setTheme(theme)"><g:message code="theme.applyTheme" args="['']" notargs="['{{theme}}']"/></button>
                <button class="tertiary" ng-click="deleteTheme(theme)"><g:message code="theme.deleteTheme" args="['']"/></button>
                <span class="w10">
                    <a href="theme/get?name={{theme}}" class="center"><g:message code="theme.json"/></a>
                </span>
            </li>
          </ul>

            <h3 xe-for="templates"><g:message code="theme.savedTemplates"/></h3>
            <ul xe-field="templates">
                <li style="margin:.2em 0" ng-repeat="template in templates | orderBy: 'template'">
                    <span class="w20" title="{{template}}">{{template}}</span>
                    <button class="tertiary" ng-click="deleteTemplate(template)"><g:message code="theme.deleteTheme" args="['']"/></button>
                    <span class="w10">
                        <a href="theme/getTemplate?name={{template}}" class="center"><g:message code="template.scss"/></a>
                    </span>
                </li>
            </ul>
        </div>
    </section>
  </div>

  <div class="col-md-8" >
    <div class="preview" >
      <div class="previewsection" >
        <div class="menu bg-colors-dark-subsectionHeading">
          <div class="global-nav" >
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <path d="M37.5,30.5h-27c-1.2,0-2.3,1-2.3,2.2c0,1.2,1,2.2,2.3,2.2h27 c1.2,0,2.3-1,2.3-2.2C39.8,31.4,38.8,30.5,37.5,30.5z M10.5,17.5h27c1.2,0,2.3-1,2.3-2.2c0-1.2-1-2.2-2.3-2.2h-27 c-1.2,0-2.3,1-2.3,2.2C8.2,16.6,9.2,17.5,10.5,17.5z M37.5,21.8h-27c-1.2,0-2.3,1-2.3,2.2c0,1.2,1,2.2,2.3,2.2h27 c1.2,0,2.3-1,2.3-2.2C39.8,22.8,38.8,21.8,37.5,21.8z"  fill="#cdcdcd"></path>
            </svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <path d="M25.3,9.7c-0.7-0.8-1.9-0.8-2.6,0L8.6,24.6C7.9,25.3,8.1,26,9.2,26 h2.9v11.4c0,0.8,0,1.5,1.4,1.5h6.8V27.5h7.2v11.5h7.2c1.1,0,1.1-0.7,1.1-1.5V26h2.9c1.1,0,1.3-0.6,0.6-1.4L25.3,9.7z"  fill="#cdcdcd"></path>
            </svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <path d="M21.5,12.9c-4.7,0-8.6,3.9-8.6,8.6c0,4.8,3.9,8.6,8.6,8.6 s8.6-3.9,8.6-8.6C30.2,16.8,26.3,12.9,21.5,12.9 M37.5,40c-0.7,0-1.3-0.3-1.7-0.7l-6.6-6.6c-2.2,1.6-4.9,2.4-7.7,2.4 C14.1,35.1,8,29,8,21.5C8,14.1,14.1,8,21.5,8c7.5,0,13.5,6.1,13.5,13.5c0,2.7-0.8,5.4-2.4,7.7l6.6,6.6c0.4,0.4,0.7,1.1,0.7,1.7 C40,38.9,38.9,40,37.5,40"  fill="#cdcdcd"></path>
            </svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <path d="M10.1,18.2L5.5,39V9h10.4l4.6,4.6h15v4.6H10.1z M35.6,39l6.9-18.5 H12.4L5.5,39H35.6z"  fill="#cdcdcd"></path>
            </svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <path d="M11,26.9l4.3-5.7H6.6L11,26.9z M24.7,24.5l7.6,4.4l0.7-1.2l-6.8-4 V14h-1.5V24.5z M9.8,21.1c1.4-7.3,7.9-12.9,15.7-12.9c8.8,0,15.9,7,15.9,15.7s-7.1,15.7-15.9,15.7c-6.2,0-11.6-3.5-14.2-8.6h3.4 c2.3,3.4,6.3,5.7,10.8,5.7c7.2,0,13-5.8,13-12.9s-5.8-12.9-13-12.9c-6.2,0-11.4,4.3-12.7,10H9.8z"  fill="#cdcdcd"></path>
            </svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <polyline points="39.6,20.3 28.8,18.7 24,8.4 19.2,18.7 8.4,20.3  16.2,28.3 14.4,39.6 24,34.2 33.6,39.6 31.8,28.3 39.6,20.3 "  fill="#cdcdcd"></polyline>
            </svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <path d="M33.7,35c0-0.2,0-0.3,0-0.5v-1.9c0-0.3,0-1.2-0.1-1.9 c0,0,0-0.2-0.2-0.9c-0.2-0.5-0.4-1-0.6-1.4c-0.3-0.5-0.6-1-1.1-1.5c-0.3-0.4-0.7-0.7-1.1-1c-0.4-0.3-0.9-0.6-1.4-0.8 c-0.6-0.3-1.3-0.5-2-0.6l-0.4-0.1c-0.1,0-0.1,0-0.2,0c1.8-0.9,3-2.7,3-4.8c0-3-2.5-5.4-5.6-5.4c-3.1,0-5.6,2.4-5.6,5.4 c0,2.1,1.2,3.9,3,4.8c-0.2,0-0.5,0-0.7,0c0,0,0,0-0.6,0.1c-0.5,0.1-1,0.3-1.4,0.5c-0.5,0.2-1,0.5-1.4,0.8c-0.4,0.3-0.8,0.7-1.2,1.1 c-0.3,0.3-0.5,0.6-0.7,0.9c-0.2,0.3-0.4,0.7-0.5,1.1c-0.2,0.4-0.3,0.8-0.4,1.3l-0.1,0.5c0,0.6-0.1,1.5-0.1,2v1.9V35 c-3.2-2.7-5.2-6.6-5.2-11c0-8,6.7-14.5,14.8-14.5c8.2,0,14.8,6.5,14.8,14.5C38.8,28.4,36.8,32.3,33.7,35z M24,8.4 c-8.8,0-16,7-16,15.6s7.2,15.6,16,15.6c8.8,0,16-7,16-15.6S32.8,8.4,24,8.4z"  fill="#cdcdcd"></path>
            </svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
              <path d="M23.5,32.5c-2.1-0.1-3.8,1.3-3.9,3.5c-0.1,2.1,1.6,3.6,3.6,3.6 c2.2,0.1,3.8-1.3,3.9-3.4C27.3,34.1,25.7,32.6,23.5,32.5z M31.5,10.5c-2.1-1.4-4.7-2.1-7.8-2.1c-2.4,0-4.4,0.5-6.1,1.5 c-2.6,1.6-4,4.2-4.2,8h6c0-1.1,0.3-2.2,1-3.2c0.7-1,1.8-1.5,3.4-1.5c1.6,0,2.8,0.4,3.4,1.2c0.6,0.8,0.9,1.7,0.9,2.7 c0,0.9-0.5,1.7-1,2.4c-0.3,0.4-0.7,0.8-1.2,1.2c0,0-3.3,2-4.7,3.6c-0.8,0.9-0.9,2.3-1,4.3c0,0.1,0.1,0.4,0.6,0.4h4.7 c0.5,0,0.6-0.3,0.6-0.5c0-0.7,0.1-1.1,0.3-1.5c0.3-0.8,1-1.5,1.8-2.1l1.7-1.1c1.5-1.1,2.7-2,3.2-2.7c0.9-1.2,1.5-2.6,1.5-4.3 C34.6,14.1,33.6,12,31.5,10.5z"  fill="#cdcdcd"></path>
            </svg>
          </div>
        </div>
        <div class="header bg-colors-dark-headerBackground">
            <span  class="color-dark-headerTextColor"><g:message code="theme.preview.title"/></span>
          <div class="right-section" >
            <div class="notification" ><g:message code="theme.preview.notification.count"/></div>
            <div class="close-page" >
              <div >
                <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" >
                  <path fill="#FFFFFF" d="M26.3,24l9.1-9c0.6-0.6,0.6-1.6,0-2.3c-0.6-0.6-1.7-0.6-2.3,0 l-9.1,9l-9.1-9c-0.6-0.6-1.7-0.6-2.3,0c-0.6,0.6-0.6,1.6,0,2.3l9.1,9l-9.1,9c-0.6,0.6-0.6,1.6,0,2.3s1.7,0.6,2.3,0l9.1-9l9.1,9 c0.6,0.6,1.7,0.6,2.3,0c0.6-0.6,0.6-1.6,0-2.3L26.3,24" ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="content bg-colors-dark-cardListTextColor">
          <div class="bread-crumb" >
            <span  class="colors-dark-globalNavMobileTextColor"><g:message code="theme.preview.breadcrumb"/></span>
            <span class="separator" ></span>
            <span  class="colors-dark-globalNavMobileTextColor"><g:message code="theme.preview.page.title"/></span>
          </div>
          <div class="page-title" >
            <span  class="colors-dark-headerBackground"><g:message code="theme.preview.page.title"/></span>
          </div>
          <div class="form" >
            <div class="tabs" >
              <div class="active border-colors-dark-headerBackground"><g:message code="theme.preview.activetab"/></div>
              <div  class="colors-dark-overlayContainerBorder"><g:message code="theme.preview.defaulttab"/></div>
            </div>
            <div class="inputs" >
              <div name="container">
                <div class="col-md-6" >
                  <label ><g:message code="theme.preview.samplelabel"/></label>
                  <input  class="border-colors-dark-headerBackground"></div>
                  <div class="col-md-6" >
                    <label ><g:message code="theme.preview.samplelabel"/></label>
                    <div class="select-container" >
                      <select  class="border-colors-dark-headerBackground">
                        <option ><g:message code="theme.preview.selectone"/></option>
                      </select>
                      <span >
                        <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="-343 272 10 10" class="chevron-down" >
                          <g id="Page-1" >
                            <g id="Design" transform="translate(-1025.000000, -1333.000000)" >
                              <g id="Group-Copy-2" transform="translate(64.000000, 341.000000)" >
                                <g id="Group-Copy" transform="translate(20.000000, 222.000000)" >
                                  <g id="Group-_x2B_-button-shape-_x2B_-button-shape-_x2B_-back-_x2B_-start-_x2B_-Results-found-32" transform="translate(20.000000, 753.000000)" >
                                    <g id="Group" transform="translate(566.000000, 0.000000)" >
                                      <g id="Shape-13" transform="translate(233.000000, 0.000000)" >
                                        <path d="M-221,291.6l5,4.9l5-4.9H-221z"  fill="#a40000"></path>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              <div>
              <div class="badges" >
                <div class="col-md-6" >
                  <span class="pending" ><g:message code="theme.preview.pending"/></span>
                </div>
                <div class="col-md-6" >
                  <span class="approved" ><g:message code="theme.preview.approved"/></span>
                </div>
              </div>
              <div class="form-buttons" >
                <button class="primary"><g:message code="theme.preview.primary"/></button>
                <button class="secondary" ><g:message code="theme.preview.secondary"/></button>
                <button class="tertiary" ><g:message code="theme.preview.tertiary"/></button>
              </div>
            </div>
          </div>
        </div>
        <div class="notification-flyout" >
          <div class="message" ><g:message code="theme.preview.savechanges"/></div>
          <div class="buttons" >
            <button class="primary" ><g:message code="theme.preview.yes"/></button>
            <button class="secondary" ><g:message code="theme.preview.no"/></button>
            <button class="tertiary" ><g:message code="theme.preview.cancel"/></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>

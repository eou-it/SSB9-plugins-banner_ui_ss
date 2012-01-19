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
<!DOCTYPE html>
<html lang="${message(code: 'default.language.locale')}">
    <head>
        <r:require module="bannerSelfService"/>

        <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
           <r:require module="bannerSelfServiceRTL"/>
        </g:if>
        <g:set var="mep" value="${org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()?.request?.session?.getAttribute('ssbMepDesc')}"/>

        <meta charset="${message(code: 'default.character.encoding')}"/>
        <meta name="dir" content="${message(code:'default.language.direction')}"/>
        <meta name="synchronizerToken" content="${org.codehaus.groovy.grails.web.servlet.mvc.SynchronizerToken.store( session ).currentToken}"/>
        <meta name="logLevel" content="${g.logLevel()}"/>
        <meta name="maxInactiveInterval" content="${session.maxInactiveInterval}"/>
        <meta name="keepAliveURL" content="${createLink(controller:'keepAlive')}"/>
        <meta name="ssbMepDesc" content="${!mep ? '' : mep}"/>
        <meta name="fullName" content="${g.fullName()}"/>

        <title><g:layoutTitle default="Banner"/></title>

        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon"/>

        <r:script>
            <g:i18nJavaScript/>

            yepnope({
               test : window.JSON,
               nope : '${resource(plugin: 'banner-ui-ss', file: 'js/json2.js')}'
            });

            $(document).ready(function() {
                _.defer( function() {
                    $( "#splash" ).remove();
                });
            });
        </r:script>

        <r:layoutResources/>

        <g:layoutHead />

        <g:customStylesheetIncludes/>

    </head>
    <body>
        <div id="splash"></div>
        <div id="spinner" class="spinner spinner-img" style="display:none;">

        </div>

        <g:layoutBody />

        <r:layoutResources/>

        <g:customJavaScriptIncludes/>
    </body>
</html>


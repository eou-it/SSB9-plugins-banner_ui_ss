<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springframework.context.i18n.LocaleContextHolder" %>

<%--
Copyright 2009-2015 Ellucian Company L.P. and its affiliates.
--%>
<!DOCTYPE html>
<html lang="${message(code: 'default.language.locale')}">
    <head>
        <script>
            var extensibilityInfo =
                    ${raw(net.hedtech.extensibility.InfoService.getJSON(controllerName, resource(plugin:'web-app-extensibility', dir:'html')))};
        </script>
        <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
            <r:require modules="bannerWebRTL"/>
        </g:if>
        <g:else>
            <r:require modules="bannerWebLTR"/>
        </g:else>

        <g:set var="mep" value="${org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()?.request?.session?.getAttribute('ssbMepDesc')}"/>

        <meta charset="${message(code: 'default.character.encoding')}"/>
        <meta name="dir" content="${message(code:'default.language.direction')}"/>
        <meta name="synchronizerToken" content="${org.codehaus.groovy.grails.web.servlet.mvc.SynchronizerTokensHolder.store( session ).generateToken(request.forwardURI)}"/>
        <meta name="logLevel" content="${g.logLevel()}"/>
        <meta name="maxInactiveInterval" content="${session.maxInactiveInterval}"/>
        <meta name="transactionTimeout" content="${session.getServletContext().transactionTimeout}"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="images/applicationIcon.png" />
        <link rel="apple-touch-startup-image" href="images/applicationStartup.png">
        <meta name="keepAliveURL" content="${createLink(controller:'keepAlive')}"/>
        <meta name="ssbMepDesc" content="${!mep ? '' : mep}"/>
        <meta name="fullName" content="${g.fullName()}"/>
        <meta name="loginEndpoint" content="${session.getServletContext().loginEndpoint}"/>
        <meta name="logoutEndpoint" content="${session.getServletContext().logoutEndpoint}"/>
        <meta name="guestLoginEnabled" content="${session.getServletContext().guestLoginEnabled}"/>
        <meta name="userLocale" content="${LocaleContextHolder.getLocale()}"/>
        <meta name="footerFadeAwayTime" content="${grails.util.Holders.config.footerFadeAwayTime}"/>
        <title><g:layoutTitle default="Banner"/></title>

        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon"/>


        <r:script>
            <g:i18nJavaScript/>

            var transactionTimeoutMeta    = $( "meta[name=transactionTimeout]" ),
                transactionTimeoutSeconds = ( transactionTimeoutMeta.length == 1 ? parseInt( transactionTimeoutMeta.attr( "content" ) ) : 30 ),
                transactionTimeoutPadding = 10 * 1000,
                transactionTimeoutMilli   = ( transactionTimeoutSeconds * 1000 ) + transactionTimeoutPadding;

            $.ajaxSetup( { timeout: transactionTimeoutMilli } );

            yepnope({
               test : window.JSON,
               nope : '${resource(plugin: 'banner-ui-ss', file: 'js/json2.js')}'
            });

            $(window).load(function() {
                _.defer( function() {
                    $( "#splash" ).remove();
                });
            });
        </r:script>

        <r:layoutResources/>

        <g:layoutHead />

        <g:customStylesheetIncludes/>

        <!-- !!TODO convert to taglib -->
        <g:set var="themeConfig" value="${grails.util.Holders.config.banner.theme}"/>
        <meta name="theme" content="${themeConfig.name}">
        <g:if test="${themeConfig.url}">
            <link rel="stylesheet" type="text/css" href="${themeConfig.url}/getTheme?name=${!mep ? themeConfig.name : mep}&template=${themeConfig.template}&mepCode=${mep}">
        </g:if>
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

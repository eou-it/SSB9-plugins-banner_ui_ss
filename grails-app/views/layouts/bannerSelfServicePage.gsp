<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springframework.context.i18n.LocaleContextHolder" %>

<%--
Copyright 2009-2018 Ellucian Company L.P. and its affiliates.
--%>
<!DOCTYPE html>
<html lang="${message(code: 'default.language.locale')}">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
    %{--<r:require modules="bannerSelfServiceRTL"/>--}%
        <asset:javascript src="modules/bannerSelfServiceRTL-mf.js"/>
        <asset:stylesheet href="modules/bannerSelfServiceRTL-mf.css"/>
    </g:if>
    <g:else>
    %{--<r:require modules="bannerSelfService"/>--}%
        <asset:javascript src="modules/bannerSelfService-mf.js"/>
        <asset:stylesheet href="modules/bannerSelfService-mf.css"/>
    </g:else>
    <g:set var="mep" value="${org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()?.request?.session?.getAttribute('ssbMepDesc')}"/>
    <g:set var="hideSSBHeaderComps" value="${session.hideSSBHeaderComps?session.hideSSBHeaderComps: params?.hideSSBHeaderComps? params.hideSSBHeaderComps:false} " scope="session" />
    <g:set var="aboutServiceUrl" value="${net.hedtech.banner.controllers.ControllerUtils.aboutServiceUrl()}" />

    <meta charset="${message(code: 'default.character.encoding')}"/>
    <meta name="dir" content="${message(code:'default.language.direction')}"/>
    <meta name="synchronizerToken" content="${org.grails.web.servlet.mvc.SynchronizerTokensHolder.store( session ).generateToken(request.forwardURI)}"/>
    <meta name="maxInactiveInterval" content="${session.maxInactiveInterval}"/>
    <meta name="transactionTimeout" content="${grails.util.Holders.config.transactionTimeout}"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <asset:link rel="apple-touch-startup-image" href="applicationStartup.png"/>
    <meta name="keepAliveURL" content="${createLink(controller:'keepAlive')}"/>
    <meta name="ssbMepDesc" content="${!mep ? '' : mep}"/>
    <meta name="fullName" content="${g.fullName()}"/>
    <meta name="loginEndpoint" content="${grails.util.Holders.config.loginEndpoint}"/>
    <meta name="logoutEndpoint" content="${grails.util.Holders.config.logoutEndpoint}"/>
    <meta name="guestLoginEnabled" content="${grails.util.Holders.config.guestLoginEnabled}"/>

    <g:set var="userLocale1" value="${org.springframework.context.i18n.LocaleContextHolder.getLocale()}" />
    userLocale:::${userLocale}
    <meta name="userLocale" value="${userLocale1}"/>

    %{--<meta name="userLocale" content="${LocaleContextHolder.getLocale()}"/>--}%
    <meta name="footerFadeAwayTime" content="${grails.util.Holders.config.footerFadeAwayTime}"/>
    <meta name="hideSSBHeaderComps" content="${session?.hideSSBHeaderComps?.trim()}">
    <meta name="aboutUrl" content="${!aboutServiceUrl ? '' : aboutServiceUrl}"/>
    <meta name="aboutUrlContextPath" content="${request.contextPath}/ssb"/>
    <title><g:layoutTitle default="Banner"/></title>

    <asset:script>
    %{-- <g:i18nJavaScript/>--}%

        var transactionTimeoutMeta    = $( "meta[name=transactionTimeout]" ),
            transactionTimeoutSeconds = ( transactionTimeoutMeta.length == 1 ? parseInt( transactionTimeoutMeta.attr( "content" ) ) : 30 ),
            transactionTimeoutPadding = 10 * 1000,
            transactionTimeoutMilli   = ( transactionTimeoutSeconds * 1000 ) + transactionTimeoutPadding;

        $.ajaxSetup( { timeout: transactionTimeoutMilli } );

        yepnope({
           test : window.JSON,
           nope : '${assetPath(src: 'json2.js')}'
            });

            $(window).load(function() {
                _.defer( function() {
                    $( "#splash" ).remove();
                });
            });
    </asset:script>


    <asset:link rel="apple-touch-icon" sizes="57x57" href="eds/apple-touch-icon-57x57.png"/>
    <asset:link rel="apple-touch-icon" sizes="60x60" href="eds/apple-touch-icon-60x60.png"/>
    <asset:link rel="apple-touch-icon" sizes="72x72" href="eds/apple-touch-icon-72x72.png"/>
    <asset:link rel="apple-touch-icon" sizes="76x76" href="eds/apple-touch-icon-76x76.png"/>
    <asset:link rel="apple-touch-icon" sizes="114x114" href="eds/apple-touch-icon-114x114.png"/>
    <asset:link rel="apple-touch-icon" sizes="120x120" href="eds/apple-touch-icon-120x120.png"/>
    <asset:link rel="apple-touch-icon" sizes="144x144" href="eds/apple-touch-icon-144x144.png"/>
    <asset:link rel="apple-touch-icon" sizes="152x152" href="eds/apple-touch-icon-152x152.png"/>
    <asset:link rel="apple-touch-icon" sizes="180x180" href="eds/apple-touch-icon-180x180.png"/>
    <asset:link rel="shortcut icon" type="image/png" href="eds/favicon-32x32.png" sizes="32x32"/>
    <asset:link rel="shortcut icon" type="image/png" href="eds/android-chrome-192x192.png" sizes="192x192"/>
    <asset:link rel="shortcut icon" type="image/png" href="eds/favicon-96x96.png" sizes="96x96"/>
    <asset:link rel="shortcut icon" type="image/png" href="eds/favicon-16x16.png" sizes="16x16"/>
    <asset:link rel="shortcut icon"  sizes="57x57" href="eds/favicon.ico" type="image/x-icon"/>
    <g:layoutHead/>

</head>
<body>



<div id="splash"></div>
<div id="spinner" class="spinner spinner-img" style="display:none;">
</div>

<g:analytics/>
<div id="dialogAppDiv"></div>
<g:if test="${grails.util.Holders.config.locale_userPreferenceEnable}">
    <g:render template="/layouts/userPreference"/>
</g:if>
%{--<g:render template="layouts/bannershortcuts" plugin="bannerUiSs"/>--}%
%{--<g:render template="layouts/bannershortcuts"/>--}%

%{--<r:require modules="bannerSelfServiceRTL"/>--}%
%{--<g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
    <asset:javascript src="modules/bannerSelfServiceRTL-mf.js"/>
</g:if>
<g:else>
    <asset:stylesheet href="modules/bannerSelfService-mf.js"/>
</g:else>--}%
<g:layoutBody/>
</body>
</html>
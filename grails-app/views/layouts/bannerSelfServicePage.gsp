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
    <%
        def infoService = grailsApplication.classLoader.loadClass('net.hedtech.extensibility.InfoService').newInstance()
        def extensibilityInfo = (infoService.getJSON(controllerName, resource(plugin:'web-app-extensibility', dir:'html')))
    %>
    <g:set var="mep" value="${org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()?.request?.session?.getAttribute('ssbMepDesc')}"/>

    <g:set var="hideSSBHeaderComps" value="${session.hideSSBHeaderComps?session.hideSSBHeaderComps: params?.hideSSBHeaderComps? params.hideSSBHeaderComps:false} " scope="session" />
    <g:set var="aboutServiceUrl" value="${net.hedtech.banner.controllers.ControllerUtils.aboutServiceUrl()}" />

    <meta charset="${message(code: 'default.character.encoding')}"/>
    <meta name="dir" content="${message(code:'default.language.direction')}"/>
    <meta name="synchronizerToken" content="${org.grails.web.servlet.mvc.SynchronizerTokensHolder.store( session ).generateToken(request.forwardURI)}"/>
    <meta name="logLevel" content="${g.logLevel()}"/>
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

    <meta name="userLocale" content="${LocaleContextHolder.getLocale()}"/>
    <meta name="footerFadeAwayTime" content="${grails.util.Holders.config.footerFadeAwayTime}"/>
    <meta name="hideSSBHeaderComps" content="${session?.hideSSBHeaderComps?.trim()}">
    <meta name="aboutUrl" content="${!aboutServiceUrl ? '' : aboutServiceUrl}"/>
    <meta name="aboutUrlContextPath" content="${request.contextPath}/ssb"/>

    <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
        <asset:stylesheet href="modules/bannerSelfServiceRTL-mf.css"/>
    </g:if>
    <g:else>
        <asset:stylesheet href="modules/bannerSelfService-mf.css"/>
    </g:else>
    <asset:javascript src="modules/jquery-mf.js"/>

    <asset:script>
        var extensibilityInfo = ${extensibilityInfo.encodeAsRaw()}
        window.mepCode='${session.mep}';
    </asset:script>


    <title><g:layoutTitle default="Banner"/></title>

   <asset:script type="text/javascript">
        var transactionTimeoutMeta    = $( "meta[name=transactionTimeout]" ),
            transactionTimeoutSeconds = ( transactionTimeoutMeta.length == 1 ? parseInt( transactionTimeoutMeta.attr( "content" ) ) : 30 ),
            transactionTimeoutPadding = 10 * 1000,
            transactionTimeoutMilli   = ( transactionTimeoutSeconds * 1000 ) + transactionTimeoutPadding;

        $.ajaxSetup( { timeout: transactionTimeoutMilli } );
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

    <asset:deferredScripts/>

    <g:layoutHead />

    <g:customStylesheetIncludes/>

    <g:theme />

</head>
<body>

%{--
// TODO :grails_332_change, needs to revisit --}%
<div id="splash"></div>
<div id="spinner" class="spinner spinner-img" style="display:none;">
</div>

<g:analytics/>
    <div id="dialogAppDiv"></div>
    <g:if test="${grails.util.Holders.config.locale_userPreferenceEnable}">
        <g:render template="/layouts/userPreference"/>
    </g:if>
    <g:render template="/layouts/bannershortcuts"/>
</body>

    <asset:javascript src="modules/bannerSelfService-mf.js"/>

    <asset:script>
        $(window).load(function() {
               $( "#splash" ).remove();
        });

         yepnope({
         test : window.JSON,
         nope : '${assetPath(src: 'json2.js')}'
          });

          $(window).load(function() {
              _.defer( function() {
                  $( "#splash" ).remove();
              });
          });


        <g:i18nJavaScript/>
    </asset:script>


<g:layoutBody/>
    <asset:deferredScripts/>

    <g:customJavaScriptIncludes/>


</html>
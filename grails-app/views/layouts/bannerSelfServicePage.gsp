<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="${message(code: 'default.language.direction')}">
    <head>
        <r:require module="bannerSelfService"/>

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

        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/yepnope.1.0.1-min.js')}" type="text/javascript"></script>
        <g:javascript>
        yepnope({
           test : window.JSON,
           nope : '${resource(plugin: 'banner-ui-ss', file: 'js/json2.js')}'
        });
        </g:javascript>

        <r:layoutResources/>
        <g:i18nJavaScript/>

        <!-- Aurora platform -->
        <script src="${resource(plugin: 'sghe-aurora', file: 'js/utils.js')}" type="text/javascript"></script>
		<script src="${resource(plugin: 'sghe-aurora', file: 'js/config.js')}" type="text/javascript"></script>
        <script src="${resource(plugin: 'sghe-aurora', file: 'js/common-controls.js')}" type="text/javascript"></script>
        <script src="${resource(plugin: 'sghe-aurora', file: 'js/common-integration.js')}" type="text/javascript"></script>
        <script src="${resource(plugin: 'sghe-aurora', file: 'js/common-navigation.js')}" type="text/javascript"></script>
        <script src="${resource(plugin: 'sghe-aurora', file: 'js/common-platform.js')}" type="text/javascript"></script>
        <script src="${resource(plugin: 'sghe-aurora', file: 'js/init.js')}" type="text/javascript"></script>

        %{--<g:viewResources/>--}%

        <g:layoutHead />

        <g:customResources/>

        %{-- This is where we doc the last set of event handlers on the document ready of the dom --}%
        <script src="${resource(plugin: 'banner-ui-ss', file: 'js/common/document-ready.js')}" type="text/javascript"></script>

    </head>
    <body>
        <div id="aurora-resource-bundle" data-source="${resource(plugin: 'sghe-aurora', file: 'js/')}"/>
    
        <div id="splash"></div>
        <div id="spinner" class="spinner" style="display:none;">
            <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
        </div>
        <div id="grailsLogo"><a href="http://grails.org"><img src="${resource(dir:'images',file:'grails_logo.png')}" alt="Grails" border="0" /></a></div>

        <div id="aurora-header"></div>

        <g:layoutBody />
        <r:layoutResources/>
    </body>
</html>


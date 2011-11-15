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
        <div id="spinner" class="spinner" style="display:none;">
            <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
        </div>
        <div id="grailsLogo"><a href="http://grails.org"><img src="${resource(dir:'images',file:'grails_logo.png')}" alt="Grails" border="0" /></a></div>

        <g:layoutBody />

        <r:layoutResources/>

        <g:customJavaScriptIncludes/>
    </body>
</html>


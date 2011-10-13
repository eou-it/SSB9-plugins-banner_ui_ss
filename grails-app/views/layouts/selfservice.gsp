<%@ page contentType="text/html;charset=UTF-8" %>
%{--<!DOCTYPE html>--}%
<html lang="${message(code: 'default.language.direction')}">
    <head>
        <meta charset="${message(code: 'default.character.encoding')}"/>
        <meta name="dir" content="${message(code:'default.language.direction')}"/>
        <meta name="i18nCacheKey" content="${g.i18nCacheKey(name:'messages')}"/>
        <meta name="synchronizerToken" content="${org.codehaus.groovy.grails.web.servlet.mvc.SynchronizerToken.store( session ).currentToken}"/>

        <title><g:layoutTitle default="Banner"/></title>

        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon"/>

        %{--<r:require modules="sghe-common, jquery-ui, jquery-ui-plugins, jquery-plugins, datatables, backbone, colorbox, file-upload"/>--}%

        %{--<r:layoutResources/>--}%

        <g:viewResources/>

        <g:layoutHead />
    </head>
    <body>
        <div id="spinner" class="spinner" style="display:none;">
            <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
        </div>
        <div id="grailsLogo"><a href="http://grails.org"><img src="${resource(dir:'images',file:'grails_logo.png')}" alt="Grails" border="0" /></a></div>

        <div class="dialog-confirm"><p></p></div>
        <div id="notification-center"></div>
        <g:layoutBody />
        %{--<r:layoutResources/>--}%
    </body>
</html>
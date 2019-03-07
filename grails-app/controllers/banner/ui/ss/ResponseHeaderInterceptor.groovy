/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package banner.ui.ss

import grails.util.Holders

class ResponseHeaderInterceptor {


    ResponseHeaderInterceptor(){
        match controller: '*', action: '*'
        match uri: '/**'
    }

    boolean before() {
        if (request.getHeader('X-Requested-With')?.equals('XMLHttpRequest')) {
            response.setHeader('Expires', '-1')
            response.setHeader('Cache-Control', 'no-cache')
            response.addHeader('Cache-Control', 'no-store')
            response.setHeader( 'X-UA-Compatible', 'IE=edge' )
        }
        Holders.config.securityHeader.XContentTypeOptions = Holders.config.securityHeader.XContentTypeOptions ? Holders.config.securityHeader.XContentTypeOptions : 'nosniff'
        Holders.config.securityHeader.XXSSProtection = Holders.config.securityHeader.XXSSProtection ? Holders.config.securityHeader.XXSSProtection : '1;mode=block'
        Holders.config.securityHeader.ContentSecurityPolicy = Holders.config.securityHeader.ContentSecurityPolicy ? Holders.config.securityHeader.ContentSecurityPolicy : "default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;"
        response.setHeader('X-Content-Type-Options', Holders.config.securityHeader.XContentTypeOptions.toString())
        response.setHeader("X-XSS-Protection",  Holders.config.securityHeader.XXSSProtection.toString())
        response.setHeader("Content-Security-Policy", Holders.config.securityHeader.ContentSecurityPolicy.toString())

        true
    }

    boolean after() {
        response.setHeader('Expires', '-1')
        response.addHeader('Cache-Control', 'no-cache')
        response.addHeader('Cache-Control', 'no-store')
        response.setHeader( 'X-UA-Compatible', 'IE=edge' )
        true
    }

    void afterView() {
        // no-op
    }
}

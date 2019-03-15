/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package banner.ui.ss

import grails.util.Holders

class ResponseHeaderInterceptor {


    ResponseHeaderInterceptor() {
        match controller: '*', action: '*'
        match uri: '/**'
    }

    boolean before() {
        if (request.getHeader('X-Requested-With')?.equals('XMLHttpRequest')) {
            response.setHeader('Expires', '-1')
            response.setHeader('Cache-Control', 'no-cache')
            response.addHeader('Cache-Control', 'no-store')
        }
        response.setHeader('X-UA-Compatible', 'IE=edge')
        String contentTypeOptions = Holders.config.responseHeaders.x_content_type_options ?: 'nosniff'
        String xssProtection = Holders.config.responseHeaders.x_xss_protection ?: '1;mode=block'
        String contentSecurityPolicy = Holders.config.responseHeaders.content_security_policy ?: "default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;"
        response.setHeader('X-Content-Type-Options', contentTypeOptions)
        response.setHeader("X-XSS-Protection", xssProtection)
        response.setHeader("Content-Security-Policy", contentSecurityPolicy)

        true
    }

    void afterView() {
        // no-op
    }
}

package banner.ui.ss
/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
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
        response.setHeader('X-Content-Type-Options', 'nosniff')
        response.setHeader("X-XSS-Protection", "1; mode=block")
        response.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;")

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

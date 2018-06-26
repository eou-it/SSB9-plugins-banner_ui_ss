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

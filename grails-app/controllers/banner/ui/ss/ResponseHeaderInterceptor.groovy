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

        def responseHeadersMap = Holders.config.defaultResponseHeadersMap

        def configResponseHeadersMap = Holders.config.responseHeaders
        if (!configResponseHeadersMap.isEmpty()) {
            configResponseHeadersMap.each { configResponseHeader ->
                String configResponseHeaderKey = configResponseHeader.key
                String configResponseHeaderValue = configResponseHeader.value
                responseHeadersMap.put(configResponseHeaderKey, configResponseHeaderValue)
            }
        }
        responseHeadersMap.each { responseHeaderMap ->
            String responseHeaderKey = responseHeaderMap.key
            String responseHeaderValue = responseHeaderMap.value
            response.setHeader(responseHeaderKey, responseHeaderValue)
        }

        true
    }

    void afterView() {
        // no-op
    }

}

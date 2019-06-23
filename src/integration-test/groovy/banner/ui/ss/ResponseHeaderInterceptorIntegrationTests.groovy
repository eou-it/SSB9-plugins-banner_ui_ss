/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package banner.ui.ss

import banner.ui.ss.ResponseHeaderInterceptor
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import grails.util.Holders
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.web.context.request.RequestContextHolder

@Integration
@Rollback
class ResponseHeaderInterceptorIntegrationTests extends BaseIntegrationTestCase {

    def responseHeaderInterceptor

    static final CONTENT_SECURITY_POLICY = "default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;"
    static final X_XSS_PROTECTION = "1; mode=block"
    static final X_CONTENT_TYPE_OPTIONS = "nosniff"
    static final STRICT_TRANSPORT_SECURITY = "max-age=31536000;"

    @Before
    public void setUp() {
        responseHeaderInterceptor = new ResponseHeaderInterceptor()
        formContext = ['GUAGMNU']
        super.setUp()
    }

    @After
    public void tearDown() {
        super.tearDown()
    }

    @Test
    void testResponseInterceptorHeader() {
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        def headerList = RequestContextHolder.currentRequestAttributes().response
        assertEquals(X_CONTENT_TYPE_OPTIONS, headerList.getHeader("X-Content-Type-Options"))
        assertEquals(X_XSS_PROTECTION, headerList.getHeader("X-XSS-Protection"))
        assertEquals(CONTENT_SECURITY_POLICY, headerList.getHeader("Content-Security-Policy"))
    }


    @Test
    void testResponseInterceptorHeaderChanged() {
        Holders.config.responseHeaders = ["X-XSS-Protection": "1; report=<reporting-uri>"]
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        def headerList = RequestContextHolder.currentRequestAttributes().response
        assertEquals(X_CONTENT_TYPE_OPTIONS, headerList.getHeader("X-Content-Type-Options"))
        assertEquals("1; report=<reporting-uri>", headerList.getHeader("X-XSS-Protection"))
        assertEquals(CONTENT_SECURITY_POLICY, headerList.getHeader("Content-Security-Policy"))
        Holders.config.responseHeaders.remove("X-XSS-Protection")
    }

    @Test
    void testResponseInterceptorHeaderType() {
        Holders.config.responseHeaders = ["X-XSS-Protection": "1"]
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        def headerList = RequestContextHolder.currentRequestAttributes().response
        assertEquals(X_CONTENT_TYPE_OPTIONS, headerList.getHeader("X-Content-Type-Options"))
        assertEquals("1", headerList.getHeader("X-XSS-Protection"))
        assertEquals(CONTENT_SECURITY_POLICY, headerList.getHeader("Content-Security-Policy"))
        Holders.config.responseHeaders.remove("X-XSS-Protection")
    }

    @Test
    void testAdditionalPropertyAddedInHeader() {
        Holders.config.responseHeaders = ["Strict-Transport-Security": "max-age=31536000;"]
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        def headerList = RequestContextHolder.currentRequestAttributes().response
        assertEquals(X_CONTENT_TYPE_OPTIONS, headerList.getHeader('X-Content-Type-Options'))
        assertEquals(X_XSS_PROTECTION, headerList.getHeader("X-XSS-Protection"))
        assertEquals(CONTENT_SECURITY_POLICY, headerList.getHeader("Content-Security-Policy"))
        assertEquals(STRICT_TRANSPORT_SECURITY, headerList.getHeader("Strict-Transport-Security"))
        Holders.config.responseHeaders.remove("X-XSS-Protection")
        Holders.config.responseHeaders.remove("Strict-Transport-Security")
    }

}

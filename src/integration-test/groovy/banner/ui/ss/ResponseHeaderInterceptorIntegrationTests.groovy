/*******************************************************************************
Copyright 2018 Ellucian Company L.P. and its affiliates.
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
        def headerList = RequestContextHolder.currentRequestAttributes().response.headers
        assertEquals("nosniff", headerList.get("X-Content-Type-Options").getValue())
        assertEquals("1;mode=block", headerList.get("X-XSS-Protection").getValue())
        assertEquals("default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;", headerList.get("Content-Security-Policy").getValue())
    }


    @Test
    void testResponseInterceptorHeaderChanged() {
        Holders.config.responseHeaders.x_xss_protection = "1; report=<reporting-uri>"
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        def headerList = RequestContextHolder.currentRequestAttributes().response.headers
        assertEquals("nosniff", headerList.get("X-Content-Type-Options").getValue())
        assertEquals("1; report=<reporting-uri>", headerList.get("X-XSS-Protection").getValue())
        assertEquals("default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;", headerList.get("Content-Security-Policy").getValue())
        Holders.config.responseHeaders.remove("x_xss_protection")
    }

    @Test
    void testResponseInterceptorHeaderType() {
        Holders.config.responseHeaders.x_xss_protection = 1
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        def headerList = RequestContextHolder.currentRequestAttributes().response.headers
        assertEquals("nosniff", headerList.get("X-Content-Type-Options").getValue())
        assertEquals("1", headerList.get("X-XSS-Protection").getValue())
        assertEquals("default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;", headerList.get("Content-Security-Policy").getValue())
        Holders.config.responseHeaders.remove("x_xss_protection")
    }

}

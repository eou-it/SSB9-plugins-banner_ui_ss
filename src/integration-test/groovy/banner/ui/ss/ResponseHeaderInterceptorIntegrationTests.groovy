/*******************************************************************************
Copyright 2018 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
package banner.ui.ss

import banner.ui.ss.ResponseHeaderInterceptor
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import grails.util.Holders
import net.hedtech.banner.controllers.BaseRestfulControllerMixin
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.exceptions.BusinessLogicValidationException
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.dao.DataIntegrityViolationException

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
        Holders.config.securityHeader.remove("XContentTypeOptions")
        Holders.config.securityHeader.remove("XXSSProtection")
        Holders.config.securityHeader.remove("ContentSecurityPolicy")
    }

    @Test
    void testResponseInterceptorHeader(){
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        assertEquals('nosniff',Holders.config.securityHeader.XContentTypeOptions)
        assertEquals('1;mode=block',Holders.config.securityHeader.XXSSProtection)
        assertEquals("default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;",Holders.config.securityHeader.ContentSecurityPolicy)
    }


    @Test
    void testResponseInterceptorHeaderChanged(){
        Holders.config.securityHeader.XXSSProtection = "1; report=<reporting-uri>"
        ResponseHeaderInterceptor responseHeaderInterceptor = new ResponseHeaderInterceptor()
        responseHeaderInterceptor.before()
        assertEquals("nosniff",Holders.config.securityHeader.XContentTypeOptions)
        assertEquals("1; report=<reporting-uri>",Holders.config.securityHeader.XXSSProtection)
        assertEquals("default-src 'self'; img-src 'self' www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;",Holders.config.securityHeader.ContentSecurityPolicy)
    }

}

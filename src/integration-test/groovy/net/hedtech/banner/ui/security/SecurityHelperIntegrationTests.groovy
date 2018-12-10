/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui.security

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.web.context.request.RequestContextHolder

@Integration
@Rollback
class SecurityHelperIntegrationTests extends BaseIntegrationTestCase {

    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
    }


    @Test
    public void testValidateAccessWithFalse() {
        def dummyResponse = RequestContextHolder.currentRequestAttributes().response
        boolean check = false
        String str = "initial string"
        SecurityHelper.validateAccess(dummyResponse, check) {
            str = "updated string"
        }
        assertEquals 403, dummyResponse.status
        assertNotEquals "updated string", str
    }


    @Test
    public void testValidateAccessWithTrue() {
        def dummyResponse = RequestContextHolder.currentRequestAttributes().response
        boolean check = true
        String str = "initial string"
        SecurityHelper.validateAccess(dummyResponse, check) {
            str = "updated string"
        }
        assertEquals 200, dummyResponse.status
        assertEquals "updated string", str
    }
}

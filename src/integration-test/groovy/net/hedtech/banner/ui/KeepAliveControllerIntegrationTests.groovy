/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test

@Integration
@Rollback
class KeepAliveControllerIntegrationTests extends BaseIntegrationTestCase {

    def controller

    @Before
    public void setUp() {
       formContext = ['GUAGMNU']
       controller = new KeepAliveController()
       super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
    }


    @Test
    void testData() {
       controller.index()
       assertEquals controller.response.status, 200
    }
}

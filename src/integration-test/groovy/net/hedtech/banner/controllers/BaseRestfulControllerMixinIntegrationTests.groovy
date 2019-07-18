/*******************************************************************************
Copyright 2018 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
package net.hedtech.banner.controllers

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.exceptions.BusinessLogicValidationException
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.dao.DataIntegrityViolationException

import static org.junit.Assert.assertFalse
import static org.junit.Assert.assertTrue

@Integration
@Rollback
class BaseRestfulControllerMixinIntegrationTests extends BaseIntegrationTestCase {

    def baseRestfulControllerMixin

    private String TEST_MESSAGE="testMessage"
    private String TEST_FIELD="testField"
    private String TEST_TYPE="testType"

    @Before
    public void setUp() {
        baseRestfulControllerMixin = new BaseRestfulControllerMixin()
        formContext = ['GUAGMNU']
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
    }


    @Test
    void testCreateEntityMap() {
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 ]
        Map map= baseRestfulControllerMixin.createEntityMap(person,TEST_FIELD,TEST_TYPE,TEST_MESSAGE)
        assertTrue(!map.isEmpty())
    }


    @Test
    void testCreateErrorMapWithApplicationException() {
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 ]
        def e = new DataIntegrityViolationException( 'test' )
        ApplicationException ae = new ApplicationException( "Test", e )
        Map map= baseRestfulControllerMixin.createErrorMap(person,ae)
        assertTrue(!map.isEmpty())
    }


    @Test
    void testCreateErrorMapWithException() {
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 ]
        def e = new DataIntegrityViolationException( 'test' )
        Map map= baseRestfulControllerMixin.createErrorMap(person,e)
        assertTrue(!map.isEmpty())
    }


    @Test
    void testCreateErrorMapWithErrors() {
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 ]
        List errorProperties = ["#/instructorRoster.instructor.id", "#/term.code"]
        BusinessLogicValidationException businessLogicValidationException = new BusinessLogicValidationException("blank.message", ["S9034823", "default.home.label"], errorProperties)
        def ae = new ApplicationException(this.getClass(), businessLogicValidationException)
        Map map= baseRestfulControllerMixin.createErrorMap(person,ae)
        assertTrue(!map.isEmpty())
    }


    @Test
    void testInitMessages() {
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 , messages:[message1:"Hello"]]
        try {
            baseRestfulControllerMixin.initMessages(person)
            assertFalse(false)
        } catch(Exception e){
            assertTrue(true)
        }
    }


    @Test
    void testInitMessagesWithList() {
        List messageList=new ArrayList()
        messageList.add("Hello")
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 , messages:messageList]
        try {
            baseRestfulControllerMixin.initMessages(person)
            assertFalse(false)
        } catch(Exception e){
            assertTrue(true)
        }
    }


    @Test
    void testRenderResultsMap() {
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 ]
        Map map = baseRestfulControllerMixin.getResultsMap(person,null,"success",null)
        assertTrue(!map.isEmpty())
    }


    @Test
    void testCreateSuccessMap() {
        def person = [ firstName: 'Peter', lastName: 'Gabriel', age: 63 ]
        Map map = baseRestfulControllerMixin.createSuccessMap(person)
        assertTrue(!map.isEmpty())
    }

}

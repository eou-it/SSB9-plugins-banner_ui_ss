/*******************************************************************************
Copyright 2018 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
package net.hedtech.banner.coverters.json

import grails.converters.JSON
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.converters.json.JSONBeanMarshaller
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.grails.web.converters.exceptions.ConverterException
import org.junit.After
import org.junit.Before
import org.junit.Test

@Integration
@Rollback
class JSONBeanMarshallerIntegrationTests extends BaseIntegrationTestCase {

    def jsonBeanMarshaller

    @Before
    void setUp() {
        formContext = ['GUAGMNU']
        super.setUp()
    }


    @After
    void tearDown() {
        super.tearDown()

    }


    @Test
    void testMarshallObject() {
        Object o
        jsonBeanMarshaller = new JSONBeanMarshaller()
        jsonBeanMarshaller.supports(o)

    }


    @Test
    void testValueObject() {
        def jsonBeanMarshaller1 =new JSONBeanMarshaller([:]);
        jsonBeanMarshaller1.valuePreprocessor("TestName","TestValue")
    }


    @Test
    void testValueObjectNull() {
        def jsonBeanMarshaller1 =new JSONBeanMarshaller([:]);
        jsonBeanMarshaller1.valuePreprocessor("TestName",null)
    }


    @Test
    void testValueObjectValueInteger() {
        def jsonBeanMarshaller1 =new JSONBeanMarshaller([:]);
        jsonBeanMarshaller1.valuePreprocessor("TestName",5)
    }

    @Test
    void testMarshallObject1() {
        def jsonBeanMarshaller1 =new JSONBeanMarshaller([:])
        JSON json=new JSON()
        try {
            jsonBeanMarshaller1.marshalObject("dd",json)
        }catch (ConverterException ce) {
            assertTrue true
        }
    }
}

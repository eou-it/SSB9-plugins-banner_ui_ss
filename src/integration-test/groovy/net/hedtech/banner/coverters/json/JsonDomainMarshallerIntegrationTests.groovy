/*******************************************************************************
Copyright 2018 Ellucian Company L.P. and its affiliates.
*******************************************************************************/
package net.hedtech.banner.coverters.json

import grails.converters.JSON
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.converters.json.JSONBeanMarshaller
import net.hedtech.banner.converters.json.JSONDomainMarshaller
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.grails.core.DefaultGrailsDomainClass
import grails.core.GrailsDomainClassProperty
import grails.core.support.proxy.ProxyHandler
import org.grails.web.converters.exceptions.ConverterException
import org.junit.After
import org.junit.Before
import org.junit.Test

@Integration
@Rollback
class JsonDomainMarshallerIntegrationTests extends BaseIntegrationTestCase {
    def jsonDomainMarshaller

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
    void testDomainMarshallObject() {
        Object o
        jsonDomainMarshaller = new JSONDomainMarshaller([:], true)
        jsonDomainMarshaller.supports(o)
    }

    @Test
    void testIsIncludeVersion() {
        jsonDomainMarshaller = new JSONDomainMarshaller([:], true)
        jsonDomainMarshaller.isIncludeVersion()
    }

    @Test
    void testTwoArgConstructor() {
        jsonDomainMarshaller = new JSONDomainMarshaller([:], true)
        jsonDomainMarshaller.isIncludeVersion()
    }

    @Test
    void testThreeArgConstructor() {
        ProxyHandler proxyHandler
        jsonDomainMarshaller = new JSONDomainMarshaller([:], true, proxyHandler)
    }

    @Test
    void testSetIncludeVersion() {
        jsonDomainMarshaller = new JSONDomainMarshaller([:], true)
        jsonDomainMarshaller.setIncludeVersion(true)
    }

    @Test
    void testIsRenderDomainClassRelations() {
        jsonDomainMarshaller = new JSONDomainMarshaller([:], true)
        assertFalse jsonDomainMarshaller.isRenderDomainClassRelations()
    }

    @Test
    void testValueObject() {
        def jsonDomainMarshaller = new JSONDomainMarshaller([:], true);
        jsonDomainMarshaller.valuePreprocessor("TestName", "TestValue")
    }


    @Test
    void testValueObjectNull() {
        def jsonDomainMarshaller = new JSONDomainMarshaller([:], true)
        jsonDomainMarshaller.valuePreprocessor("TestName", null)
    }


    @Test
    void testValueObjectValueInteger() {
        def jsonDomainMarshaller = new JSONDomainMarshaller([:], true);
        jsonDomainMarshaller.valuePreprocessor("TestName", 5)
    }
}

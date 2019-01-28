/*******************************************************************************
 Copyright 2016-2019 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
/* global notifications */
package net.hedtech.banner.uploadproperties

//import grails.test.spock.IntegrationSpec
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Specification

import grails.util.GrailsWebMockUtil
import org.grails.plugins.testing.GrailsMockHttpServletRequest
import org.grails.plugins.testing.GrailsMockHttpServletResponse
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.web.context.WebApplicationContext

//class UploadPropertiesControllerIntegrationTest extends IntegrationSpec {

import grails.testing.mixin.integration.Integration

@Integration
class UploadPropertiesControllerIntegrationTest extends Specification {

    @Autowired
    WebApplicationContext webAppCtx

    //def uploadProperties

    @Autowired
    UploadPropertiesController uploadProperties

    public void setup() {
        //uploadProperties = new UploadPropertiesController()
        //Grails-3 modification for controllers
        MockHttpServletRequest request = new GrailsMockHttpServletRequest(webAppCtx.servletContext)
        MockHttpServletResponse response = new GrailsMockHttpServletResponse()
        GrailsWebMockUtil.bindMockWebRequest(webAppCtx, request, response)

        //uploadProperties = new UploadPropertiesController()
    }


    void cleanup() {
    }

    void "Test for fetching Upload page"(){

        when:"init upload page"
        uploadProperties.index()
        then: "status code with 0 should be returned"
        uploadProperties.response.status == 200
    }

    void "Test for fetching list of values"(){
        when:
        uploadProperties.list();
        then:
        uploadProperties.response.text !=null
    }

    void "Test for fetching values based on id and type"(){
        given:
        uploadProperties.params.id =40
        uploadProperties.params.name="PLUGINS/CSV/MESSAGES"
        uploadProperties.params.locale= "en_US"
        when:
        uploadProperties.show();
        then:
        uploadProperties.response.text !=null
    }

    void "Test for saving values"(){
        given:
        def data = ['id':'40', 'name':'PLUGINS/CSV/MESSAGES', 'locale':'en_US']
        uploadProperties.request.JSON = data
        when:
        uploadProperties.save();
        then:
        uploadProperties.response.text !=null
    }


}

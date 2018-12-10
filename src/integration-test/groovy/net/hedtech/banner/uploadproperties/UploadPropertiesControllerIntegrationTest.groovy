package net.hedtech.banner.uploadproperties

import grails.gorm.transactions.Rollback
//import grails.test.spock.IntegrationSpec
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test

@Integration
@Rollback
//class UploadPropertiesControllerIntegrationTest extends IntegrationSpec {
class UploadPropertiesControllerIntegrationTest {

    def uploadProperties
    public void setup() {
        uploadProperties = new UploadPropertiesController()
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

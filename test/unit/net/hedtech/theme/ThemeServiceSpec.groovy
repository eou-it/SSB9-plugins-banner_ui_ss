/*******************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.theme

import grails.test.mixin.TestFor
import net.hedtech.banner.general.ConfigurationData
import net.hedtech.banner.general.ConfigurationDataService
import net.sf.json.JSONObject
import spock.lang.Specification

@TestFor(ThemeService)
class ThemeServiceSpec extends Specification {
    static loadExternalBeans = true
    ConfigurationData conf
    ConfigurationDataService config
    ThemeService themeService
    ConfigurationData data
    def setup(){

        GroovyMock(ConfigurationData, global: true)
        conf = Mock()
        GroovyMock(ConfigurationDataService, global: true)
        config = Mock()
        themeService =new ThemeService(configurationDataService: config)
        data = new ConfigurationData([name: "JSONFILE"])
    }

    def "Should save and update the data"() {
        given:

        conf.findByNameAndType("TestJson","")>> null
        conf.findByNameAndType("ActualData","")>>[conf]


        config.create([name: "TestJson", type: "", value: ""])>> conf
        config.create([name: "ActualData", type: "", value: ""])>> conf
        when:
        def val1 = themeService.saveTheme("TestJson","","")
        then:
        val1 instanceof ConfigurationData

        when:
        def val2 = themeService.saveTheme("ActualData","","")
        then:
        val2 instanceof ConfigurationData
    }

    def "Should Delete the value from DB"(){

        given:
        conf.findByName("jsonFile")>>[new ConfigurationData()]

        when:
        def res = themeService.deleteTheme("jsonFile")
        then:
        0*config.delete(_)
    }

    def "List out the contents from DB"(){
        given:

        config.list([sort: "name", order: "asc"])>>conf
        when:
        def res = themeService.listThemes([sort: "name", order: "asc"])
        then:
        res instanceof ConfigurationData
    }

    def "get JSON Data"(){
        given:
        GroovyMock(ConfigurationData, global: true)
        //String text = '{"name":"JSONDATA","value":"Test Da","type":"JSON"}';
        JSONObject obj = new JSONObject();

        obj.put("name", "JSONDATA");
        obj.put("value", "Test Data");
        ConfigurationData.findByNameAndType('JSONDATA', 'json')>> obj
        when:
        def res = themeService.getThemeJSON("JSONDATA")
        then:
        res instanceof Map
    }
}

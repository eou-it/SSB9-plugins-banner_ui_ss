/** *****************************************************************************
 Copyright 2009-2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.theme

import grails.converters.JSON
import net.hedtech.banner.security.FormContext

import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import org.junit.After
import org.junit.AfterClass
import org.junit.Before
import org.junit.Test
import net.hedtech.banner.general.ConfigurationData
import net.hedtech.theme.ThemeService
import static org.junit.Assert.assertEquals
import static org.junit.Assert.assertNotNull
import static org.junit.Assert.assertNull
import static org.junit.Assert.assertTrue

/**
 * This is a helper class that is used to access Web Tailor
 *
 */

class ThemeServiceIntegrationTests extends BaseIntegrationTestCase {

    def grailsApplication
    def themeService

    def themeJSON    = '{"color1":"#ffffff", "color2":"#666666"}'
    def templateSCSS =  '''.#header-main-section { background-color: $themecolor1; }'''
    def desiredCSS   =   '.#header-main-section { background-color: #ffffff; }'
    def static final types = [theme:'json', template:'scss']
    def templateName = 'all'

    @Before
    void setUp() {
        formContext = ['GUAGMNU']
        super.setUp()
    }

    @After
    public void tearDown() {
        super.tearDown();
    }

    @AfterClass
    public static void cleanUp() {
        new File(System.properties['base.dir'] + '/web-app/css/theme/banner-ui-ss.scss').delete()
        new File('target/css').delete()
    }

    @Test
    void testSaveTheme() {
        themeService.saveTheme("TestTheme", types.theme, themeJSON)
        def themeInstance = ConfigurationData.findByNameAndType("TestTheme", types.theme)
        assertNotNull themeInstance.id
        assertEquals themeInstance.name, "TestTheme"
        assertEquals themeInstance.type,  types.theme
        assertEquals themeInstance.value, themeJSON
    }

    @Test
    void testListThemes() {
        def list = themeService.listThemes([sort: "name", order: "asc"])
        assertTrue list.size() > 1
    }

    @Test
    void  testGetThemeJSON() {
        themeService.saveTheme("TestTheme", types.theme, themeJSON)
        def json = themeService.getThemeJSON("TestTheme")
        assertEquals JSON.parse(themeJSON), json
    }

    @Test
    void testDeleteTheme(){
        themeService.saveTheme("TestTheme", types.theme, themeJSON)
        def themeInstance = ConfigurationData.findByNameAndType("TestTheme", 'json')
        themeService.deleteTheme("TestTheme")
        assertNull ConfigurationData.findById(themeInstance.id)
    }

    @Test
    void testSaveTemplate() {
        themeService.saveTheme("TestTemplate", types.template, templateSCSS)
        def templateInstance = ConfigurationData.findByNameAndType("TestTemplate", types.template)
        assertNotNull templateInstance.id
        assertEquals templateInstance.name, "TestTemplate"
        assertEquals templateInstance.type, types.template
        assertEquals templateInstance.value, templateSCSS
    }

    @Test
    void testListTemplates(){
        themeService.saveTheme("TestTemplate", types.template, templateSCSS)
        def list = themeService.listTemplates([sort: "name", order: "asc"])
        assertTrue list.size() > 1
    }

    @Test
    void testDeleteTemplate(){
        def templateInstance = themeService.saveTheme("TestTemplate", types.template, templateSCSS)
        themeService.deleteTemplate("TestTemplate")
        assertNull ConfigurationData.findById(templateInstance.id)
    }

    @Test
    void "test importTemplates"(){
        themeService.importTemplates(true)
        def templateInstance  = ConfigurationData.findByNameAndType(templateName, types.template)
        assertNotNull templateInstance.id
    }

    @Test
    void testGetCSS() {
        themeService.saveTheme("TestTheme", types.theme, themeJSON)
        themeService.saveTheme("TestTemplate", types.template, templateSCSS)
        grailsApplication.config.banner.theme.path = "target/css"
        grailsApplication.config.banner.theme.name = "TestTheme"
        grailsApplication.config.banner.theme.template = "TestTemplate"
        def content = themeService.getCSS("TestTemplate", "TestTheme", null)
        assertEquals content, desiredCSS
    }

}

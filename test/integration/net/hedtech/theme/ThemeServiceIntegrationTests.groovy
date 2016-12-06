/*******************************************************************************
 Copyright 2009-2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.theme

import grails.converters.JSON
import net.hedtech.banner.security.FormContext

import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import org.junit.After
import org.junit.AfterClass
import org.junit.Before
import org.junit.BeforeClass
import org.junit.Test
import net.hedtech.banner.general.ConfigurationData
import net.hedtech.theme.ThemeService
import static org.junit.Assert.assertEquals
import static org.junit.Assert.assertNotNull
import static org.junit.Assert.assertNull
import static org.junit.Assert.assertTrue


class ThemeServiceIntegrationTests extends BaseIntegrationTestCase {

    def grailsApplication
    def themeService

    def themeJSON    = '{"name":"testtheme","color1":"#ffffff", "color2":"#666666"}'
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
        new File("${ServletContextHolder.servletContext.getRealPath('/css/theme')}/banner-ui-ss.scss").delete()
        new File('target/css').delete()
    }

    @Test
    void testSaveTheme() {
        themeService.saveTheme("testtheme", types.theme, themeJSON)
        def themeInstance = ConfigurationData.findByNameAndType("testtheme", types.theme)
        assertNotNull themeInstance.id
        assertEquals themeInstance.name, "testtheme"
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
        themeService.saveTheme("testtheme", types.theme, themeJSON)
        def json = themeService.getThemeJSON("testtheme")
        assertEquals JSON.parse(themeJSON), json
    }

    @Test
    void testDeleteTheme(){
        themeService.saveTheme("TestTheme", types.theme, themeJSON)
        def themeInstance = ConfigurationData.findByNameAndType("testtheme", 'json')
        themeService.deleteTheme("testtheme")
        assertNull ConfigurationData.findById(themeInstance.id)
    }

    @Test
    void testSaveTemplate() {
        themeService.saveTheme("testtemplate", types.template, templateSCSS)
        def templateInstance = ConfigurationData.findByNameAndType("testtemplate", types.template)
        assertNotNull templateInstance.id
        assertEquals templateInstance.name, "testtemplate"
        assertEquals templateInstance.type, types.template
        assertEquals templateInstance.value, templateSCSS
    }

    @Test
    void testListTemplates(){
        themeService.saveTheme("testtemplate", types.template, templateSCSS)
        def list = themeService.listTemplates([sort: "name", order: "asc"])
        assertTrue list.size() > 1
    }

    @Test
    void testDeleteTemplate(){
        def templateInstance = themeService.saveTheme("testtemplate", types.template, templateSCSS)
        themeService.deleteTemplate("testtemplate")
        assertNull ConfigurationData.findById(templateInstance.id)
    }

    @Test
    void "test importTemplates"(){
        themeService.importTemplates(true)
        themeService.saveTheme("testtemplate", types.template, templateSCSS)
        def templateInstance  = ConfigurationData.findByNameAndType("testtemplate", types.template)
        assertNotNull templateInstance.id
    }

    @Test
    void testGetCSS() {
        themeService.saveTheme("testtheme", types.theme, themeJSON)
        themeService.saveTheme("testtemplate", types.template, templateSCSS)
        def templateInstance = ConfigurationData.findByNameAndType("testtemplate", types.template)
        assertNotNull templateInstance.id
        def themeInstance = ConfigurationData.findByNameAndType("testtheme", types.theme)
        assertNotNull themeInstance.id
        grailsApplication.config.banner.theme.path = "target/css"
        grailsApplication.config.banner.theme.name = "testtheme"
        grailsApplication.config.banner.theme.template = "testtemplate"
        def content = themeService.getCSS("testtheme", "testtemplate")
        assertEquals content, desiredCSS
    }

}

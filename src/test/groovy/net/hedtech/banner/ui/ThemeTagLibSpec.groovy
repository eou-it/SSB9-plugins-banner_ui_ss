/*******************************************************************************
 Copyright 2009-2019 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui

import grails.testing.web.taglib.TagLibUnitTest
import grails.util.GrailsWebMockUtil

//import grails.test.mixin.TestFor
import grails.util.GrailsWebUtil
import spock.lang.Specification

//@TestFor(ThemeTagLib)

class ThemeTagLibSpec extends Specification implements TagLibUnitTest<ThemeTagLib>{

    def setup() {
    }

    def cleanup() {
        config.banner.theme = [:]
    }

    void "test ThemeTagLib with theme, template name configured and not theme URL"() {
        given:
        config.banner.theme.name = "TestTheme"
        config.banner.theme.template = "TestTemplate"
        expect:
        applyTemplate('<g:theme />') == "<link rel='stylesheet' type='text/css' href='/theme/getTheme?name=TestTheme&template=TestTemplate'>"
    }

    void "test ThemeTagLib with theme, template name and theme URL"() {
        given:
        config.banner.theme.name = "TestTheme"
        config.banner.theme.url = "http://<HOST>:<PORT>/<APP_NAME>/ssb/theme"
        config.banner.theme.template = "TestTemplate"
        expect:
        applyTemplate('<g:theme />') == "<link rel='stylesheet' type='text/css' href='http://<HOST>:<PORT>/<APP_NAME>/ssb/theme/getTheme?name=TestTheme&template=TestTemplate'>"
    }

    void "test ThemeTagLib with theme name, URL and without template name configured"() {
        given:
        config.banner.theme.name = "TestTheme"
        config.banner.theme.url = "http://<HOST>:<PORT>/<APP_NAME>/ssb/theme"
        config.banner.theme.template = ""
        expect:
        applyTemplate('<g:theme />') == ""
    }

    void "test ThemeTagLib without Template Configured"() {
        given:
        config.banner.theme.name = ""
        config.banner.theme.url = ""
        config.banner.theme.template = ""
        expect:
        applyTemplate('<g:theme />') == ""
    }

    void "test ThemeTagLib with MEP code and without theme URL, template name configured"() {
        given:
        config.banner.theme.name = ""
        config.banner.theme.url = ""
        config.banner.theme.template = ""
        def request = GrailsWebMockUtil.bindMockWebRequest()
        request.session['mep'] = 'BANNER'
        expect:
        applyTemplate('<g:theme />') == ""
    }

    void "test ThemeTagLib with MEP code, theme URL, template name configured"() {
        given:
        def request = GrailsWebMockUtil.bindMockWebRequest()
        config.banner.theme.template = "TestTemplate"
        request.session['mep'] = 'BANNER'
        expect:
        applyTemplate('<g:theme />') == "<link rel='stylesheet' type='text/css' href='/theme/getTheme?name=&template=TestTemplate&mepCode=BANNER'>"
    }

    void "test ThemeTagLib with MEP code, theme URL, theme name and without template name configured"() {
        given:
        config.banner.theme.template = ""
        def request = GrailsWebMockUtil.bindMockWebRequest()
        request.session['mep'] = 'BANNER'
        expect:
        applyTemplate('<g:theme />') == ""
    }
}

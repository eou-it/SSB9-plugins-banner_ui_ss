/*******************************************************************************
 Copyright 2009-2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.ui

//import grails.test.mixin.TestFor
import grails.util.GrailsWebUtil
import spock.lang.Specification

//@TestFor(ThemeTagLib)
class ThemeTagLibSpec extends Specification {

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
        expect:
        applyTemplate('<g:theme />') == ""
    }

    void "test ThemeTagLib without Template Configured"() {
        expect:
        applyTemplate('<g:theme />') == ""
    }

    void "test ThemeTagLib with MEP code and without theme URL, template name configured"() {
        given:
        def request = GrailsWebUtil.bindMockWebRequest()
        request.session['mep'] = 'BANNER'
        expect:
        applyTemplate('<g:theme />') == ""
    }

    void "test ThemeTagLib with MEP code, theme URL, template name configured"() {
        given:
        def request = GrailsWebUtil.bindMockWebRequest()
        config.banner.theme.template = "TestTemplate"
        request.session['mep'] = 'BANNER'
        expect:
        applyTemplate('<g:theme />') == "<link rel='stylesheet' type='text/css' href='/theme/getTheme?name=&template=TestTemplate&mepCode=BANNER'>"
    }

    void "test ThemeTagLib with MEP code, theme URL, theme name and without template name configured"() {
        given:
        def request = GrailsWebUtil.bindMockWebRequest()
        request.session['mep'] = 'BANNER'
        expect:
        applyTemplate('<g:theme />') == ""
    }
}

/** *****************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.common

import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test


class RtlCssGeneratorIntegrationTests extends BaseIntegrationTestCase {

    def rtlCssGenerator
    def cssFile = "${System.properties['base.dir']}/web-app/css/banner-ui-ss.css"
    def rtlcssFile = "${System.properties['base.dir']}/web-app/css/banner-ui-ss-rtl.css"
    def tempFile = "${System.properties['base.dir']}/web-app/css/banner-ui-ss-rtl-temp.css"

    def css = '.class { border-left:1px; }'
    def rtl = css.replaceAll( 'left', 'right' );

    @Before
    void setUp() {
        formContext = ['GUAGMNU']
        rtlCssGenerator = new RtlCssGenerator()
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        new File(tempFile).deleteOnExit()
    }


    def ws( text ) {
        return text.replaceAll( /\s+/, ' ' )
    }

    @Test
    public void testTransformCss() {
        def transformCss = ws( rtlCssGenerator.transformCss(css))
        assertEquals rtl, transformCss
    }


    @Test
    public void testCommentedStyle(){
        def commentsInProperties = '.class { color:blue;/*{identifier}*/ background:none;}'
        def desiredCss = '.class { color:blue; background:none;}'
        assertEquals desiredCss, rtlCssGenerator.removeCommentedStyles( commentsInProperties )
    }

    @Test
    public void testGenerateRTLCssWithPluginFalse(){
        new File(rtlcssFile).renameTo(tempFile)
        rtlCssGenerator.generateRTLCss(false)
        assertTrue new File(rtlcssFile).exists()
    }


    @Test
    public void testGenerateRTLCssWithPluginTrue(){
        new File(rtlcssFile).renameTo(tempFile)
        rtlCssGenerator.generateRTLCss(true)
        assertTrue new File(rtlcssFile).exists()
    }


    @Test
    public void testGetMediaQueries(){
       def ltrCssFile = "${System.properties['base.dir']}/web-app/css/notification-center.css"
       def rtlCssFile = "${System.properties['base.dir']}/web-app/css/notification-center-rtl.css"
       def ltrMediaQueryList = rtlCssGenerator.getMediaQueries(new File(ltrCssFile).text)
       def rtlMediaQueryList = rtlCssGenerator.getMediaQueries(new File(ltrCssFile).text)
        assertEquals ltrMediaQueryList, rtlMediaQueryList
    }


    @Test
    public void testGetRTLFileName(){
        def rtlFile = rtlCssGenerator.getRTLFileName(new File(cssFile))
        assertEquals new File(rtlFile).absolutePath, new File(rtlcssFile).absolutePath

    }
}

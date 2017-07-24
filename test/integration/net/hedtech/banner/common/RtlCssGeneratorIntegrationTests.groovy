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


    @Test
    public void testGenerateRTLCss(){
        new File(rtlcssFile).renameTo(tempFile)
        rtlCssGenerator.generateRTLCss(false)
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

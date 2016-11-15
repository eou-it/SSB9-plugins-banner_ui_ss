/*********************************************************************************
 Copyright 2009-2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/

eventCompileEnd = {
    Class RtlCssGenerator = classLoader.loadClass("net.hedtech.banner.common.RtlCssGenerator", true)
    def rtlCssGenerator = RtlCssGenerator.newInstance()
    rtlCssGenerator.generateRTLCss(true);

    Class ThemeScssGenerator = classLoader.loadClass("net.hedtech.banner.common.ThemeScssGenerator", true)
    def themeScssGenerator = ThemeScssGenerator.newInstance()
    def scssFilePath = "${basedir}/web-app/css/theme/"
    def scssFileName = grails.util.Metadata.current.'app.name'+".scss"
    def scssFile = scssFilePath+scssFileName
    try {
        themeScssGenerator.generateThemeSCSSFile(scssFile);
    } catch (FileNotFoundException e) {
        println "Unable to generate theme SCSS file - unexpected exception"
        e.printStackTrace()
    }
}

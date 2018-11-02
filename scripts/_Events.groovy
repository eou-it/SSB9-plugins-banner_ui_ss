
/*******************************************************************************
 Copyright 2009-2016 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

eventCompileEnd = {
    Class RtlCssGenerator = classLoader.loadClass("net.hedtech.banner.common.RtlCssGenerator", true)
    def rtlCssGenerator = RtlCssGenerator.newInstance()
    rtlCssGenerator.generateRTLCss(true);

    Class ThemeScssGenerator = classLoader.loadClass("net.hedtech.banner.common.ThemeScssGenerator", true)
    def themeScssGenerator = ThemeScssGenerator.newInstance()
    def scssFilePath = "${basedir}/web-app/css/theme/"
    def scssFileName = grails.util.Metadata.current.'app.name' + "-" + grails.util.Metadata.current.'app.version' + ".scss"
    def scssFile = scssFilePath+scssFileName
    try {
        themeScssGenerator.generateThemeSCSSFile(scssFile, grails.util.Metadata.current.'app.name', grails.util.Metadata.current.'app.version');
    } catch (FileNotFoundException e) {
        println "Unable to generate theme SCSS file - unexpected exception"
        e.printStackTrace()
    }
}

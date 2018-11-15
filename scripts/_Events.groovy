
/*******************************************************************************
 Copyright 2009-2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

eventCompileEnd = {
    Class RtlCssGenerator = classLoader.loadClass("net.hedtech.banner.common.RtlCssGenerator", true)
    def rtlCssGenerator = RtlCssGenerator.newInstance()
    rtlCssGenerator.generateRTLCss(true);

    Class ThemeScssGenerator = classLoader.loadClass("net.hedtech.banner.common.ThemeScssGenerator", true)
    def themeScssGenerator = ThemeScssGenerator.newInstance()
    def scssFilePath = "${basedir}/web-app/css/theme/"
    def appName = grails.util.Metadata.current.'app.name'
    def appVersion = grails.util.Metadata.current.'app.version'
    def versionText = appVersion ? ("-" + appVersion).replaceAll(/\./, '_') : ""
    def scssFileName = (appName + versionText) + ".scss"
    def scssFile = scssFilePath+scssFileName
    try {
        themeScssGenerator.generateThemeSCSSFile(scssFile, appName, appVersion);
    } catch (FileNotFoundException e) {
        println "Unable to generate theme SCSS file - unexpected exception"
        e.printStackTrace()
    }
}

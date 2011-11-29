includeTargets << grailsScript("Init")
includeTargets << grailsScript("_GrailsInit")

/** Execution: grails generate-rtl-css **/

target(generateRtlCss: "Transform all CSS files to RTL version") {
    Class RtlCssGenerator = classLoader.loadClass("com.sungardhe.banner.common.RtlCssGenerator", true)
    def rtlCssGenerator = RtlCssGenerator.newInstance()
    rtlCssGenerator.generateRTLCss();
}

setDefaultTarget(generateRtlCss)

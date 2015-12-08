import org.apache.commons.lang.SystemUtils

includeTargets << grailsScript("_GrailsInit")

target(setupDev: "The description of the script goes here!") {
    if(SystemUtils.IS_OS_MAC)
    {
        "${basedir}/plugins/banner_ui_ss.git/scripts/components-library-setup.sh".execute()
    }
    else {
        "${basedir}/plugins/banner_ui_ss.git/scripts/components-library-setup.bat".execute()
    }
}

setDefaultTarget(setupDev)

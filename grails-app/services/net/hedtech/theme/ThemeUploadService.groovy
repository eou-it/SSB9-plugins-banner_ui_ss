package net.hedtech.theme

import net.hedtech.banner.general.Configuration

//import org.grails.databinding.SimpleMapDataBindingSource

class ThemeUploadService
{
    def configurationService

    Configuration saveTheme (String fileName, def clobData, String type){
        def theme  = Configuration.findByConfigNameAndConfigType(fileName,type)
        if (theme) {
            //if (theme.file != clobData) {
                theme.value = clobData
            //}
            theme = configurationService.update(theme)
        } else {
            theme = configurationService.create([configName: fileName, configType: type, value: clobData])
        }
        println "Saved theme $theme"
        theme
    }

}

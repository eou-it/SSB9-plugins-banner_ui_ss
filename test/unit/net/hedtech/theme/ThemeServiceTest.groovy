package net.hedtech.theme

import grails.test.mixin.TestFor
import net.hedtech.banner.general.ConfigurationData
import net.hedtech.banner.general.ConfigurationDataService
import spock.lang.Specification

/**
 * Created by gurunathdk on 11/15/2016.
 */
@TestFor(ThemeService)
class ThemeServiceTest extends Specification {
    static loadExternalBeans = true
    def "Should save and update the data"() {
        given:
        ConfigurationData conf = Mock()
        GroovyMock(ConfigurationData, global: true)
        conf.findByNameAndType("TestJson","")>> null
        conf.findByNameAndType("ActualData","")>>conf

        GroovyMock(ConfigurationDataService, global: true)
        ConfigurationDataService config = Mock()
        config.create([name: "TestJson", type: "", value: ""])>> conf
        config.create([name: "ActualData", type: "", value: ""])>> conf
        when:
        ThemeService themeService =new ThemeService()
        themeService.configurationDataService = config
        def val1 = themeService.saveTheme("TestJson","","")
        then:
        val1 instanceof ConfigurationData

        when:
        def val2 = themeService.saveTheme("ActualData","","")
        then:
        val2 instanceof ConfigurationData
    }
}

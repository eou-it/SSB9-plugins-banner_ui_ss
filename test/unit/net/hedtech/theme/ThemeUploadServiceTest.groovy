package net.hedtech.theme

import grails.test.GrailsUnitTestCase
import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import net.hedtech.banner.general.Configuration
import net.hedtech.banner.general.ConfigurationService
import spock.lang.Specification
import net.hedtech.banner.service.ServiceBase

/**
 * Created by gurunathdk on 11/15/2016.
 */
@TestFor(ThemeUploadService)
class ThemeUploadServiceTest extends Specification {
    static loadExternalBeans = true
    def "Should save and update the data"() {
        given:
        Configuration conf = Mock()
        GroovyMock(Configuration, global: true)
        conf.findByNameAndType("TestJson","")>> null
        conf.findByNameAndType("ActualData","")>>conf

        GroovyMock(ConfigurationService, global: true)
        ConfigurationService config = Mock()
        config.create([name: "TestJson", type: "", value: ""])>> conf
        config.create([name: "ActualData", type: "", value: ""])>> conf
        when:
        ThemeUploadService themeService =new ThemeUploadService()
        themeService.configurationService = config
        def val1 = themeService.saveTheme("TestJson","","")
        then:
        val1 instanceof Configuration

        when:
        def val2 = themeService.saveTheme("ActualData","","")
        then:
        val2 instanceof Configuration
    }
}

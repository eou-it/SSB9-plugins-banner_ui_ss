package banner.ui.ss

class BootStrap {

    def themeService

    def init = {
        themeService.importTemplates(false)
    }

    def destroy = {
    }
}

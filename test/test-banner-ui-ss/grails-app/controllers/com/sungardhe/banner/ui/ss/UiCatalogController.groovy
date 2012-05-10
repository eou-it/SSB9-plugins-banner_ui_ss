package com.sungardhe.banner.ui.ss

import grails.converters.JSON

class UiCatalogController {

    def index = {
        [ widget: params.widget ?: params.w, quiet: params.zombie ?: params.z ?: params.quiet ?: params.q ?: false ]
    }

    def echo = {
        def out = [data: params.data]
        render out as JSON
    }
}

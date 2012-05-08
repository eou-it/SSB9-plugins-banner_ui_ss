package com.sungardhe.banner.ui.ss

import grails.converters.JSON

class UiCatalogController {

    def index = {
        [ widget: params.widget ?: params.w]
    }

    def echo = {
        def out = [data: params.data]
        render out as JSON
    }
}

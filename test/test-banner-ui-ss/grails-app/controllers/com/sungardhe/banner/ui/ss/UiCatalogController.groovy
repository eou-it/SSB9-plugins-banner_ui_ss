package com.sungardhe.banner.ui.ss

import grails.converters.JSON

class UiCatalogController {

    def index = { }

    def echo = {
        def out = [data: params.data]
        render out as JSON
    }
}

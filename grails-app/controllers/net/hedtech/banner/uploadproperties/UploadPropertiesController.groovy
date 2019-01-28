/*******************************************************************************
 Copyright 2017-2019 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package net.hedtech.banner.uploadproperties

import grails.converters.JSON

class UploadPropertiesController {

    def resourceBundleService
    private Object savePropLock= new Object()

    def index() {
        render(view: "uploadProperties")

    }

    def list() {
        def result
        if (params.name || params.id) {
            return show()
        } else {
            result = resourceBundleService.list()
        }
        render result as JSON
    }

    def show() {
        def result = resourceBundleService.get(params.id?:params.name, params.locale)
        render result as JSON
    }

    def save() {
        synchronized (savePropLock) {
            def data = request.JSON
            def result = resourceBundleService.save(data)
            render result as JSON
        }
    }
}

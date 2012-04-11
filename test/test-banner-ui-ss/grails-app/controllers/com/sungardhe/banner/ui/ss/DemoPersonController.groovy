package com.sungardhe.banner.ui.ss

import com.sungardhe.banner.controllers.BaseRestfulControllerMixin
import grails.converters.JSON

@Mixin([BaseRestfulControllerMixin])
class DemoPersonController {

    static defaultAction = "list"

    def demoPersonService

    def list = {
        def rows = demoPersonService.fetchPersons( params )

        def dataTablesFormat = [
            success:     true,
            totalCount:  demoPersonService.fetchPersonsCount(),
            data:        rows,
            pageOffset:  params.pageOffset  ? params?.pageOffset  : 0,
            pageMaxSize: params.pageMaxSize ? params?.pageMaxSize : rows.size()
        ]

        render dataTablesFormat as JSON
    }

    def processBatch = {
        def batch = [create: [], destroy: [], update: []]

        request.JSON.update.each {
//            def err = createErrorMap( it, new Exception( "Cannot update this record" ));

            def update = demoPersonService.update( it )

            batch.update << update
        }

        def returnMap = [
            success: true,
            data: batch,
            pageOffset: params.offset ? params?.offset : 0,
            pageMaxSize: params.max ? params?.max : 100,
            message: localizer(code: 'default.list.message', args: [localizer(code: "UiCatalogController.class.simpleName.label", default: "UiCatalogController.class.simpleName")])
        ]

        this.response.status = 200

        render prepareRespone(returnMap)
    }
}

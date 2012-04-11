package com.sungardhe.banner.ui.ss

import grails.converters.JSON

class UiCatalogController {

    def demoPersonService

    def index = { }
    
    def demoPersonTableData = {
        def rows = demoPersonService.fetchPersons( params )
        
//        rows << [id: 1, bannerId: "A00000685", firstName: "Johnny", lastName: "Appleseed", phone: "5551234567", email: "jappleseed@applez.com",      birthDate: new Date(1992, 9, 3)]
//        rows << [id: 2, bannerId: "A00000686", firstName: "Johnny", lastName: "Begood",    phone: "5552345678", email: "chuck.berry@ellucian.com", birthDate: new Date(1992, 9, 10)]
//        rows << [id: 3, bannerId: "A00000687", firstName: "Johnny", lastName: "Rotten",    phone: "5553456789", email: "rottenj@gmailz.com",         birthDate: new Date(1993, 9, 17)]

        def dataTablesFormat = [
            success:     true,
            totalCount:  demoPersonService.fetchPersonsCount(),
            data:        rows,
            pageOffset:  params.pageOffset ? params?.pageOffset : 0,
            pageMaxSize: params.pageMaxSize ? params?.pageMaxSize : rows.size()
        ]

        render dataTablesFormat as JSON
    }

    def echo = {
        def out = [data: params.data]
        render out as JSON
    }

}

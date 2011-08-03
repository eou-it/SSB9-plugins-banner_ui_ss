package com.sungardhe.banner.ui

import grails.converters.JSON
//import com.sungardhe.banner.student.Student

class UiCatalogController {
    static defaultAction = "uiCatalog"

    def uiCatalog = { }

    def demoPersonTableData = {
        def rows = []

        rows << [firstName: "Johnny", lastName: "Appleseed", phoneNum: "5551234567", streetAddress: "123 Any Drive", city: "Smalltown", state: "PA", zip: "12345"]
        rows << [firstName: "Johnny", lastName: "Begood", phoneNum: "5552345678", streetAddress: "321 A Avenue", city: "Westside", state: "AK", zip: "23456"]
        rows << [firstName: "Johnny", lastName: "Rotten", phoneNum: "5553456789", streetAddress: "101 Pikes Peak Drive", city: "East Village", state: "CT", zip: "34567"]


        def dataTablesFormat = [sEcho: 1, iTotalRecords: rows.size(), iTotalDisplayRecords: rows.size(), aaData: rows]

        render dataTablesFormat as JSON
    }

    def echo = {
        def out = [data: params.data]
        render out as JSON
    }
}

/*********************************************************************************
 Copyright 2009-2011 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/
package com.sungardhe.banner.ui.ss

import grails.converters.JSON

class UiCatalogController {
    static defaultAction = "uiCatalog"

    def uiCatalog = { }

    def demoPersonTableData = {
        def rows = []

        rows << [bannerId: "A00000685", firstName: "Johnny", lastName: "Appleseed", phone: "5551234567", email: "jappleseed@apple.com", birthDate: new Date(1992, 9, 3)]
        rows << [bannerId: "A00000686", firstName: "Johnny", lastName: "Begood", phone: "5552345678", email: "chuck.berry@sungardhe.com", birthDate: new Date(1992, 9, 10)]
        rows << [bannerId: "A00000687", firstName: "Johnny", lastName: "Rotten", phone: "5553456789", email: "rottenj@gmail.com", birthDate: new Date(1993, 9, 17)]


        def dataTablesFormat = [sEcho: 1, iTotalRecords: rows.size(), iTotalDisplayRecords: rows.size(), aaData: rows]

        render dataTablesFormat as JSON
    }

    def echo = {
        def out = [data: params.data]
        render out as JSON
    }
}

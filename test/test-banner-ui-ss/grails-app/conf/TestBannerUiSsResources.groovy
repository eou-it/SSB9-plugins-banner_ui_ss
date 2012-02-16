/*********************************************************************************
 Copyright 2009-2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is limited
 solely to SunGard Higher Education licensees, and is further subject to the terms
 and conditions of one or more written license agreements between SunGard Higher
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/

modules = {
    'uiCatalog' {
        dependsOn "bannerSelfService, syntaxHighlighter"
        defaultBundle environment == "development" ? false : "uiCatalog"
        //defaultBundle false

        resource url:[file: 'css/views/uiCatalog/index.css'], attrs:[media:'screen, projection']
        resource url:[file: 'js/views/uiCatalog/index.js']
        resource url:[file: 'js/views/uiCatalog/autoComplete.comboBox.jeditable.js']
        resource url:[file: 'js/views/uiCatalog/autoComplete.comboBox.js']
        resource url:[file: 'js/views/uiCatalog/datePicker.js']
        resource url:[file: 'js/views/uiCatalog/buttons.js']
        resource url:[file: 'js/views/uiCatalog/tabs.js']
        resource url:[file: 'js/views/uiCatalog/dataTables.js']
    }

    'syntaxHighlighter' {
        resource url:[file: 'css/syntaxHighlighter/shCoreMidnight.css'], attrs:[media:'screen, projection']
        resource url:[file: 'css/syntaxHighlighter/shThemeMidnight.css'], attrs:[media:'screen, projection']
        resource url:[file: 'js/syntaxHighlighter/shCore.js']
        resource url:[file: 'js/syntaxHighlighter/shBrushJScript.js']
        resource url:[file: 'js/syntaxHighlighter/shBrushXml.js']
    }

    'uiCatalogRTL' {
        dependsOn "bannerSelfServiceRTL"
        defaultBundle environment == "development" ? false : "facultyGradeEntryRTL"

        resource url:[file: 'css/views/uiCatalog/facultyGradeEntry-rtl.css'], attrs:[media:'screen, projection']
        resource url:[file: 'css/views/uiCatalog/facultyGradeEntry-rtl-patch.css'], attrs:[media:'screen, projection']
    }
}
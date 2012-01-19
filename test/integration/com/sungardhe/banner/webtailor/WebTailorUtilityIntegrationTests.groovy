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
package com.sungardhe.banner.webtailor

import com.sungardhe.banner.testing.BaseIntegrationTestCase

/**
 * This is a helper class that is used to access Web Tailor
 *
 */


class WebTailorUtilityIntegrationTests extends BaseIntegrationTestCase {

    protected void setUp() {
        formContext = ['SFAALST']
        super.setUp()
    }


    def testGetInfoText() {
        
        def infoText = WebTailorUtility.getInfoText('twbkwbis.P_ValLogin', 'WELCOME')
        assertTrue infoText.contains('Welcome')
        
    }

     def testGetNullInfoText(){
         def infoText = WebTailorUtility.getInfoText('bwckctlg.catalog_label_text', 'ATTRIBUTE_SUFFIX')
         assertEquals "", infoText
     }

}

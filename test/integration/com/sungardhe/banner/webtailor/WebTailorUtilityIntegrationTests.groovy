/** *****************************************************************************
 � 2010 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
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

}

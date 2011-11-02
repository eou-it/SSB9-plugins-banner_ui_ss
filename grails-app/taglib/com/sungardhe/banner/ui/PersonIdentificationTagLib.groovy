/** *****************************************************************************
 Copyright 2008-2011 SunGard Higher Education. All Rights Reserved.

 This copyrighted software contains confidential and proprietary information of
 SunGard Higher Education and its subsidiaries. Any use of this software is
 limited solely to SunGard Higher Education licensees, and is further subject
 to the terms and conditions of one or more written license agreements between
 SunGard Higher Education and the licensee in question. SunGard, Banner and
 Luminis are either registered trademarks or trademarks of SunGard Higher
 Education in the U.S.A. and/or other regions and/or countries.
 ****************************************************************************** */
package com.sungardhe.banner.ui

import org.springframework.security.core.context.SecurityContextHolder

/**
 * Tags to used to provide person based information.
 */
class PersonIdentificationTagLib {
    def fullName = {
        def user = SecurityContextHolder?.context?.authentication?.principal
        if (user?.fullName) {
            out << user.fullName
        }
    }
}
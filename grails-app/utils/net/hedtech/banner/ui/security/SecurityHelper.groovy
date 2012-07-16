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
package net.hedtech.banner.ui.security

/**
 * A helper class to streamline security checks within the UI.
 */
class SecurityHelper {

    /**
     * This will check the 'check' parameter to determine if the request should allow access or not.
     * If 'check' is equal to false, we will take the response object sent in and send back the appropriate
     * error message.  If it is true, we'll call the validatedClosure.
     * @param response
     * @param check
     * @param validatedClosure
     * @return
     */
    static validateAccess( response, check, validatedClosure ) {
        if (check) {
            validatedClosure()
        }
        else {
            response.sendError 403
        }
    }
}

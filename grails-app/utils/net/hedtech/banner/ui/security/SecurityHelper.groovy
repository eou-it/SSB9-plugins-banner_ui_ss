/** *****************************************************************************
 Copyright 2012 - 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
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

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
class ResponseHeaderFilters {
    def filters = {
        all(controller:'*', action:'*') {
            before = {
                if (request.getHeader('X-Requested-With')?.equals('XMLHttpRequest')) {
                    response.setHeader('Expires', '-1')
                    response.setHeader('Cache-Control', 'no-cache')
                    response.addHeader('Cache-Control', 'no-store')
                }
            }
        }
        addNoCachingHeaders(uri: '/**') {
            after = {
                response.setHeader('Expires', '-1')
                response.addHeader('Cache-Control', 'no-cache')
                response.addHeader('Cache-Control', 'no-store')
                response.setHeader( 'X-UA-Compatible', 'IE=edge' )
            }
        }
    }
}

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
package net.hedtech.banner.ui

import org.slf4j.LoggerFactory;

/**
 * Class that helps with client side logging.
 */
class ClientLoggingTagLib {

    def logLevel = { attrs ->
        def logger = LoggerFactory.getLogger("${grailsApplication.getArtefactByLogicalPropertyName( "Controller", attrs.name ?: controllerName ).clazz.name}.${actionName}");
        out << getLevel( logger )
    }


    private def getLevel( logger ) {
        if (logger == null) {
            return "OFF"
        } else if (logger.level) {
            return logger.level
        }
        else {
            return getLevel( logger.parent )
        }
    }
}

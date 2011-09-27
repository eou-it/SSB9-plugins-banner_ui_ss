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
package com.sungardhe.banner

import org.codehaus.groovy.grails.context.support.PluginAwareResourceBundleMessageSource
import org.springframework.util.PropertiesPersister

/**
 * This extention of the base messageSource for Grails applications allows us to obtain
 * the properties that are loaded for the application.
 */
public class BannerPluginAwareResourceBundleMessageSource extends PluginAwareResourceBundleMessageSource {
	def bannerPropertiesPersister;
	
	def getJavaScriptKeys() {
		return bannerPropertiesPersister.getData().keySet().findAll{ it.startsWith( "js" )}
	}
	
	@Override 
	public void setPropertiesPersister(PropertiesPersister propertiesPersister) {
		super.setPropertiesPersister( propertiesPersister )
		this.bannerPropertiesPersister = propertiesPersister
	}
}
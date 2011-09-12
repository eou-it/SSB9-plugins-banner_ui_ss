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
package com.sungardhe.banner;

import org.springframework.util.*

/**
 * Allow us to store off the properties being used within a Grails application.
 */
class BannerPropertiesPersister extends DefaultPropertiesPersister {

	private final Map<Object, Object> data = new HashMap<Object, Object>()

	@Override
	public void load(Properties props, InputStream is) throws IOException {
		super.load(props, is)
		data.putAll(props)
	}

	@Override
	public void load(Properties props, Reader reader) throws IOException {
		super.load(props, reader)
		data.putAll(props)
	}

	public Map<Object, Object> getData() {
		return Collections.unmodifiableMap(data)
	}
}
import org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsAnnotationConfiguration

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

dataSource {
	configClass = GrailsAnnotationConfiguration.class
	dialect = "org.hibernate.dialect.Oracle10gDialect"
	loggingSql = false
}


hibernate {
	cache.use_second_level_cache = true
	cache.use_query_cache = true
	cache.provider_class = 'net.sf.ehcache.hibernate.EhCacheProvider'
	hbm2ddl.auto = null
	show_sql = false
	dialect = "org.hibernate.dialect.Oracle10gDialect"
	config.location = ["classpath:hibernate-banner-core.cfg.xml","classpath:hibernate-banner-theme.cfg.xml"]
}


// environment specific settings
environments {
	development {
		dataSource {
		}
	}
	test {
		dataSource {
		}
	}
	production {
		dataSource {
		}
	}
}

/*******************************************************************************
 Copyright 2009-2017 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
import org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsAnnotationConfiguration

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
	config.location = [
			"classpath:hibernate-banner-core.cfg.xml",
			"classpath:hibernate-banner-general-utility.cfg.xml"
	]
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

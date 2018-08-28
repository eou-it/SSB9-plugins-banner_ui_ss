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
/*
 * Copyright 2004-2008 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package net.hedtech.banner.converters.json


import grails.converters.JSON
import grails.util.Holders
import org.grails.core.artefact.AnnotationDomainClassArtefactHandler

//import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
import org.grails.core.artefact.DomainClassArtefactHandler

//import org.codehaus.groovy.grails.commons.GrailsClassUtils
import grails.util.GrailsClassUtils

//import org.codehaus.groovy.grails.commons.GrailsDomainClass
//import grails.core.GrailsDomainClass this class is depricated
import org.grails.datastore.mapping.model.PersistentEntity

//import org.codehaus.groovy.grails.commons.GrailsDomainClassProperty
//import grails.core.GrailsDomainClassProperty this class is depricated
import org.grails.datastore.mapping.model.PersistentProperty

import grails.core.support.proxy.DefaultProxyHandler
import grails.core.support.proxy.ProxyHandler

import org.grails.web.converters.ConverterUtil
import org.grails.web.converters.exceptions.ConverterException
import org.grails.web.converters.marshaller.ObjectMarshaller
import org.grails.web.json.JSONWriter
import org.grails.datastore.mapping.model.types.Association
import org.springframework.beans.BeanWrapper
import org.springframework.beans.BeanWrapperImpl

import org.grails.datastore.mapping.model.types.Embedded
import org.grails.datastore.mapping.model.types.ManyToOne
import org.grails.datastore.mapping.model.types.OneToOne
/**
 * @author Siegfried Puchbauer
 * @since 1.1
 * Modified for SunGardHigherEducation
 */
public class JSONDomainMarshaller implements ObjectMarshaller<JSON> {

    def localizeMap

    private boolean includeVersion = false
    private ProxyHandler proxyHandler

    public JSONDomainMarshaller(localizeMap, boolean includeVersion) {
        this(localizeMap, includeVersion, new DefaultProxyHandler())
    }

    public JSONDomainMarshaller(localizeMap, boolean includeVersion, ProxyHandler proxyHandler) {
        this.localizeMap = localizeMap
        this.includeVersion = includeVersion
        this.proxyHandler = proxyHandler
    }

    public boolean isIncludeVersion() {
        return includeVersion
    }

    public void setIncludeVersion(boolean includeVersion) {
        this.includeVersion = includeVersion
    }

    public boolean supports(Object object) {
        return AnnotationDomainClassArtefactHandler.isDomainClass(object.getClass()) || AnnotationDomainClassArtefactHandler.isJPADomainClass(object.getClass())
    }

    @SuppressWarnings("unchecked")
    public void marshalObject(Object value, JSON json) throws ConverterException {
        JSONWriter writer = json.getWriter()
        value = proxyHandler.unwrapIfProxy(value)
        Class<?> clazz = value.getClass()
        PersistentEntity domainClass = Holders.getGrailsApplication().getMappingContext().getPersistentEntity( ConverterUtil.trimProxySuffix(clazz.getName()))
        BeanWrapper beanWrapper = new BeanWrapperImpl(value)

        writer.object()
        writer.key("class").value(domainClass.getClass().getName())

        PersistentProperty id = domainClass.getIdentity()
        Object idValue = extractValue(value, id)

        json.property("id", idValue)

        if (isIncludeVersion()) {
            PersistentProperty versionProperty = domainClass.getVersion()
            Object version = extractValue(value, versionProperty)
            json.property("version", version)
        }

        PersistentProperty[] properties = domainClass.getPersistentProperties()

        properties.each { property ->
            writer.key(property.getName())
            if (!(property instanceof Association)) {
                // Write non-relation property
                def name = property.getName()
                def processedValue = valuePreprocessor( name, beanWrapper.getPropertyValue(property.getName() ))
                json.convertAnother( processedValue )
            }
            else {
                Object referenceObject = beanWrapper.getPropertyValue(property.getName())
                if (isRenderDomainClassRelations()) {
                    if (referenceObject == null) {
                        writer.value(null)
                    }
                    else {
                        referenceObject = proxyHandler.unwrapIfProxy(referenceObject)
                        if (referenceObject instanceof SortedMap) {
                            referenceObject = new TreeMap((SortedMap) referenceObject)
                        }
                        else if (referenceObject instanceof SortedSet) {
                            referenceObject = new TreeSet((SortedSet) referenceObject)
                        }
                        else if (referenceObject instanceof Set) {
                            referenceObject = new HashSet((Set) referenceObject)
                        }
                        else if (referenceObject instanceof Map) {
                            referenceObject = new HashMap((Map) referenceObject)
                        }
                        else if (referenceObject instanceof Collection) {
                            referenceObject = new ArrayList((Collection) referenceObject)
                        }
                        json.convertAnother(referenceObject)
                    }
                }
                else {
                    if (referenceObject == null) {
                        json.value(null)
                    }
                    else {
                        PersistentEntity referencedDomainClass = ((Association) property).getAssociatedEntity();

                        // Embedded are now always fully rendered
                        //if (referencedDomainClass == null || property instanceof Embedded || GrailsClassUtils.isJdk5Enum(property.getType())) {
                        if (referencedDomainClass == null || property instanceof Embedded) {
                            json.convertAnother(referenceObject)
                        }
                        else if (property instanceof OneToOne ||
                                property instanceof ManyToOne || property instanceof Embedded) {
                            asShortObject(referenceObject, json, referencedDomainClass.getIdentity(), referencedDomainClass)
                        }
                        else {
                            PersistentProperty referencedIdProperty = referencedDomainClass.getIdentity()
                            @SuppressWarnings("unused")
                            String refPropertyName = referencedDomainClass.getName()
                            if (referenceObject instanceof Collection) {
                                writer.array()

                                Collection o = (Collection) referenceObject
                                o.each { el ->
                                    asShortObject( el, json, referencedIdProperty, referencedDomainClass )
                                }
                                writer.endArray()
                            }
                            else if (referenceObject instanceof Map) {
                                referenceObject.each { entry ->
                                    String key = String.valueOf( entry.key )
                                    Object o = entry.value
                                    writer.object()
                                    writer.key( key )
                                    asShortObject( o, json, referencedIdProperty, referencedDomainClass )
                                    writer.endObject()
                                }
                            }
                        }
                    }
                }
            }
        }
        writer.endObject()
    }

    protected void asShortObject(Object refObj, JSON json, PersistentProperty idProperty, PersistentEntity referencedDomainClass) throws ConverterException {
        JSONWriter writer = json.getWriter()
        writer.object()
        writer.key("class").value(referencedDomainClass.getName())
        writer.key("id").value(extractValue(refObj, idProperty))
        writer.endObject()
    }

    protected Object extractValue(Object domainObject, PersistentProperty property) {
        BeanWrapper beanWrapper = new BeanWrapperImpl(domainObject)
        return beanWrapper.getPropertyValue(property.getName())
    }

    protected boolean isRenderDomainClassRelations() {
        return false
    }


    private def valuePreprocessor( name, value) {
        if (localizeMap[name]) {
            value = localizeMap[name](value)
        }

        if (value && value instanceof String) {
            value = value.encodeAsHTML()
        }
        return value
    }
}

/*
 * Copyright 2011 SunGard Higher Education
 * Modified from original Grails source for GroovyBeanMarshaller
 * https://github.com/grails/grails-core/blob/6d6181cad4bdaa38ab0d02e66bc431401ad57cef/src/java/org/codehaus/groovy/grails/web/converters/marshaller/json/GroovyBeanMarshaller.java
 */
/*
 * Copyright 2004-2008 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
 * 
 * @author Siegfried Puchbauer
 * @since 1.1
 */
package com.sungardhe.banner.converters.json;


import grails.converters.JSON
import java.beans.PropertyDescriptor
import java.lang.reflect.Field
import java.lang.reflect.Method
import java.lang.reflect.Modifier
import org.codehaus.groovy.grails.web.converters.exceptions.ConverterException
import org.codehaus.groovy.grails.web.converters.marshaller.ObjectMarshaller
import org.codehaus.groovy.grails.web.json.JSONWriter
import org.springframework.beans.BeanUtils

/**
 * This marshaller will inspect a bean and ensure that it is localized appropriatly as well as escaped to protect
 * from cross site scripting.
 */
public class JSONBeanMarshaller implements ObjectMarshaller<JSON> {

    def localizeMap

    public JSONBeanMarshaller( localizeMap ) {
        this.localizeMap = localizeMap
    }
    
    public boolean supports(Object object) {
        return object instanceof GroovyObject
    }

    public void marshalObject(Object o, JSON json) throws ConverterException {
        JSONWriter writer = json.getWriter()
        try {
            writer.object();
            PropertyDescriptor[] properties = BeanUtils.getPropertyDescriptors(o.getClass())

            properties.each { property ->
                String name = property.getName()
                Method readMethod = property.getReadMethod()
                if (readMethod != null && !(name.equals("metaClass"))) {
                    writer.key(name)

                    def value = valuePreprocessor(name, readMethod.invoke(o, (Object[]) null) )
                    json.convertAnother(value)
                }
            }


            Field[] fields = o.getClass().getDeclaredFields()
            fields.each { field ->
                int modifiers = field.getModifiers();
                if (Modifier.isPublic(modifiers) && !(Modifier.isStatic(modifiers) || Modifier.isTransient(modifiers))) {
                    def name = field.getName()
                    writer.key(name)

                    def value = valuePreprocessor(name, field.get(o))
                    json.convertAnother(value)
                }
            }
            writer.endObject();
        } catch (ConverterException ce) {
            throw ce
        } catch (Exception e) {
            throw new ConverterException("Error converting Bean with class " + o.getClass().getName(), e)
        }
    }

    private def valuePreprocessor(String name, value) {
        if (localizeMap[name]) {
            value = localizeMap[name](value)
        }

        if (value && value instanceof String) {
            value = value.encodeAsHTML()
        }
        return value
    }
}
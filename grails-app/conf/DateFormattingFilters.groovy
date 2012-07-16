import net.hedtech.banner.i18n.DateConverterService
import org.codehaus.groovy.grails.commons.ControllerArtefactHandler
import org.codehaus.groovy.grails.web.servlet.mvc.SimpleGrailsControllerHelper
import org.apache.commons.io.IOUtils
import org.codehaus.groovy.grails.web.converters.Converter
import javax.servlet.http.HttpServletRequest
import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONElement
import org.codehaus.groovy.grails.web.json.JSONObject

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
class DateFormattingFilters {

    def parseJSONData(HttpServletRequest request, dateFields) {
        Object json = request.getAttribute(JSON.CACHED_JSON);
        if (json == null) {
            String encoding = request.getCharacterEncoding();
            if (encoding == null) {
                encoding = Converter.DEFAULT_REQUEST_ENCODING;
            }
            String content = IOUtils.toString(request.getInputStream(), encoding)
            if(!content.equals("")) {
                json = JSON.parse(content);

                def dateConverterService = new DateConverterService();
                Map mapJSONData = new HashMap()
                if(json != JSONObject.NULL) {
                    json.each { key, data ->
                        //if(!data.isEmpty()) {
                            def newJSONData = dateConverterService.JSONDateUnmarshaller(data, dateFields)
                            mapJSONData.put(key, newJSONData)
                        //}
                    }
                    mapJSONData.each {key, value ->
                        json[key] = value
                    }
                }
            }
        };
        request.setAttribute("JSON", json);
    }

    def filters = {
        all(controller:'*', action:'*') {
            before = {
                if (request.getHeader('X-Requested-With')?.equals('XMLHttpRequest') &&
                    (request.getHeader('Accept') ==~ /.*json.*/ || request.format ==~ /.*json.*/) &&
                      request.hasProperty("JSON")) {

                    if(controllerName) {
                        def controllerClass = grailsApplication.getArtefactByLogicalPropertyName(ControllerArtefactHandler.TYPE, controllerName)
                        def dateFields = controllerClass.getPropertyValue("dateFields")

                        if(dateFields && !dateFields.isEmpty()) {
                            def dateConverterService = new DateConverterService();
                            try {
                                parseJSONData(request, dateFields)
                            }
                            catch (Exception e) {
                                //println e
                            }
                        }
                    }
                }
                else {

                    if(controllerName) {
                        org.codehaus.groovy.grails.web.servlet.mvc.GrailsControllerHelper gch = new SimpleGrailsControllerHelper(grailsApplication, applicationContext, servletContext)
                        def controllerClass = grailsApplication.getArtefactByLogicalPropertyName(ControllerArtefactHandler.TYPE, controllerName)
                        GroovyObject groovyObject = gch.getControllerInstance(controllerClass)
                        def dateFields = controllerClass.getPropertyValue("dateFields")

                        if(dateFields && !dateFields.isEmpty()) {

                            Map paramsMap = groovyObject.getProperty("params")//request.request.parameters
                            Set keys = paramsMap.keySet()

                            def dateConverterService = new DateConverterService()
                            keys.each { key ->
                                String newValue = paramsMap.get(key)
                                if(dateFields.contains(key)) {
                                    if(newValue != null && !newValue.equals("")) {
                                        newValue = dateConverterService.parseDefaultCalendarToGregorian(newValue)
                                    }
                                }

                                paramsMap.put(key, newValue)
                            }
                        }
                    }
                }
            }
        }
    }
}

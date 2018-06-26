package banner.ui.ss
/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

import net.hedtech.banner.i18n.DateConverterService
import org.grails.core.artefact.ControllerArtefactHandler
import org.apache.commons.io.IOUtils
import org.grails.web.converters.Converter
import javax.servlet.http.HttpServletRequest
import grails.converters.JSON
import org.grails.web.json.JSONObject


class DateFormattingInterceptor {

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

    boolean before() {
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
                def controllerClass = grailsApplication.getArtefactByLogicalPropertyName(ControllerArtefactHandler.TYPE, controllerName)
                GroovyObject groovyObject = applicationContext.getBean(controllerClass.class.name)
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

        true
    }

    boolean after() { true }

    void afterView() {
        // no-op
    }

}

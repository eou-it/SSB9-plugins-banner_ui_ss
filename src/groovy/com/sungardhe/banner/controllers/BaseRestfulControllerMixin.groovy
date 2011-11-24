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
package com.sungardhe.banner.controllers

import com.sungardhe.banner.exceptions.ApplicationException
import grails.converters.JSON
import grails.converters.XML
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib

/**
 * A mixin to be used to add features provided by the RestfulControllerMixin, but that does require basic authentication.
 *
 * @see com.sungardhe.banner.controllers.RestfulControllerMixin
 *
 * TODO:  This should be folded into the RestfulControllerMixin at some point.
 */
class BaseRestfulControllerMixin {

    @Lazy // note: Lazy annotation is needed here to ensure 'this' refers to the service we're mixed into (if we're mixed in)
    def log = Logger.getLogger( this.getClass() )

    def localizer = { mapToLocalize ->
        new ValidationTagLib().message( mapToLocalize )
    }

    public Map createSuccessMap( entities, count, params, classSimpleName) {
        def totalCount = count(params)
        def data = entities(params)

        return [success: true,
            data: data,
            totalCount: totalCount,
            pageOffset: params.offset ? params?.offset : 0,
            pageMaxSize: params.max ? params?.max : totalCount,
            message: localizer(code: 'default.list.message',
                    args: [localizer(code: "${classSimpleName}.label", default: "${classSimpleName}")])]
    }


    public Object createSuccessMap( Object entity ) {
        return createEntityMap( entity, null, "success", null );
    }


    public Object createEntityMap( Object entity, String field, String type, String message ) {
        def map = entity.getProperties()
        initMessages( map )
        map.messages << createMessage( message, type, field )

        // When we convert the entity to a map, the metaClass may be added.  If the metaClass is there, it will prevent us from converting the map to JSON at a later stage.
        // Remove the key if it exists since it is not needed by the caller.
        if (map["metaClass"]) {
            map.remove( "metaClass" )
        }
        return map
    }


    /**
     * This adds a messages property to an entity based off exceptions that have occurred.
     * @param entity
     * @param e
     * @return the entity to promote chaining.
     */
    public Object createErrorMap( Object entity, Exception e ) {
        initMessages( entity )

        if (e instanceof ApplicationException) {
            if (e.returnMap( localizer )?.errors == null) {
                entity.messages << createMessage( e.returnMap( localizer ).message )
            }
            else {
                e.returnMap( localizer ).errors.each {
                    entity.messages << createMessage( it.message, "error", it.field )
                }
            }
        }
        else {
            if (e.hasProperty( "errors" )) {
                e.errors.each {
                    entity.messages << createMessage( localizer( error: it ) )
                }
            }
            else {
                entity.messages << createMessage( e.toString() )
            }
        }

        // For chaining purposes
        return entity
    }


    public Map createMessage( message, type = "error", field = null ) {
        [message: message, type: type, field: field]
    }


    public Map createErrorResponseMap( Exception e, entites, message, responseStatus = 500) {
        def localizer = { mapToLocalize ->
            message(mapToLocalize)
        }
        return [success: false,
                data: entites,
                underlyingErrorMessage: e.message,
                errors: (e.hasProperty('errors') ? e.errors?.allErrors?.collect { localizer(error: it) } : null),
                message: message,
                responseStatus: responseStatus
        ]
    }


    public Map getResultsMap( entities, count, params, classSimpleName ) {
        try {
            return createSuccessMap( entities, count, params, classSimpleName )
        }
        catch (ApplicationException e) {
            log.error( e )
            return createErrorResponseMap(e, [], e.returnMap(localizer)?.message, e.httpStatusCode)
        }
        catch (e) { // CI logging
            log.error( e )
            return createErrorResponseMap(e, [], localizer(code: 'default.not.listed.message'))
        }
    }


    public Map renderResultsMap( entities, count, params, classSimpleName) {
        def resultsMap = getResultsMap( entities, count, params, classSimpleName )

        if (resultsMap.success) {
            response.status = 200
        }
        else {
            response.status = resultsMap.responseStatus
        }

        render prepareRespone( resultsMap )
    }


    public def prepareRespone( responseMap ) {
        // We'll first try to use the Accept header
        if (request.getHeader('Accept') ==~ /.*html.*/) {
            response.setHeader("Content-Type", "application/html")
            return responseMap.toString()
        }
        else if (request.getHeader('Accept') ==~ /.*json.*/) {
            response.setHeader("Content-Type", "application/json; charset=UTF-8")
            return (responseMap as JSON).toString()
        }
        else if (request.getHeader('Accept') ==~ /.*xml.*/) {
            response.setHeader("Content-Type", "application/xml")
            return (responseMap as XML).toString()
        }
        // but if that doesn't work, we'll fall back to the format determined by grails
        else if (request.format ==~ /.*json.*/) {
            response.setHeader("Content-Type", "application/json; charset=UTF-8")
            return (responseMap as JSON).toString()
        }
        else if (request.format ==~ /.*xml.*/) {
            response.setHeader("Content-Type", "application/xml")
            return (responseMap as XML).toString()
        }
        else {
            throw new RuntimeException("@@r1:com.sungardhe.framework.unsupported_content_type:${request.format}")
        }
    }


    private initMessages( entity ) {
        if (entity.messages) {
            if (!(entity.messages instanceof List)) {
                throw new Exception( "'messages' is a reserved key and mut be a List. The JSON cannot add messages as requested." )
            }
        }
        else {
            entity.put( "messages", [])
        }
    }
}
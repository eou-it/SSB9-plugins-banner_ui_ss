/*******************************************************************************
 Copyright 2009-2014 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.uifilter

import grails.converters.JSON
import net.hedtech.banner.query.ListFilterManager

class ListFilterBaseController {

    /**
     * This returns a JSON object that is used to construct the Filter UI. This method relies on a parameter to be passed
     * that is used to retrieve the ListFilterManager object from the session. If no such parameter exists, then an error
     * is returned back to the caller.
     */
    def getFilterConfiguration() {
        if (!hasAccess()) {
            response.sendError(403)
        }
        def lookFor = params.id
        if (!lookFor) {
            // Send back an error response
            sendErrorResponse()
        }
        else {
            def listFilterManager = session.getAttribute(lookFor)
            if (!listFilterManager) {
                sendErrorResponse()
            }
            else {
                sendConfigurationSuccess(listFilterManager)
            }
        }
    }

    /**
     * This retrieves a filter that is stored at the given attribute. If no attribute is provided, a default attribute
     * is used.
     *
     * The filter that is returned is a JSON representation that looks like this:
     *      status: success/failure
     *      filter: []
     *          Each element in the array is a map of the following:
     *              field: The code of the field
     *              operator: The code of the operator
     *              value: The value (or value code if it is a validation field).
     *
     */
    def getFilter() {
        if (!hasAccess()) {
            response.sendError(403)
        }
        def lookFor = params.id
        if (!lookFor) {
            // Send back an error response
            sendErrorResponse()
        }
        else {
            def listFilterManager = session.getAttribute(lookFor)
            if (!listFilterManager) {
                sendErrorResponse()
            }
            else {
                sendFilterSuccess(listFilterManager)
            }
        }
    }

    /**
     * Saves the filter to the given session attribute. If none is given, a default one is used.
     */
    def saveFilter() {
        if (!hasAccess()) {
            response.sendError(403)
        }
        def lookFor = params.id
        def filter = params.filter
        if (!lookFor || !filter) {
            // Send back an error response
            sendErrorResponse()
        }
        else {
            def listFilterManager = session.getAttribute(lookFor)
            if (!listFilterManager) {
                sendErrorResponse()
            }
            else {
                def parsedFilter = parseFilter(listFilterManager, filter)

                listFilterManager.saveFilter(parsedFilter)
                sendSuccessResponse()
            }
        }
    }

    /**
     * Deletes the given attribute from the filter, if one exists.
     */
    def deleteFilterAttribute() {
        if (!hasAccess()) {
            response.sendError(403)
        }
        def lookFor = params.id
        def attribute = params.attribute
        if (!lookFor || !attribute) {
            // Send back an error response
            sendErrorResponse()
        }
        else {
            def listFilterManager = session.getAttribute(lookFor)
            if (!listFilterManager) {
                sendErrorResponse()
            }
            else {
                removeFilterItemFrom(listFilterManager, attribute)
                sendFilterSuccess(listFilterManager)
            }
        }
    }

    /**
     * Removes the filter from the filter manager, if one exists.
     */
    def deleteFilter() {
        if (!hasAccess()) {
            response.sendError(403)
        }
        def lookFor = params.id
        if (!lookFor) {
            // Send back an error response
            sendErrorResponse()
        }
        else {
            def listFilterManager = session.getAttribute(lookFor)
            if (!listFilterManager) {
                sendErrorResponse()
            }
            else
            {
                listFilterManager.deleteFilter()
                sendSuccessResponse()
            }
        }

    }

    /**
     * Get validation items. Uses two parameters:
     *      id: The id of the ListFilterManager stored on the session.
     *      field: The field to get the validation table for
     *
     */
    def getValidationItems() {
        def id = params.id
        def field = params.field
        if (!id || !field) {
            sendErrorResponse()
        }
        else
        {
            // Get the configuration from the session
            def listFilterManager = session.getAttribute(id)
            if (!listFilterManager) {
                sendErrorResponse()
            }
            else {
                def configuration = listFilterManager.getFilterDefinition()
                def configForThisField = configuration.find{ it.field?.code == field}
                def sortField = "description"
                def sortDirection = "asc"
                if (configForThisField.validationSortField) {
                    sortField = configForThisField.validationSortField
                }
                if (configForThisField.validationSortDirection) {
                    sortDirection = configForThisField.validationSortDirection
                }
                def all = configForThisField.validationDomain.findAll(sort:sortField, order: sortDirection)
                def domainObjects = []
                all.each { it ->
                    if (configForThisField.customGenerator) {
                        domainObjects << configForThisField.customGenerator(it)
                    }
                    else {
                        domainObjects << ListFilterManager.defaultMapGenerator(it)
                    }
                }
                def returnMap = [:]
                returnMap.status = "success"
                returnMap.field = field
                returnMap.items = domainObjects
                render returnMap as JSON
            }

        }

    }


    /**
     * Get validation items. Uses two parameters:
     *      id: The id of the ListFilterManager stored on the session.
     *      field: The field to get the validation table for
     *
     */
    def getValidationItemsFiltered() {
        def id = params.id
        def field = params.field
        def filter = params.filter
        if (!id || !field) {
            sendErrorResponse()
        }
        else
        {
            // Get the configuration from the session
            def listFilterManager = session.getAttribute(id)
            if (!listFilterManager) {
                sendErrorResponse()
            }
            else {
                def methodToCall = "findAllByDescriptionIlike"
                def configuration = listFilterManager.getFilterDefinition()
                def configForThisField = configuration.find{ it.field?.code == field}
                def sortField = "description"
                def sortDirection = "asc"
                if (configForThisField.validationSortField) {
                    sortField = configForThisField.validationSortField
                }
                if (configForThisField.validationSortDirection) {
                    sortDirection = configForThisField.validationSortDirection
                }
                if (configForThisField.filterFieldMethod) {
                    methodToCall = configForThisField.filterFieldMethod

                }
                def all = configForThisField.validationDomain."$methodToCall"("%" + filter + "%", [sort:sortField, order: sortDirection])
                def domainObjects = []
                all.each { it ->
                    if (configForThisField.customGenerator) {
                        domainObjects << configForThisField.customGenerator(it)
                    }
                    else {
                        domainObjects << ListFilterManager.defaultMapGenerator(it)
                    }
                }
                def returnMap = [:]
                returnMap.status = "success"
                returnMap.field = field
                returnMap.items = domainObjects
                render returnMap as JSON
            }

        }

    }



    protected def hasAccess() {
        return false
    }


    protected void sendErrorResponse() {
        def errorMap = [:]
        errorMap.status = "error"
        render errorMap as JSON
    }


    protected void sendSuccessResponse() {
        def successMap = [:]
        successMap.status = "success"
        render successMap as JSON
    }


    protected void sendConfigurationSuccess(ListFilterManager listFilterManager) {
        def successMap = [:]
        def configurations = []

        def listFilterConfig = listFilterManager.getFilterDefinition()
        listFilterConfig.each { it ->
            def newMap = [:]
            newMap.field = it.field
            newMap.operators = []
            it.operators?.each{ operator ->
                def opMap = [:]
                opMap.code = operator
                opMap.description = message(code: "net.hedtech.banner.student.uifilter.ListFilterBaseController." + operator)
                newMap.operators << opMap
            }
            newMap.type = it.type
            if (it.filterData) {
                newMap.filterData = it.filterData
            }
            configurations << newMap
        }

        successMap.status = "success"
        successMap.configuration = configurations
        render successMap as JSON
    }


    protected void sendFilterSuccess(ListFilterManager listFilterManager) {
        def successMap = [:]
        successMap.status = "success"
        def listFilter = listFilterManager.getFilter()
        successMap.filter = listFilter
        render successMap as JSON
    }


    private def parseFilter(ListFilterManager listFilterManager, def filterAsJSON) {
        def filterMap = [:]
        def parsedFilterFromJSON
        parsedFilterFromJSON = JSON.parse(filterAsJSON)
        def i = 0
        parsedFilterFromJSON.filter.each{ it ->
            addToFilterMap(it, i, filterMap)
            i++
        }

        return filterMap
    }


    private def addToFilterMap(def s, def i, def map) {
        def key = "filter[" + i + "][field]"
        map[key] = s.field
        key = "filter[" + i + "][operator]"
        map[key] = s.operator
        if (s.operator != "has" && s.operator != "hasnot" && s.operator != "t" && s.operator != "f") {
            key = "filter[" + i + "][value]"
            map[key] = s.value
        }
    }


    private removeFilterItemFrom(ListFilterManager filterManager, def attribute) {
        filterManager.deleteAttributeFromFilter(attribute)
    }
}

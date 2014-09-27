
var fixurl = function(url, newLocation) {
    return url.replace("index", newLocation)
};

window.ListFilterView = Backbone.View.extend({

    // The root context for resources
    rootContext: 'None',

    url: 'None', // The base URL to the controller where save, delete, get events are sent to

    /**
     * This function is called during key places during saving and delete operations. It should be used to refresh
     * the item being filtered.
     */
    afterSave: function() {},


    /**
     * This function is called any time a 500 error is received on an AJAX call. It can be replaced with something useful.
     * @param mesage
     */
    fatalError: function(mesage) {},


    /**
     * This function is called after the filter enters into edit mode.
     */
    afterRender: function() {},

    /**
     * This is the element that will anchor the filter.
     */
    el: 'None',

    /**
     * This id is the id of the FilterListManager object stored in the session.
     */
    id: 'None',


    /**
     * States:  None - Not entering filter and none exists
     *          Creating - Creating/editing a filter
     *          Filter - Displaying filter header
     */
    state: 'None',

    /**
     * This is the filters configuration JSON object. It is used to render the items in the filter list
     */
    filterConfiguration: null,


    /**
     * This can be set to an array of columns (fields) to actually include from the configuration. This is useful for
     * when the configuration limits the number of columns to actually allow for filtering. The UI will display the columns
     * in the order in which they are included in this array. If there is no array, all of the columns will be used.
     * There is a function setColumnsToInclude which can be used to set this.
     * Each item in the array should match the field.code in the filter configuration map.
     */
    columnsToInclude: null,

    /**
     *  If a filter pre-exists, it will be stored here when the view initializes.
     */
    filter: null,

    /**
     * This is a base id used to render this particular filter in the browser.
     */
    fieldIdBase: "field",


    /**
     * Maintains state information about the rows that are being used. This is used for when the filter is in "Creating"
     * mode. Each item in the associative array represents on row, keyed by the index of the row.
     * Each item is an associative array with the following
     * associations:
     *      state: new, if the row has been created and no field has been selected. Used otherwise
     *      valueControl: input/select/select2 The control being used to get the value
     *      field: The field code of the selected field for this row.
     */
    stateInformation: {},


    /**
     * This validation state map maps out the fields (columns) which are current setup to use a validation table
     * for their value. Each field will have an entry set to true if it currently using a validation table.
     */
    validationStateMap: {},


    /**
     * Used to add more filter elements to the filer.
     */
    numberSoFar: 0,

    /**
     * This functio initializes the filter. It will make two calls to the controller to get the configuration for the
     * filter and any pre-existing filter.
     * @param theRootContext - The web root context used for resources.
     * @param theUrl - The base URL It will be manipulated to generate the other URLs.
     * @param theAfterSave - The method called after save/delete operations to refresh the filtered list.
     * @param theEl - The HTML element where the filter will be drawn.
     * @param theId - The root ID for the user interface. Should be the same id used to store the ListFilterManager
     *      in the HTTP session.
     * @param theFatalError -
     */
    init: function(theRootContext, theUrl, theAfterSave, theEl, theId, theFatalError, theAfterRender) {
        var self = this;
        this.url = theUrl;
        this.id = theId;
        this.el = theEl;
        this.rootContext = theRootContext
        this.fieldIdBase = theId + "field"
        this.afterSave = theAfterSave
        if (theFatalError !== undefined) {
            this.fatalError = theFatalError

        }
        if (theAfterRender !== undefined) {
            this.afterRender = theAfterRender
        }

        var configUrl = fixurl(theUrl, "getFilterConfiguration")
        var filterUrl = fixurl(theUrl, "getFilter")

        this.getConfigurationAndFilter(configUrl, filterUrl)
    },


    /**
     * Render the control depending on the state of the filter
     */
    render: function() {
        if (this.state == 'filter') {
            this.renderFilterState()
        }
        else if (this.state == 'None') {
            this.renderNoneState()
        }
        this.afterSave()
    },


    /**
     * This functions returns whether or not the filter is in "Creating" mode.
     * @returns {boolean}
     */
    isEditingFilter: function() {
        if (this.state == 'Creating') {
            return true
        }
        else {
            return false
        }
    },


    /**
     * This method switches the filter mode to edit and renders the filter (in edit mode). If a filter pre-ezists,
     * it will be rendered as part of the edit mode.
     */
    editFilter: function() {
        var self = this

        this.validationStateMap = {}

        var value = this.filterConfiguration[0].field.code

        var header = this.buildHeader($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.filterSettings'))
        var rows = ""
        var numberOfFullRows = 0
        this.state = 'Creating'
        this.numberSoFar = 0
        this.stateInformation = {}

        if (this.filter) {
            for (var i=0;i<this.filter.length;i++) {
                this.stateInformation[i] = {}
                rows = rows + this.buildPreexisingRow(this.filter[i], i)
                this.stateInformation[i]["state"] = "used"
            }
            numberOfFullRows = this.filter.length
            this.stateInformation[numberOfFullRows] = {}
            this.stateInformation[numberOfFullRows]["state"] = "new"
            rows = rows + this.buildRow(numberOfFullRows)
        }
        else {
            this.stateInformation[0] = {}
            this.stateInformation[1] = {}
            var firstRow = this.buildFirstRow()
            var secondRow = this.buildRow(1)
            rows = firstRow + secondRow
            numberOfFullRows = 1
            this.stateInformation[0]["state"] = "used"
            this.stateInformation[1]["state"] = "new"

        }
        var footer = this.buildFooter()

        $("#" + this.el).css("display", "block")
        $("#" + this.el).html(header + rows + footer)

        // Add change events for rows. We always have a "new" row, do don't add event for that row's operator
        for (var i=0;i<numberOfFullRows;i++) {

            var value = $("#" + this.fieldIdBase + i + "-field").val()
            var theConfig = this.getConfigurationFor(value)
            this.addHandlers(i, theConfig)
            if (this.stateInformation[i].valueControl === "select2") {
                var filterToUse
                if (this.filter !== undefined && this.filter.length >= i) {
                    filterToUse = this.filter[i]

                }
                var valueForSelect2 = $("#" + this.fieldIdBase + i + "-field").val()
                var theConfigForSelect2 = this.getConfigurationFor(valueForSelect2)
                this.connectSelect2(this.fieldIdBase + i + "-value", theConfigForSelect2.field, filterToUse)
            }
        }

        $("#" + this.fieldIdBase + numberOfFullRows + "-field").change(function() {
            self.fieldChanged(numberOfFullRows)
        })

        this.fillInAllFields()

        // Events for footer
        $("#" + this.fieldIdBase + "-clearAllButton").click(function() {
            self.clearAll()
        })

        $("#" + this.fieldIdBase + "-cancelButton").click(function() {
            self.cancel()
        })

        $("#" + this.fieldIdBase + "-goButton").click(function() {
            self.saveAndGo()
        })

        this.numberSoFar = numberOfFullRows+1

        this.afterRender()
    },


    /**
     * this method switches the mode of the filter depending on whether or not a filter exists and re-renders the filter
     */
    stopEditingFilter: function() {
        if (this.filter !== null && this.numberOfFilters(this.filter))
        {
            this.state = "filter"
        }
        else {
            this.state = 'None'
        }
        this.render()
    },


    /**
     * Sets which columns to include in the fields list. See above for more details.
     * @param toInclude An array of columns to include.
     */
    setColumnsToInclude: function(toInclude) {
        this.columnsToInclude = toInclude
    },


    /**
     * This method renders the filter in filter state, with the header bar and remove button.
     */
    renderFilterState: function() {
        var self=this
        var helpHeader = '<div class="listFilterHelpHeader" id="' + this.fieldIdBase + '-helpheader"/>'
        var header = this.buildHeader($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.filteredResultsBlank'))
        $("#" + this.el).css("display", "block")
        $("#" + this.el).html(helpHeader + header)

        $("#" + this.fieldIdBase + "-header-fields").attr("class", "listFilterHeader-fields-shown")
        $("#" + this.fieldIdBase + "-header-clear").attr("class", "listFilterHeader-clear-shown")

        var fieldIds = this.addFieldsToHeader(this.fieldIdBase + "-header-fields")
        this.addHelpTextToHeaderFields(this.fieldIdBase + "-header-fields", this.fieldIdBase + "-helpheader")

        $.each(fieldIds, function(key, value) {
            var valueToUse = value
            var idToUse = key
            $("#" + key).click(function() {
                  self.deleteFilterItem(idToUse, valueToUse)
            });
        });

        $("#" + this.fieldIdBase + "-header-clear-button").click(function() {
            self.deleteFilter()
        });
    },


    /**
     * Renders the filter in "none" state, which is no filter state.
     */
    renderNoneState: function() {
        $("#" + this.el).css("display", "none")
    },


    /**
     * This method is used to display the number of filtered results.
     * @param total
     */
    showFilterTotal: function(total) {
        var message = $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.filteredResults', [total])
        $("#" + this.fieldIdBase + "-header-results").html(message)
        $("#" + this.fieldIdBase + "-header-results").focus()

    },


    buildHeader: function(s) {
        return '<div class="listFilterHeader" id="' + this.fieldIdBase + '-header">' +
                    '<span class="listFilterHeader-results" id="' + this.fieldIdBase + '-header-results" tabindex="0">' + s + '</span>' +
                    '<span class="listFilterHeader-fields-hidden" id="' + this.fieldIdBase + '-header-fields"/>' +
                    '<span class="listFilterHeader-clear-hidden" id="' + this.fieldIdBase + '-header-clear">' +
                        '<button id="' + this.fieldIdBase + '-header-clear-button"'
                            + ' class="listFilterHeader-remove-filter-button">'
                            + $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.removeFilter')+ '</button>' +
                    '</span>' +
                '</div>';
    },


    buildPreexisingRow: function(rowDef, rowNum) {
        if (this.filterConfiguration == null) {
            return ""
        }
        else {
            var idBase = this.fieldIdBase + rowNum
            var divId = idBase
            var fieldId = idBase + "-field"

            var firstRowDiv

            var divOpen = '<div class="listFilterItem-row" name="' + idBase + '" id="' + idBase + '">';
            var divOpen = divOpen + '<span class="listFilterItem-container">'

            // Build the field (column) list
            var fieldSpan = this.getFieldSpan(rowDef, rowNum, null)


            var theConfig = this.getConfigurationFor(rowDef.field)
            var operatorSelect = this.buildOperatorSelect(rowNum, theConfig, rowDef.operator)
            var valueBox = this.buildValueBox(rowNum, theConfig, rowDef.operator, rowDef.value)
            var imageUrl = this.getImageUrl(rowNum)

            var operatorSpan = '<span id="' + idBase + '-op" class="listFilterItem">' + operatorSelect + '</span>'

            var valueSpan = '<span id="' + idBase + '-v" class="listFilterItem">' + valueBox + '</span>'
            var deleteSpan = '<span id="' + idBase + '-d" class="listFilterItem-deleteImage">' + imageUrl + '</span>'
            var divClose = '</span></div>';
            firstRowDiv = divOpen + fieldSpan  + operatorSpan + valueSpan + deleteSpan + divClose
            return firstRowDiv
        }
    },


    buildFirstRow: function() {
        // We build a list box with the items from our configuration
        if (this.filterConfiguration == null) {
            return ""
        }
        else {
            // Make a row with the first item selected and filled in.
            var idBase = this.fieldIdBase + 0
            var divId = idBase
            var fieldId = idBase + "-field"
            var firstRowDiv

            var divOpen = '<div class="listFilterItem-row" name="' + idBase + '" id="' + idBase + '">';
            var divOpen = divOpen + '<span class="listFilterItem-container">'
            var fieldSpan = this.getFieldSpan(null, 0, null)

            var value = this.filterConfiguration[0].field.code
            var theConfig = this.getConfigurationFor(value)
            var operatorSelect = this.buildOperatorSelect(0, theConfig)
            var valueBox = this.buildValueBox(0, theConfig, this.filterConfiguration[0].operators[0].code)
            var imageUrl = this.getImageUrl(0)

            var operatorSpan = '<span id="' + idBase + '-op" class="listFilterItem">' + operatorSelect + '</span>'

            var valueSpan = '<span id="' + idBase + '-v" class="listFilterItem">' + valueBox + '</span>'
            var deleteSpan = '<span id="' + idBase + '-d" class="listFilterItem-deleteImage">' + imageUrl + '</span>'
            var divClose = '</span></div>';
            firstRowDiv = divOpen + fieldSpan  + operatorSpan + valueSpan + deleteSpan + divClose
            return firstRowDiv
        }

    },


    buildRow: function(rowNumber) {
        // We build a list box with the items from our configuration
        if (this.filterConfiguration == null) {
            return ""
        }
        else {
            var idBase = this.fieldIdBase + rowNumber
            var divId = idBase
            var fieldId = idBase + "-field"

            var divOpen = '<div class="listFilterItem-row" name="' + idBase + '" id="' + idBase + '">';
            divOpen = divOpen + '<span class="listFilterItem-container">'
            var keySelect = this.getFieldSpan(null, rowNumber, $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.selectAColumn'));
            var operatorDiv = '<span id="' + idBase + '-op" class="listFilterItem"></span>'
            var valueDiv = '<span id="' + idBase + '-v" class="listFilterItem"></span>'
            var deleteSpan = '<span id="' + idBase + '-d" class="listFilterItem-deleteImage"></span>'
            var divClose = '</span></div>';
            return divOpen + keySelect  + operatorDiv + valueDiv + deleteSpan + divClose
        }
    },


    buildFooter: function() {
        return '<div class="listFilterFooter" id="' + this.fieldIdBase + '-footer">' +
            '<span class="listFilterFooter-message" id="' + this.fieldIdBase + '-footer-message" tabindex="0"></span>' +
            '<span class="listFilterFooter-buttons"><button type="button" id="' + this.fieldIdBase + '-cancelButton">' +
                $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.cancel') + '</button>' +
            '<button type="button" id="' + this.fieldIdBase+ '-clearAllButton">' +
                $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.clearAll')+ '</button>' +
            '<button type="button" id="' + this.fieldIdBase+ '-goButton">' +
                $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.go') + '</button>' + '' +
            '</span></div>'
    },


    fieldChanged: function(keyThatChanged) {
        var self = this
        var idBase = this.fieldIdBase + keyThatChanged
        var fieldId = idBase + "-field"
        var operatorId = idBase + "-operator"
        if (this.filterConfiguration != null) {
            // Add in the operator drop down list box
            // Find the value of this select
            var value = $("#" + fieldId).val()
            var theConfig = this.getConfigurationFor(value)
            var operatorSelect = this.buildOperatorSelect(keyThatChanged, theConfig)

            $("#" + idBase + "-op").html(operatorSelect)

            $("#" + idBase + "-operator").change(function() {
                self.operatorChanged(keyThatChanged, theConfig)
            });

            // Add in the value according to type
            var valueBox = this.buildValueBox(keyThatChanged, theConfig, theConfig.operators[0].code)
            $("#" + idBase + "-v").html(valueBox)
            if (this.stateInformation[keyThatChanged].valueControl === "select2") {
                this.connectSelect2(this.fieldIdBase + keyThatChanged + "-value", theConfig.field)
            }

            // Add in our delete icon
            var imageUrl = this.getImageUrl(keyThatChanged)
            $("#" + idBase + "-d").html(imageUrl)
            $("#" + idBase + "-delete").click(function() {
                self.deleteRow(keyThatChanged)
            });

            // Update state map
            this.stateInformation[keyThatChanged]["state"] = "used"
            this.stateInformation[keyThatChanged]["field"] = value

            // Now add a new row if needed
            var needNewRow = this.hasNewRow()
            if (needNewRow == false) {
                var newRowNum = this.numberSoFar

                this.stateInformation[newRowNum] = {}
                this.stateInformation[newRowNum]["state"] = "new"

                var newRow = this.buildRow(newRowNum)

                $("#" + this.fieldIdBase + "-footer").before(newRow)
                $("#" + this.fieldIdBase + newRowNum + "-field").change(function() {
                    self.fieldChanged(newRowNum)
                })


                this.numberSoFar++
            }
            this.fillInAllFields()
        }
    },


    hasNewRow: function() {
        var found = false

        // Go through our state map and see if we have one set to new
        $.each(this.stateInformation, function(key, value) {
            if (value["state"] === "new") {
                found = true;
            }
        })

        return found
    },


    deleteRow: function(rowNum) {
        this.deleteRowInfo(rowNum)
        this.fillInAllFields()
    },


    deleteRowInfo: function(rowNum) {
        $("#" + this.fieldIdBase + rowNum).remove()
        delete this.validationStateMap[rowNum]
        delete this.stateInformation[rowNum]

    },

    clearAll: function() {
        var self = this
        $.each(this.stateInformation, function(rowId, map) {
            if (map["state"] !== "new") {
                self.deleteRowInfo(rowId)
            }
        });
        this.fillInAllFields()

    },

    cancel: function() {
        this.stopEditingFilter()
    },


    saveAndGo: function() {
        var self = this
        this.clearAlert()

        // Validate the filter selections are OK. That means no duplicate fields.
        if (this.validateFields()) {
            // If they are OK, then generate a new filter object based on the values in the fields.
            var theFilter = new Object()
            theFilter.filter = []
            $.each(this.stateInformation, function(key, value){
                if (value["state"] !== "new") {
                    var idBase = self.fieldIdBase + key
                    var fieldId = idBase + "-field"
                    var operatorId = idBase + "-operator"
                    var valueId = idBase + "-value"

                    var isList = self.validationStateMap[key]
                    var mapForThis = {}
                    mapForThis["field"] = $("#" + fieldId).val()
                    mapForThis["operator"] = $("#" + operatorId).val()
                    if (self.hasValue(mapForThis["operator"])) {
                        if (self.stateInformation[key].valueControl === "select2") {
                            mapForThis["value"] = $("#" + valueId).select2('data').text;
                        }
                        else if (self.stateInformation[key].valueControl === "select") {
                            mapForThis["value"] = $("#" + valueId + " option:selected").text()
                        }
                        else {
                            mapForThis["value"] = $("#" + valueId).val()
                        }
                    }
                    theFilter.filter.push(mapForThis)
                }
            });
            this.filter = theFilter.filter
            theFilterString = JSON.stringify(theFilter)

            // Call back to the saveFilter entry point.
            var saveFilterUrl = fixurl(this.url, "saveFilter")

            // Get the configuration
            $.ajax({
                url: saveFilterUrl,
                type: "POST",
                dataType: "JSON",
                data: { id: this.id, filter: theFilterString },
                success: function (data) {
                    // If that works, call the postSave function
                    self.state = "filter"
                    self.render()
                    self.afterSave()
                },
                error: function () {
                    self.fatalError($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.failedToSaveFilter'))
                }
            });
        }
    },


    getFieldSpan: function(rowDef, rowNum, message) {
        var self = this
        var idBase = this.fieldIdBase + rowNum
        var fieldId = idBase + "-field"
        var selectedField = undefined
        var columnHelp = $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.selectAColumn')

        var fieldsToDisplay = this.columnsToInclude
        if (fieldsToDisplay === null) {
            fieldsToDisplay = []
            var i = 0
            for (i=0;i<this.filterConfiguration.length;i++) {
                fieldsToDisplay.push(this.filterConfiguration[i].field.code)
            }
        }

        if (rowDef !== null) {
            selectedField = rowDef.field
        }
        else if (message === null) {
            selectedField = fieldsToDisplay[0]
        }

        var keySelect = '<span class="listFilterItem"><select aria-label="' + columnHelp + '" id="' + fieldId + '" class="listFilterItem-control">'
        if (message !== null) {
            keySelect = keySelect + '<option value="none">' + message + '</option>'
        }

        $.each(fieldsToDisplay, function(index, field) {
            var configuration = self.getConfigurationFor(field)
            var selectedString = ""
            if (field === selectedField) {
                selectedString = 'selected="selected"'
            }
            keySelect = keySelect + '<option ' + selectedString + 'value="' + field + '">' +
                configuration.field.description + '</option>'
        });

        keySelect = keySelect + '</select></span>';

        this.stateInformation[rowNum].field = selectedField
        return keySelect
    },


    buildOperatorSelect: function(rowNumber, theConfig, selectCode) {
        var idBase = this.fieldIdBase + rowNumber
        var fieldId = idBase + "-field"
        var operatorId = idBase + "-operator"
        var operatorHelp = $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.selectAnOperator')
        var operatorSelect = '<select id="' + operatorId + '" class="listFilterItem-control" aria-label="' + operatorHelp + '">'


        for (i=0;i<theConfig.operators.length;i++) {
            var selectedS = ""
            if (theConfig.operators[i].code === selectCode) {
                selectedS = 'selected="selected"'
            }
            operatorSelect = operatorSelect + '<option ' + selectedS + ' value="' + theConfig.operators[i].code + '">' +
                theConfig.operators[i].description + '</option>'

        }
        operatorSelect  = operatorSelect +  '</select>'
        return operatorSelect
    },


    getConfigurationFor: function(value) {
        var i = 0
        var theConfig
        for (i=0;i<this.filterConfiguration.length;i++) {
            if (this.filterConfiguration[i].field.code == value) {
                theConfig = this.filterConfiguration[i]
                break
            }
        }
        return theConfig
    },


    buildValueBox: function(rowNumber, theConfig, operatorCode, valueToUse) {
        var idBase = this.fieldIdBase + rowNumber
        var self = this
        var valueBox
        var theValueToUse = valueToUse
        this.validationStateMap[rowNumber] = false
        this.stateInformation[rowNumber].valueControl = "input"
        var inputHelp = $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.enterAValue')
        var selectHelp = $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.selectAValue')

        if (operatorCode === "eq" || operatorCode === "ne") {
            if (theConfig.type === "validation") {
                this.validationStateMap[rowNumber] = true
                if (theConfig.filterData === true) {
                    this.stateInformation[rowNumber].valueControl = "select2"
                    valueBox = this.createSelect2From(theConfig, rowNumber, valueToUse)
                }
                else {
                    this.stateInformation[rowNumber].valueControl = "select"

                    // For validation, we add a list box then make an ajax call to have it filled in
                    valueBox = '<select aria-label = ' + selectHelp + '" id="' + idBase + '-value' + '" class="listFilterItem-control"><option value="none">' +
                        $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.gettingPossibleValues') + '</option>'
                    valueBox = valueBox + '</select>'

                    var validationUrl = fixurl(this.url, "getValidationItems")
                    $.ajax({
                        url: validationUrl,
                        type: "GET",
                        dataType: "JSON",
                        data: { id: this.id, field: theConfig.field.code },
                        success: function (data) {
                            if (data.status === "success") {
                                var parentDiv = $("#" + idBase + "-v") // parent div
                                var newSelect = '<select aria-label = ' + selectHelp + '" id="' + idBase + '-value" class="listFilterItem-control"><option value="none">' +
                                    $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.selectAValue') + '</option>'
                                for (var i=0;i<data.items.length;i++) {
                                    var selectedString = ""
                                    if (data.items[i].description === theValueToUse) {
                                        selectedString = 'selected="selected"'
                                    }
                                    newSelect = newSelect + '<option ' + selectedString + 'value="' + data.items[i].code + '">' + data.items[i].description+ '</option>'
                                }
                                parentDiv.html(newSelect)
                            }
                        },
                        error: function () {
                            self.fatalError($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.failedToGetValidation'))
                        }
                    });
                }
            }
            else {
                if (valueToUse !== undefined) {
                    valueBox = '<input  aria-label = ' + inputHelp + '" type="text" id="' + idBase + '-value' + '" class="listFilterItem-control" value="' + valueToUse + '"></input>'
                }
                else {
                    valueBox = '<input  aria-label = ' + inputHelp + '" type="text" id="' + idBase + '-value' + '" class="listFilterItem-control"></input>'

                }
            }
        }
        else if (operatorCode !== "t" && operatorCode !== "f" && operatorCode !== "has" && operatorCode !== "hasnot") {
            if (valueToUse !== undefined) {
                valueBox = '<input aria-label = ' + inputHelp + '" type="text" id="' + idBase + '-value' + '" class="listFilterItem-control" value="' + valueToUse + '"></input>'
            }
            else {
                valueBox = '<input aria-label = ' + inputHelp + '" type="text" id="' + idBase + '-value' + '" class="listFilterItem-control"></input>'
            }
        }
        else {
            valueBox = ""
        }

        return valueBox
    },


    getImageUrl: function(rowNumber) {
        var idBase = this.fieldIdBase + rowNumber
        var imageUrl = '<input type="image" src="' +
            this.rootContext + '/images/remove-circle-silhouette.png" alt="' +
                $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.deleteRow') + '" + id="' +
            idBase + '-delete">'
        return imageUrl
    },


    operatorChanged: function(rowNumber, theConfig) {
        var value = $("#" + this.fieldIdBase + rowNumber + "-operator").val()
        var newValueBox = this.buildValueBox(rowNumber, theConfig, value)
        $("#" + this.fieldIdBase + rowNumber + "-v").html(newValueBox)
        if (this.stateInformation[rowNumber].valueControl === "select2") {
            this.connectSelect2(this.fieldIdBase + rowNumber + "-value", theConfig.field)
        }
    },


    validateFields: function() {
        var self=this
        var fieldMap = {}
        var fieldUsedMoreThanOnce
        var emptyValue

        // Ensure that no two fields select boxes have the same field.
        $.each(this.stateInformation, function(key, value){
            if (value["state"] !== "new") {
                var idBase = self.fieldIdBase + key
                var fieldId = idBase + "-field"
                var valueId = idBase + "-value"
                var fieldToTest = $("#" + fieldId).val()
                var valueToTest = $("#" + valueId).val()

                if (fieldMap[fieldToTest] === undefined) {
                    fieldMap[fieldToTest] = true
                }
                else {
                    fieldUsedMoreThanOnce = fieldToTest
                }
                if (self.validationStateMap[key] == true) {
                    if (valueToTest === "none") {
                        emptyValue = true
                    }
                }
                else if (valueToTest === "") {
                    emptyValue = true
                }
            }
        })
        if (fieldUsedMoreThanOnce !== undefined) {
            this.sendAlert($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.duplicateColumn'))
            return false
        }
        else  if (emptyValue === true) {
            this.sendAlert($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.emptyValue'))
            return false
        }
        else {
            return true
        }
    },


    sendAlert: function(message) {
        $("#" + this.fieldIdBase + "-footer-message").html(message)
        $("#" + this.fieldIdBase + "-footer-message").focus()
    },


    clearAlert: function() {
        $("#" + this.fieldIdBase + "-footer-message").html("")
    },


    deleteFilter: function() {
        var self=this
        var deleteFilterUrl = fixurl(this.url, "deleteFilter")
        $.ajax({
            url: deleteFilterUrl,
            type: "GET",
            dataType: "JSON",
            data: { id: this.id },
            success: function (data) {
                if (data.status === "success") {
                    self.filter = undefined
                    self.state = "None"
                    self.render()
                }
            },
            error: function () {
                self.fatalError($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.failedToRemoveFilter'))
            }
        });
    },


    addFieldsToHeader: function(fieldsId) {
        var filterIds = {}
        var buttonsHtml = ""
        var filters = this.filter
        for (var i=0;i<filters.length;i++) {
            var desc = this.getDescriptionFor(filters[i].field)
            var id = fieldsId + '-' + filters[i].field
            buttonsHtml = buttonsHtml + '<button class="listFilterHeader-fields-button" id="' + id + '" aria-describedBy="' + id + '-help">' +
                desc + ' X</button>'
            filterIds[id] = filters[i].field
        }
        $("#" + fieldsId).html(buttonsHtml)
        return filterIds
    },


    addHelpTextToHeaderFields: function(fieldsId, helpHeaderId) {
        var helpHtml = ""
        var useOne = false
        if (this.filter.length === 1) {
            useOne = true
        }

        for (var i=0;i<this.filter.length;i++) {
            var helpDesc = ""
            if (useOne === true) {
                helpDesc = $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.removeItemOnlyOneHelp',[this.getDescriptionFor(this.filter[i].field)])
            }
            else {
                helpDesc = $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.removeItemHelp',[this.getDescriptionFor(this.filter[i].field)])
            }
            var id = fieldsId + '-' + this.filter[i].field
            helpHtml = helpHtml + '<span id="' + id + '-help">' + helpDesc + '</span>'
        }

        $("#" + helpHeaderId).html(helpHtml)
    },


    getDescriptionFor: function(fieldId) {
        var size = this.filterConfiguration.length
        var desc
        for (var i=0;i<size;i++) {
            if (this.filterConfiguration[i].field.code === fieldId) {
                desc = this.filterConfiguration[i].field.description;
                break;
            }
        }
        return desc
    },


    deleteFilterItem: function(id, value) {
        var self=this
        var deleteItemUrl = fixurl(this.url, "deleteFilterAttribute")
        $.ajax({
            url: deleteItemUrl,
            type: "GET",
            dataType: "JSON",
            data: { id: this.id, attribute: value },
            success: function (data) {
                if (data.status === "success") {
                    self.filter = data.filter
                    if (self.numberOfFilters(self.filter) < 1) {
                        self.filter = undefined
                        self.state = "None"
                    }
                    self.render()
                }
            },
            error: function () {
                self.fatalError($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.failedToRemoveTheFilterItem'))
            }
        });
    },


    getConfigurationAndFilter: function(configUrl, filterUrl) {
        var self=this
        var theFilterUrl = filterUrl
        // Get the configuration
        $.ajax({
            url: configUrl,
            type: "GET",
            dataType: "JSON",
            data: { id: self.id },
            success: function (data) {
                if (data.status == "success") {
                    self.filterConfiguration = data.configuration
                    self.getFilter(theFilterUrl)
                }
            },
            error: function () {
                self.fatalError($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.failedToGetFilterConfig'))
            }
        });
    },


    getFilter: function(filterUrl) {
        var self=this
        // Get pre-existing filter
        $.ajax({
            url: filterUrl,
            type: "GET",
            dataType: "JSON",
            data: { id: this.id },
            success: function (data) {
                if (data.filter != undefined) {
                    if (self.numberOfFilters(data.filter)) {
                        self.filter = data.filter
                        self.state = 'filter'
                    }
                    else {
                        self.filter = undefined
                        self.state = "None"
                    }
                    self.render()
                }
            },
            error: function () {
                self.fatalError($.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.failedToGetFilter'))
            }
        });
    },


    numberOfFilters: function(filters) {
        return filters.length
    },


    addHandlers: function(index, config) {
        var self = this
        $("#" + this.fieldIdBase + index + "-field").change(function() {
            self.fieldChanged(index)
        })
        $("#" + this.fieldIdBase + index + "-operator").change(function() {
            self.operatorChanged(index, config)
        });
        $("#" + this.fieldIdBase + index + "-delete").click(function() {
            self.deleteRow(index)
        });
    },


    hasValue: function(operatorCode) {
        if (operatorCode !== "has" && operatorCode !== "hasnot" &&
            operatorCode !== "t" && operatorCode !== 'f') {
            return true
        }
        else {
            return false
        }
    },


    createSelect2From: function(config, rowNumber, valueToUse) {
        var self = this
        var idBase = this.fieldIdBase + rowNumber
        var valueBox
        if (valueToUse !== undefined) {
            valueBox = '<input type="text" id="' + idBase + '-value' + '" class="listFilterItem-control" value="' + valueToUse + '"></input>'
        }
        else {
            valueBox = '<input type="text" id="' + idBase + '-value' + '" class="listFilterItem-control"></input>'
        }
        return valueBox

    },


    connectSelect2: function(idOfComponent, field, initialValue) {
        var self=this
        var validationUrl = fixurl(this.url, "getValidationItemsFiltered")
        var idOfComponentToUse = idOfComponent
        var fieldToUse = field
        var thisInitialValue = initialValue

        var select2Component = $("#" + idOfComponent);

        var thisComponent = select2Component.select2({
            minimumInputLength: 3,
            placeholder: $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.placeholder'),
            ajax: {
                url: validationUrl,
                dataType: 'json',
                quietMillis: 1000,
                data: function (searchTerm, page) {
                    var toSend = {}
                    toSend.id = self.id;
                    toSend.field = fieldToUse.code;
                    toSend.filter = searchTerm;//$("#" + idOfComponentToUse).val();
                    return toSend;
                },
                results: function (data, page) {
                    var results = [];
                    var innerData = data.items;
                    var more = (page*10) < innerData.length;
                    $.each(innerData, function (i, item) {
                        results.push({id: item.code, text: item.description});
                    });
                    return {results: results, more: more};
                }
            },
            initSelection: function(element, callback) {
                if (thisInitialValue) {
                    callback({id: "", text: thisInitialValue.value})
                }

            }
        });

    },

    fillInAllFields: function() {
        var self = this
        $.each(this.stateInformation, function(key, value){
            if (value["state"] === "new") {
                self.fillInFields(null, key, $.i18n.prop('net.hedtech.banner.student.uifilter.ListFilterBaseController.js.selectAColumn'))
            }
            else {
                self.fillInFields(null, key, null)
            }
        });
    },

    /**
     * This function fills in the fields of a given field select. It does the following:
     *      1. Figure out which fields are to be displayed period.
     *      2. Remove all of the already displayed fields, unless it is the one for this select.
     *      3. Set the field for this select as selected.
     * @param rowDef
     * @param rowId - The id of the row. This is also the key into our stateInformation object
     * @param message
     */
    fillInFields: function(rowDef, rowId, message) {
        var self = this
        var i = 0
        var selectedField = undefined

        var select = $("#" + this.fieldIdBase + rowId + "-field")
        if (select !== undefined) {

            // Start with complete list and widdle down from there
            var fieldsToDisplay = [];
            if (this.columnsToInclude === null) {
                for (i=0;i<this.filterConfiguration.length;i++) {
                    fieldsToDisplay.push(this.filterConfiguration[i].field.code)
                }
            }
            else {
                fieldsToDisplay = this.columnsToInclude.concat()
            }

            var stateInformationForThisRow = this.stateInformation[rowId]
            if (stateInformationForThisRow !== undefined) {
                selectedField = stateInformationForThisRow.field
                $.each(this.stateInformation, function(key, value){
                    if (key != rowId) {
                        var fieldInFieldsToDisplay = $.inArray(value.field, fieldsToDisplay)
                        if (fieldInFieldsToDisplay > -1) {
                            fieldsToDisplay.splice(fieldInFieldsToDisplay, 1)
                        }
                    }
                });
            }

            // At this point, our fieldsToDisplay only includes the fields that we need for this select
            select.find("option").remove()

            if (message !== null) {
                select.append('<option value="none">' + message + '</option>')
            }
            for (i=0;i<fieldsToDisplay.length;i++) {
                var thisIsSelected = false
                if (fieldsToDisplay[i] === selectedField) {
                    thisIsSelected = true
                }
                select.append(new Option(this.getDescriptionFor(fieldsToDisplay[i]), fieldsToDisplay[i],
                    thisIsSelected, thisIsSelected))
            }
        }
    },

    getFilterDef: function(fieldCode) {
        if (this.filter != null) {
            for (var i=0;i<this.filter.length;i++) {
                if (rowDef.field === fieldCode) {
                    return this.filter[i]
                }
            }
        }

        return undefined

    }

});


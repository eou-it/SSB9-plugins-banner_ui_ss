/*
 * File:        KeyTable.js
 * Version:     1.1.7 dev
 * CVS:         $Idj$
 * Description: Keyboard navigation for HTML tables
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Created:     Fri Mar 13 21:24:02 GMT 2009
 * Modified:    $Date$ by $Author$
 * Language:    Javascript
 * License:     GPL v2 or BSD 3 point style
 * Project:     Just a little bit of fun :-)
 * Contact:     www.sprymedia.co.uk/contact
 *
 * Copyright 2009-2011 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 */


function KeyTable ( oInit )
{
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * API parameters
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    var _MODE = {
        ACTIONABLE : "AM",
        NAVIGATION : "NM",
        OUTOFFOCUS : "OM"
    }


    /*
     * Variable: gridCurrentMode
     * Purpose:  Indicates the current mode of the Grid. KeyTable events should be processed
     * Scope:    KeyTable - public
     */
    this.gridCurrentMode;

    /*
     * Variable: event
     * Purpose:  Container for all event application methods
     * Scope:    KeyTable - public
     * Notes:    This object contains all the public methods for adding and removing events - these
     *           are dynamically added later on
     */
    this.event = {
        "remove": {}
    };


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * API methods
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /*
     * Function: fnGetCurrentPosition
     * Purpose:  Get the currently focused cell's position
     * Returns:  array int: [ x, y ]
     * Inputs:   void
     */
    this.fnGetCurrentPosition = function ()
    {
        return [ _iOldX, _iOldY ];
    };


    /*
     * Function: fnGetCurrentData
     * Purpose:  Get the currently focused cell's data (innerHTML)
     * Returns:  string: - data requested
     * Inputs:   void
     */
    this.fnGetCurrentData = function ()
    {
        return _nOldFocus.innerHTML;
    };


    /*
     * Function: fnGetCurrentTD
     * Purpose:  Get the currently focused cell
     * Returns:  node: - focused element
     * Inputs:   void
     */
    this.fnGetCurrentTD = function ()
    {
        return _nOldFocus;
    };

    function _log() {
        if (window.debug) {
            console.log.apply(console, Array.prototype.concat.apply(
                [(_oDatatable && _oDatatable.fnSettings().nTable.id) || $(_nBody).closest('[id]')[0].id],
                arguments ));
        }
    }

    /*
     * Function: focus
     * Purpose:  Set the focus on the datagrid, setting the position of the focused cell
     * Returns:  -
     * Inputs:   int:x - x coordinate
     *           int:y - y coordinate
     */
    this.focus = function(x,y) {
        _fnCaptureKeys();
        if (x != null && y != null) {
            this.fnSetPosition(x,y);
        }
        else {
            _fnApplyUIChangesForFocus( x );
        }
    }

    /*
     * Function: fnSetPosition
     * Purpose:  Set the position of the focused cell
     * Returns:  -
     * Inputs:   int:x - x coordinate
     *           int:y - y coordinate
     * Notes:    Thanks to Rohan Daxini for the basis of this function
     */
    this.fnSetPosition = function( x, y )
    {
        if ( typeof x == 'object' && x.nodeName )
        {
            _fnApplyUIChangesForFocus( x );
        }
        else
        {
            _fnApplyUIChangesForFocus( _fnCellFromCoords(x, y) );
        }
    };




    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Private parameters
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    var _ACTIONABLE_COMPONENTS_CONSTANT = "a, area, button, input, object, select, textarea";

    var _ACTIONABLE_COMPONENTS_TO_SET_FOCUS = "input, select, textarea";

    /*
     * Clean up bound events
     */
    this.fnDestroy = function() {
        jQuery(document).unbind( "keypress", _fnKey ).unbind( "keydown", _fnKey )
            .unbind( "click focus", _fnReleaseFocus );
        if ( _oDatatable )
        {
            jQuery('tbody td', _oDatatable.fnSettings().nTable).die( 'click', _fnClick );
        }
        else
        {
            jQuery(_ACTIONABLE_COMPONENTS_TO_SET_FOCUS, _nBody).die( 'click', _fnDummyClickEventOnComponent);
            jQuery(_ACTIONABLE_COMPONENTS_TO_SET_FOCUS, _nBody).die( 'focus', _fnPerformFocusOnComponent );
            jQuery('td', _nBody).die( 'click', _fnClick);
            /* When Grid is part of the form, KeyTable creates hidden input field this needs to be cleaned up on destroy*/
            jQuery(_sHiddenClass).remove();
        }
    }

    /*
     * Variable: _nBody
     * Purpose:  Body node of the table - cached for reference
     * Scope:    KeyTable - private
     */
    var _nBody = null;

    /*
     * Variable:
     * Purpose:  Element that previously had focus
     * Scope:    KeyTable - private
     */
    var _nOldFocus = null;

    /*
     * Variable: _iDefaultX and _iDefaultY
     * Purpose:  X and Y coords of the default element to focus on
     * Scope:    KeyTable - private
     */
    var _iDefaultX = null;
    var _iDefaultY = null;

    /*
     * Variable: _iOldX and _iOldY
     * Purpose:  X and Y coords of the old element that was focused on
     * Scope:    KeyTable - private
     */
    var _iOldX = null;
    var _iOldY = null;

    /*
     * Variable: _enabledColumnsForNavigation
     * Purpose:  Column indices that allow navigable/editable.
     * Scope:    KeyTable - private
     */
    var _enabledColumnsForNavigation = null;

    /*
     * Variable: _columnsNavigationMode
     * Purpose:  Column indices that allow focus. All cells in the grid. Other columns are skipped. Null = all enabled.
     * Scope:    KeyTable - private
     */
    var _columnsNavigationMode = null;

    /*
     * Variable: _columnsActionableMode
     * Purpose:  Column indices that allow focus.  Only actionable or editable cells.Other columns are skipped. Null = all enabled.
     * Scope:    KeyTable - private
     */
    var _columnsActionableMode = null;

    /*
     * Variable: _actionablePositionsEveryRow
     * Purpose:  Column indices that allow focus.  Only actionable or editable cells.Other columns are skipped. Null = all enabled.
     * Scope:    KeyTable - private
     */
    var _actionablePositionsEveryRow = {};

    /*
     * Variable: _that
     * Purpose:  Scope saving for 'this' after a jQuery event
     * Scope:    KeyTable - private
     */
    var _that = null;

    /*
     * Variable: sFocusClass
     * Purpose:  Class that should be used for focusing on a cell
     * Scope:    KeyTable - private
     */
    var _sFocusClass = "focus";
    /*
     * Variable: sHiddenClass
     * Purpose:  Class that should be used for Hidden cell created for supporting Form element.
     * Scope:    KeyTable - private
     */
    var _sHiddenClass = "hiddenClass";

    /*
     * Variable: _bKeyCapture
     * Purpose:  Flag for should KeyTable capture key events or not
     * Scope:    KeyTable - private
     */
    var _bKeyCapture = false;

    /*
     * Variable: _oaoEvents
     * Purpose:  Event cache object, one array for each supported event for speed of searching
     * Scope:    KeyTable - private
     */
    var _oaoEvents = {
        "action": [],
        "esc": [],
        "focus": [],
        "blur": []
    };

    /*
     * Variable: _oDatatable
     * Purpose:  DataTables object for if we are actually using a DataTables table
     * Scope:    KeyTable - private
     */
    var _oDatatable = null;
    var _nInput;
    var _bInputFocused = false;


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Private methods
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Key table events
     */

    /*
     * Function: _fnEventAddTemplate
     * Purpose:  Create a function (with closure for sKey) event addition API
     * Returns:  function: - template function
     * Inputs:   string:sKey - type of event to detect
     */
    function _fnEventAddTemplate( sKey )
    {
        /*
         * Function: -
         * Purpose:  API function for adding event to cache
         * Returns:  -
         * Inputs:   1. node:x - target node to add event for
         *           2. function:y - callback function to apply
         *         or
         *           1. int:x - x coord. of target cell (can be null for live events)
         *           2. int:y - y coord. of target cell (can be null for live events)
         *           3. function:z - callback function to apply
         * Notes:    This function is (interally) overloaded (in as much as javascript allows for
         *           that) - the target cell can be given by either node or coords.
         */
        return function ( x, y, z ) {
            if ( (x===null || typeof x == "number") &&
                (y===null || typeof y == "number") &&
                typeof z == "function" )
            {
                _fnEventAdd( sKey, x, y, z );
            }
            else if ( typeof x == "object" && typeof y == "function" )
            {
                var aCoords = _fnCoordsFromCell( x );
                _fnEventAdd( sKey, aCoords[0], aCoords[1], y );
            }
            else
            {
                alert( "Unhandleable event type was added: x" +x+ "  y:" +y+ "  z:" +z );
            }
        };
    }


    /*
     * Function: _fnEventRemoveTemplate
     * Purpose:  Create a function (with closure for sKey) event removal API
     * Returns:  function: - template function
     * Inputs:   string:sKey - type of event to detect
     */
    function _fnEventRemoveTemplate( sKey )
    {
        /*
         * Function: -
         * Purpose:  API function for removing event from cache
         * Returns:  int: - number of events removed
         * Inputs:   1. node:x - target node to remove event from
         *           2. function:y - callback function to apply
         *         or
         *           1. int:x - x coord. of target cell (can be null for live events)
         *           2. int:y - y coord. of target cell (can be null for live events)
         *           3. function:z - callback function to remove - optional
         * Notes:    This function is (interally) overloaded (in as much as javascript allows for
         *           that) - the target cell can be given by either node or coords and the function
         *           to remove is optional
         */
        return function ( x, y, z ) {
            if ( (x===null || typeof arguments[0] == "number") &&
                (y===null || typeof arguments[1] == "number" ) )
            {
                if ( typeof arguments[2] == "function" )
                {
                    _fnEventRemove( sKey, x, y, z );
                }
                else
                {
                    _fnEventRemove( sKey, x, y );
                }
            }
            else if ( typeof arguments[0] == "object" )
            {
                var aCoords = _fnCoordsFromCell( x );
                if ( typeof arguments[1] == "function" )
                {
                    _fnEventRemove( sKey, aCoords[0], aCoords[1], y );
                }
                else
                {
                    _fnEventRemove( sKey, aCoords[0], aCoords[1] );
                }
            }
            else
            {
                alert( "Unhandleable event type was removed: x" +x+ "  y:" +y+ "  z:" +z );
            }
        };
    }

    /* Use the template functions to add the event API functions */
    for ( var sKey in _oaoEvents )
    {
        if ( sKey )
        {
            this.event[sKey] = _fnEventAddTemplate( sKey );
            this.event.remove[sKey] = _fnEventRemoveTemplate( sKey );
        }
    }


    /*
     * Function: _fnEventAdd
     * Purpose:  Add an event to the internal cache
     * Returns:  -
     * Inputs:   string:sType - type of event to add, given by the available elements in _oaoEvents
     *           int:x - x-coords to add event to - can be null for "blanket" event
     *           int:y - y-coords to add event to - can be null for "blanket" event
     *           function:fn - callback function for when triggered
     */
    function _fnEventAdd( sType, x, y, fn )
    {
        _oaoEvents[sType].push( {
            "x": x,
            "y": y,
            "fn": fn
        } );
    }


    /*
     * Function: _fnEventRemove
     * Purpose:  Remove an event from the event cache
     * Returns:  int: - number of matching events removed
     * Inputs:   string:sType - type of event to look for
     *           node:nTarget - target table cell
     *           function:fn - optional - remove this function. If not given all handlers of this
     *             type will be removed
     */
    function _fnEventRemove( sType, x, y, fn )
    {
        var iCorrector = 0; // KB: just to avoid stepping backward through the list!

        for ( var i=0, iLen=_oaoEvents[sType].length ; i<iLen-iCorrector ; i++ )
        {
            if ( typeof fn != 'undefined' )
            {
                if ( _oaoEvents[sType][i-iCorrector].x == x &&
                    _oaoEvents[sType][i-iCorrector].y == y &&
                    _oaoEvents[sType][i-iCorrector].fn == fn )
                {
                    _oaoEvents[sType].splice( i-iCorrector, 1 );
                    iCorrector++;
                }
            }
            else
            {
                if ( _oaoEvents[sType][i-iCorrector].x == x && // iCorrector not relevant here, because this is only for no fn undefined
                    _oaoEvents[sType][i-iCorrector].y == y )
                {
                    _oaoEvents[sType].splice( i, 1 );
                    return 1;
                }
            }
        }
        return iCorrector;
    }


    /*
     * Function: _fnEventFire
     * Purpose:  Look thought the events cache and fire off the event of interest
     * Returns:  int:iFired - number of events fired
     * Inputs:   string:sType - type of event to look for
     *           int:x - x coord of cell
     *           int:y - y coord of  ell
     * Notes:    It might be more efficient to return after the first event has been tirggered,
     *           but that would mean that only one function of a particular type can be
     *           subscribed to a particular node.
     */
    function _fnEventFire ( sType, x, y )
    {
        var iFired = 0;
        var aEvents = _oaoEvents[sType];
        for ( var i=0 ; i<aEvents.length ; i++ )
        {
            if ( (aEvents[i].x == x     && aEvents[i].y == y    ) ||
                (aEvents[i].x === null && aEvents[i].y == y    ) ||
                (aEvents[i].x == x     && aEvents[i].y === null ) ||
                (aEvents[i].x === null && aEvents[i].y === null )
                )
            {
                aEvents[i].fn( _fnCellFromCoords(x,y), x, y );
                iFired++;
            }
        }
        return iFired;
    }



    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Focus functions
     */

    /*
     * Function: _fnSetFocus
     * Purpose:  Set focus on a node, and remove from an old node if needed
     * Returns:  -
     * Inputs:   node:nTarget - node we want to focus on
     *           bool:bAutoScroll - optional - should we scroll the view port to the display
     */
    function _fnApplyUIChangesForFocus( nTarget, bAutoScroll )
    {
        if ( !nTarget ) {
            nTarget = _fnCellFromCoords( _iDefaultX, _iDefaultY );
        }

        /* If node already has focus, just ignore this call */
        if ( _nOldFocus == nTarget )
        {
            return;
        }

        // look for an enabled cell close by
        function findEnabledCell( nCell ) {
            var foundCell = nCell;
            var position = _fnCoordsFromCell( nCell );
            var x = position[0];
            var y = position[1];
            if ( !_enabledColumnsForNavigation || -1 != _enabledColumnsForNavigation.indexOf(x)) { return foundCell; }

            var iTableWidth = _nBody.getElementsByTagName('tr')[0].getElementsByTagName('td').length;

            // ensure x is within enabled columns
            var min = _enabledColumnsForNavigation[0];
            var max = _enabledColumnsForNavigation[_enabledColumnsForNavigation.length-1];
            x = x < min ? min : x;
            x = x > max ? max : x;

            var enabledPos = _fnFindEnabledColumn(x, y, 1, iTableWidth);
            if (enabledPos[0] != position[0]) {
                if ( enabledPos[1] != y ) {
                    // wrapped, so look backward along the row instead
                    enabledPos = _fnFindEnabledColumn(x, y, -1, iTableWidth);
                }
                foundCell = _fnCellFromCoords( enabledPos[0], y ); // nearby cell in same row
            }
            return foundCell || nCell;
        }
        nTarget = findEnabledCell(nTarget);

        if ( typeof bAutoScroll == 'undefined' )
        {
            bAutoScroll = true;
        }

        /* Remove old focus (with blur event if needed) */
        if ( _nOldFocus !== null )
        {
            _fnRemoveFocus( _nOldFocus );
        }

        /* Add the new class to highlight the focused cell */
        jQuery(nTarget).addClass( _sFocusClass );
        jQuery(nTarget).parent().addClass( _sFocusClass );
        jQuery(nTarget).attr('tabindex','0');
        /* If it's a DataTable then we need to jump the paging to the relevant page */
        var oSettings;
        if ( _oDatatable )
        {
            oSettings = _oDatatable.fnSettings();
            var position = _fnFindDtCell( nTarget );
            if (!position) {
                _log( '_fnSetFocus on cell that is not found', nTarget );
                return;
            }
            var iRow = position[1];
            var bKeyCaptureCache = _bKeyCapture;

            /* Page forwards */
            while ( iRow >= oSettings.fnDisplayEnd() )
            {
                if ( oSettings._iDisplayLength >= 0 )
                {
                    /* Make sure we are not over running the display array */
                    if ( oSettings._iDisplayStart + oSettings._iDisplayLength < oSettings.fnRecordsDisplay() )
                    {
                        oSettings._iDisplayStart += oSettings._iDisplayLength;
                    }
                }
                else
                {
                    oSettings._iDisplayStart = 0;
                }
                _oDatatable.oApi._fnCalculateEnd( oSettings );
            }

            /* Page backwards */
            while ( iRow < oSettings._iDisplayStart )
            {
                oSettings._iDisplayStart = oSettings._iDisplayLength>=0 ?
                    oSettings._iDisplayStart - oSettings._iDisplayLength :
                    0;

                if ( oSettings._iDisplayStart < 0 )
                {
                    oSettings._iDisplayStart = 0;
                }
                _oDatatable.oApi._fnCalculateEnd( oSettings );
            }

            /* Re-draw the table */
            _oDatatable.oApi._fnDraw( oSettings );

            /* Restore the key capture */
            _bKeyCapture = bKeyCaptureCache;
        }

        /* Cache the information that we are interested in */
        var aNewPos = _fnCoordsFromCell( nTarget );
        _nOldFocus = nTarget;
        _iOldX = aNewPos[0];
        _iOldY = aNewPos[1];

        var iViewportHeight, iViewportWidth, iScrollTop, iScrollLeft, iHeight, iWidth, aiPos;
        if ( bAutoScroll )
        {
            /* Scroll the viewport such that the new cell is fully visible in the rendered window */
            iViewportHeight = document.documentElement.clientHeight;
            iViewportWidth = document.documentElement.clientWidth;
            iScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            iScrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            iHeight = nTarget.offsetHeight;
            iWidth = nTarget.offsetWidth;
            aiPos = _fnGetPos( nTarget );

            /* Take account of scrolling in DataTables 1.7 - remove scrolling since that would add to
             * the positioning calculation
             */
            if ( _oDatatable && typeof oSettings.oScroll != 'undefined' &&
                (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
            {
                aiPos[1] -= $(oSettings.nTable.parentNode).scrollTop();
                aiPos[0] -= $(oSettings.nTable.parentNode).scrollLeft();
            }

            /* Correct viewport positioning for vertical scrolling */
            if ( aiPos[1]+iHeight > iScrollTop+iViewportHeight )
            {
                /* Displayed element if off the bottom of the viewport */
                _fnSetScrollTop( aiPos[1]+iHeight - iViewportHeight );
            }
            else if ( aiPos[1] < iScrollTop )
            {
                /* Displayed element if off the top of the viewport */
                _fnSetScrollTop( aiPos[1] );
            }

            /* Correct viewport positioning for horizontal scrolling */
            if ( aiPos[0]+iWidth > iScrollLeft+iViewportWidth )
            {
                /* Displayed element is off the bottom of the viewport */
                _fnSetScrollLeft( aiPos[0]+iWidth - iViewportWidth );
            }
            else if ( aiPos[0] < iScrollLeft )
            {
                /* Displayed element if off the Left of the viewport */
                _fnSetScrollLeft( aiPos[0] );
            }
        }

        /* Take account of scrolling in DataTables 1.7 */
        if ( _oDatatable && typeof oSettings.oScroll != 'undefined' &&
            (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
        {
            var dtScrollBody = oSettings.nTable.parentNode;
            iViewportHeight = dtScrollBody.clientHeight;
            iViewportWidth = dtScrollBody.clientWidth;
            iScrollTop = dtScrollBody.scrollTop;
            iScrollLeft = dtScrollBody.scrollLeft;
            iHeight = nTarget.offsetHeight;
            iWidth = nTarget.offsetWidth;

            /* Correct for vertical scrolling */
            if ( nTarget.offsetTop + iHeight > iViewportHeight+iScrollTop )
            {
                dtScrollBody.scrollTop = (nTarget.offsetTop + iHeight) - iViewportHeight;
            }
            else if ( nTarget.offsetTop < iScrollTop )
            {
                dtScrollBody.scrollTop = nTarget.offsetTop;
            }

            /* Correct for horizontal scrolling */
            if ( nTarget.offsetLeft + iWidth > iViewportWidth+iScrollLeft )
            {
                dtScrollBody.scrollLeft = (nTarget.offsetLeft + iWidth) - iViewportWidth;
            }
            else if ( nTarget.offsetLeft < iScrollLeft )
            {
                dtScrollBody.scrollLeft = nTarget.offsetLeft;
            }
        }
        /* Fire of the focus event if there is one */
        _fnEventFire( "focus", _iOldX, _iOldY );
    }


    /*
     * Function: _fnBlur
     * Purpose:  Blur focus from the whole table
     * Returns:  -
     * Inputs:   -
     */
    function _fnBlur()
    {
        console.log('start in _fnBlur');
        _fnSetGridOutOfFocusMode();
        _fnRemoveFocus( _nOldFocus );
        _fnAddTabIndexToFormObjs();
        // remember old X,Y for when we get focus again, but clear out old element
        _fnReleaseKeys();
        jQuery(_nOldFocus).attr('tabindex', '0');
        _nOldFocus = null;
        console.log('end in _fnBlur');
    }



    /*
     * Function: _fnRemoveFocus
     * Purpose:  Remove focus from a cell and fire any blur events which are attached
     * Returns:  -
     * Inputs:   node:nTarget - cell of interest
     */
    function _fnRemoveFocus( nTarget )
    {
        jQuery(nTarget).removeClass( _sFocusClass );
        jQuery(nTarget).parent().removeClass( _sFocusClass );
        jQuery(nTarget).removeAttr('tabindex');
        if ( nTarget !== null ) {
            _fnEventFire( "blur", _iOldX, _iOldY );
        }
    }


    /*
     * Function: _fnClick
     * Purpose:  Focus on the element that has been clicked on by the user
     * Returns:  -
     * Inputs:   event:e - click event
     */
    function _fnClick ( e ) {
        var nTarget = this;
        var prevTarget;
        prevTarget = _fnCellFromCoords(_iOldX,_iOldY);
        prevTarget = !prevTarget?_fnCellFromCoords(_iDefaultX,_iDefaultY):prevTarget;
        jQuery(prevTarget).removeAttr('tabindex');
        nTarget = _fnGetCellForSelectedComponent(nTarget);
        isActionableComponentExists(nTarget) ? _fnSetGridActionableMode(nTarget, e) : _fnSetGridNavigationMode(nTarget);
        jQuery(nTarget).attr('tabindex','0');
    }

    function _fnGetCellForSelectedComponent(nTarget)  {
        while ( nTarget && nTarget.nodeName != "TD" )
        {
            nTarget = nTarget.parentNode;
        }
        return nTarget;
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Key events
     */

    /*
     * Function: _fnRemoveFocus
     * Purpose:  Remove focus from a cell and fire any blur events which are attached
     * Returns:  -
     * Inputs:   node:nTarget - cell of interest
     */
    /*
     * Variable: _actionCount
     * Purpose:  Counter used to initialize _Action enumeration
     * Scope:    KeyTable - private
     */
    var _actionCount = 0;
    /*
     * Variable: _Action
     * Purpose:  Enumerated Actions known to KeyTable. Higher-level representation of key events.
     *           There should also be a map of actions to function handlers, rather than the switch statement in
     * Scope:    KeyTable - private
     */
    var _Action =  {
        NO_ACTION: _actionCount++
        ,       CHARACTER_ENTRY: _actionCount++ // any plain keystroke
        ,       ACTION: _actionCount++ // return
        ,       ESCAPE: _actionCount++
        ,       LEFT: _actionCount++
        ,       UP: _actionCount++
        ,       DOWN: _actionCount++
        ,       RIGHT: _actionCount++
        ,       LEFT: _actionCount++
        ,       HOME: _actionCount++
        ,       END: _actionCount++
        ,       PAGE_UP: _actionCount++
        ,       PAGE_DOWN: _actionCount++
        ,       FULL_ROW_SELECT: _actionCount++
        ,       BLUR: _actionCount++
        ,       PREVIOUS_CONTROL: _actionCount++
        ,       NEXT_CONTROL: _actionCount++
        ,       SPACE: _actionCount++
    };
    this.Action = _Action;

    /*
     * Variable: _KeyCode
     * Purpose:  Recognized event.keyCode constants
     * Scope:    KeyTable - private
     */
    var _KeyCode = {
        TAB: 9
        ,       ENTER: 13
        ,       ESC: 27
        ,       LEFT_ARROW: 37
        ,       UP_ARROW: 38
        ,       RIGHT_ARROW: 39
        ,       DOWN_ARROW: 40
        ,       HOME: 36
        ,       END: 35
        ,       PAGE_UP: 33
        ,       PAGE_DOWN: 34
        ,       SPACE: 32
    };

    /*
     * Variable: _UnmodifiedKeyActions
     * Purpose:  Map of keyCode values to Action values if no modifier key is pressed.
     *           This should be caller-configurable.
     * Scope:    KeyTable - private
     */
    var _UnmodifiedKeyActions = {};
    _UnmodifiedKeyActions[_KeyCode.TAB] = _Action.BLUR;
    _UnmodifiedKeyActions[_KeyCode.ENTER] = _Action.ACTION;
    _UnmodifiedKeyActions[_KeyCode.ESC] = _Action.ESCAPE;
    _UnmodifiedKeyActions[_KeyCode.LEFT_ARROW] = _Action.LEFT;
    _UnmodifiedKeyActions[_KeyCode.UP_ARROW] = _Action.UP;
    _UnmodifiedKeyActions[_KeyCode.RIGHT_ARROW] = _Action.RIGHT;
    _UnmodifiedKeyActions[_KeyCode.DOWN_ARROW] = _Action.DOWN;
    _UnmodifiedKeyActions[_KeyCode.HOME] = _Action.HOME;
    _UnmodifiedKeyActions[_KeyCode.END] = _Action.END;
    _UnmodifiedKeyActions[_KeyCode.PAGE_UP] = _Action.PAGE_UP;
    _UnmodifiedKeyActions[_KeyCode.PAGE_DOWN] = _Action.PAGE_DOWN;
    _UnmodifiedKeyActions[_KeyCode.SPACE] = _Action.SPACE;

    /*
     * Function: _fnGetAction
     * Purpose:  Get the Action value for a given key event.
     *           This should be caller-configurable.
     * Returns:  -
     * Inputs:   node:nTarget - cell of interest
     */
    function _fnGetAction( e ) // this will need to be configurable
    {
        var anyModifier = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
        var shiftOnly = e.shiftKey && !(e.altKey || e.ctrlKey || e.metaKey);
        var altOnly = e.altKey && !(e.shiftKey || e.ctrlKey || e.metaKey);
        if ( e.keytable_done ) {
            return _Action.NO_ACTION;
        }
        e.keytable_done = true; // would like to convert to a preventDefault & stopPropagation (except in the set-it-back-to-false case below)

        if ( !anyModifier ) {
            if ( e.keyCode in _UnmodifiedKeyActions ) return _UnmodifiedKeyActions[e.keyCode];
        }

        if ( !anyModifier || shiftOnly ) {
            if ( e.keyCode > 32 ) return _Action.CHARACTER_ENTRY; //!! this isn't a good test for character entry
        }

        if ( shiftOnly ) {
            if ( e.keyCode == _KeyCode.TAB )
                return _Action.PREVIOUS_CONTROL;
            else if((e.keyCode == _KeyCode.SPACE) ||((navigator.userAgent.toLowerCase().indexOf('firefox')) && (e.charCode == _KeyCode.SPACE)))
                return _Action.FULL_ROW_SELECT;
        }

        if ( altOnly ) {
            if ( e.keyCode == _KeyCode.UP_ARROW ) return _Action.PREVIOUS_CONTROL;
            if ( e.keyCode == _KeyCode.DOWN_ARROW ) return _Action.NEXT_CONTROL;
        }
        e.keytable_done = false;
        return _Action.NO_ACTION;
    }

    /*
     * Function: _fnMoveFocus(current,focusDirection)
     * Purpose:  Move the focus from current to the appropriate element,
     *           following typical browser tabbing through the visible items with tabindex,
     *           then the items without tabindex, then wrapping back.
     * Returns:  void
     * Inputs:   current: currently focused element
     *           focusDirection: +1 to tab forward, -1 to cycle backward
     */
    function _fnMoveFocus(current, focusDirection) {
        var tabindexed = $('[tabindex]');
        var targets = $(_ACTIONABLE_COMPONENTS_CONSTANT).filter(':not([tabindex])').filter(':visible');

        // convert to an array of elements, because jQuery would sort in document order
        var all = tabindexed.get().concat( targets.get() );

        // find current element, and adjust by focusDirection
        var index = all.indexOf(current) + focusDirection;

        // wrap if needed
        var choice = index;
        choice < 0 ? all.length - 1 : choice;
        choice = choice >= all.length ? 0 : choice;

        var target = all[ choice ];
        $(target).focus();
    }

    function _fnFindEnabledColumn( oldX, oldY, direction, width )
    {
        var x = oldX;
        var min = 0;
        var max = width-1;
        if ( _enabledColumnsForNavigation ) {
            min = _enabledColumnsForNavigation[0];
            max = _enabledColumnsForNavigation[_enabledColumnsForNavigation.length-1];

            while ( -1 == _enabledColumnsForNavigation.indexOf(x)) {
                if ( x < min ) {
                    break;
                }
                if ( x > max ) {
                    break;
                }
                x += direction;
            }
        }
        if ( x < min ) {
            // wrap and move up a row
            return [max,oldY-1];
        }
        if ( x > max ) {
            // wrap and move down a row
            return [min,oldY+1];
        }
        // no wrap, no move a row
        return [x,oldY];
    }


    function _fnAction(action,event)
    {
        var
            x, y,
            iTableWidth = _nBody.getElementsByTagName('tr')[0].getElementsByTagName('td').length,
            iTableHeight;

        /* Get table height and width - done here so as to be dynamic (if table is updated) */
        if ( _oDatatable )
        {
            /*
             * Locate the current node in the DataTable overriding the old positions - the reason for
             * is is that there might have been some DataTables interaction between the last focus and
             * now
             */
            var oSettings = _oDatatable.fnSettings();
            iTableHeight = oSettings.aiDisplay.length;

            var aDtPos = _fnFindDtCell( _nOldFocus );
            if ( aDtPos === null )
            {
                //_log( '_fnKey focused cell cannot be seen: do nothing' );
                /* If the table has been updated such that the focused cell can't be seen - do nothing */
                return;
            }
            _iOldX = aDtPos[ 0 ];
            _iOldY = aDtPos[ 1 ];
        }
        else
        {
            iTableHeight = _nBody.getElementsByTagName('tr').length;
        }

        _log( ' _fnKey action=' + action + ' ' + iTableWidth + '/' + iTableHeight );
        nTarget = _fnCellFromCoords(_iOldX,_iOldY);
        switch( action )
        {
            case _Action.ACTION:
                if(isActionableComponentExists(nTarget))    {
                    _fnSetGridActionableMode(nTarget,event);
                }
                return true;
            case _Action.ESCAPE:
                if ( !_fnEventFire( "esc", _iOldX, _iOldY ) )
                {
                    /* Only lose focus if there isn't an escape handler on the cell */
                    _fnEventFire("blur",_iOldX,_iOldY);
                }
                _fnSetGridNavigationMode();
                return true;
            case _Action.LEFT:
                var xy = _fnFindEnabledColumn( _iOldX-1, _iOldY, -1, iTableWidth );
                x = xy[0];
                y = xy[1];
                if ( y < 0 ) {
                    //!! change in behavior: left arrow will (may?) now move to previous form element
                    //!! in addition to SHIFT-TAB key
                    return false;
                }
                break;

            case _Action.UP:
                if ( _iOldY > 0 ) {
                    x = _iOldX;
                    y = _iOldY - 1;
                } else {
                    return false;
                }
                break;

            case _Action.RIGHT:
                var xy = _fnFindEnabledColumn( _iOldX+1, _iOldY, 1, iTableWidth );
                x = xy[0];
                y = xy[1];
                if ( y >= iTableHeight ) {
                    //!! Change in behavior: right arrow will (may?) now move to next form element,
                    //!! in addition to TAB key
                    return false;
                }
                break;

            case _Action.DOWN:
                if ( _iOldY < iTableHeight-1 ) {
                    x = _iOldX;
                    y = _iOldY + 1;
                } else {
                    return false;
                }
                break;

            case _Action.HOME:
                x = _enabledColumnsForNavigation[0];
                y = _iOldY;
                break;
            case _Action.END:
                x = _enabledColumnsForNavigation[_enabledColumnsForNavigation.length-1];
                y = _iOldY;
                break;
            case _Action.PAGE_UP:
                x = _iOldX;
                y = 0;
                break;
            case _Action.PAGE_DOWN:
                x = _iOldX;
                y =  iTableHeight - 1;
                break;
            case _Action.FULL_ROW_SELECT:
                x = _iOldX;
                y = _iOldY;
                jQuery('tr',_nBody).filter('.add-row-selected').removeClass('add-row-selected');
                jQuery('td',_nBody).filter('.add-row-selected').removeClass('add-row-selected');
                jQuery('tr:eq('+_iOldY+')',_nBody).children("td").addClass("add-row-selected");
                break;
            case _Action.BLUR:
            case _Action.PREVIOUS_CONTROL:
            case _Action.NEXT_CONTROL:
                nTarget.focus();
                _fnBlur();
                return true;
            default: /* Nothing we are interested in */
                return true;
        }
        nTarget = _fnCellFromCoords(x, y)
        _fnSetGridNavigationMode(nTarget);
        return false;
    }
    this.fnAction = _fnAction;

    function _fnAddTabIndexToFormObjs(){
        $(_ACTIONABLE_COMPONENTS_CONSTANT, _nBody).each(function() {
            $(this).each(function(){
                $(this).attr('tabindex','-1');
            });
        });
    }

    function _fnRemoveTabIndexToFormObjs(){
        $(_ACTIONABLE_COMPONENTS_CONSTANT, _nBody).each(function() {
            $(this).each(function(){
                $(this).removeAttr('tabindex');
            });
        });
    }

    function isActionableComponentExists(nTarget){
        var actionableComponentExists = $(_ACTIONABLE_COMPONENTS_CONSTANT, nTarget).length;
        return (actionableComponentExists? true: false);
    }

    function _fnSetGridNavigationMode(nTarget){
        _fnSetGridMode(_MODE.NAVIGATION);
        _fnSetEnabledColumns(_columnsNavigationMode);
        nTarget = !nTarget?_fnCellFromCoords(_iOldX,_iOldY):nTarget;
        nTarget = !nTarget?_fnCellFromCoords(_iDefaultX,_iDefaultY):nTarget;
        _fnAddTabIndexToFormObjs();
        _fnSetFocusToCell(nTarget);
    }

    function _fnSetGridActionableMode(nTarget, e){
        _fnSetGridMode(_MODE.ACTIONABLE);
        _fnSetEnabledColumns(_columnsActionableMode);
        _fnRemoveTabIndexToFormObjs();
        _fnSetFocusToCell(nTarget);
        var temp = $(':first-child', nTarget);
        temp = temp.length ? temp[0] : nTarget;
        temp.focus();
        e.stopPropagation();
        e.preventDefault();
    }

    function _fnSetGridOutOfFocusMode(){
        _fnSetGridMode(_MODE.OUTOFFOCUS);
    }

    function _fnSetGridMode(mode)   {
        _that.gridCurrentMode = mode;
    }


    function _fnSetFocusToCell(nTarget) {
        nTarget.focus();
        _fnCaptureKeys();
        _fnApplyUIChangesForFocus(nTarget);
    }


    function isFocusOnTheGrid(){
        return _bKeyCapture?true:false;
    }




    function fnPerformActionableMode(e)    {
        // KeyTable has been told to block/ignore keypresses, because a component is open
        // so handle TAB/ENTER here.  _that.block should be reset in the blur/close event of the component.

        switch (e.keyCode) {
            case _KeyCode.TAB: // make TAB move LEFT (RIGHT with SHIFT)
                _fnAction(_Action.ESCAPE, e);
                var xy = e.shiftKey?_fnGetPreviousEditablePos():_fnGetNextEditablePos();
                var nTarget = _fnCellFromCoords(xy[0], xy[1]);
                _fnSetGridActionableMode(nTarget,e);
                break;
            case _KeyCode.ESC:
                _that.fnAction(_Action.ESCAPE, e);
                break;
        }
        return true;
    }

    function fnPerformNavigationalMode(e)    {
        var action = _fnGetAction( e );
        if ( action === _Action.NO_ACTION ) {
            return true;
        }
        if (action == _Action.ACTION ) {
            // don't let other listeners receive the ENTER keypress. This may not be needed in the "always submit" model.
            e.preventDefault();
            e.stopPropagation();
        }
        var result = _fnAction(action,e);
        return result;
    }

    /*
     * Function: _fnKey
     * Purpose:  Deal with a key events, be it moving the focus or return etc.
     * Returns:  bool: - allow browser default action
     * Inputs:   event:e - key event
     */
    function _fnKey ( e )
    {
        if ( e.keytable_done || (e.originalEvent && e.originalEvent.keytable_done)) {
            return false; // this event has already been handled
        }
        if (!_bKeyCapture ) // focus is not on this KeyTable
        {
            return true;
        }
        if (!$(':visible', _nBody).length) {
            //_log( "Not visible for #" + $(_nBody).closest('[id]').attr('id'));
            return true;
        }

        if (_that.isActionableMode()) {
             fnPerformActionableMode(e);
        } else if(_that.isNavigationMode()){
             fnPerformNavigationalMode(e);
        }
    }

    function _fnGetNextEditablePos(){
        var arr = _actionablePositionsEveryRow[_iOldY];
        var arrLen = arr.length;
        var mapLength = Object.keys(_actionablePositionsEveryRow).length;
        var x = jQuery.inArray(_iOldX,arr);
        var y = _iOldY;
        if(!( x < (arrLen - 1)))  {
            do {
                y = y + 1;
                if(y == mapLength)  {
                    y = 0;
                }
                arr = _actionablePositionsEveryRow[y];
                arrLen = arr.length;
                x = arr[0];
            }   while(arrLen === 0)
        } else {
            x = arr[x+1];
        }
        _columnsActionableMode = arr;
        return [x, y];
    }

    function _fnGetPreviousEditablePos(){
        var arr = _actionablePositionsEveryRow[_iOldY];
        var arrLen = arr.length;
        var mapLength = Object.keys(_actionablePositionsEveryRow).length;
        var x = jQuery.inArray(_iOldX,arr);
        var y = _iOldY;
        if( x === 0)  {
            do {
                y = y - 1;
                if(y < 0)  {
                    y = mapLength - 1;
                }
                arr = _actionablePositionsEveryRow[y];
                arrLen = arr.length - 1;
                x = arr[arrLen];
            }   while(arrLen === 0)
        } else {
            x = arr[x - 1];
        }
        _columnsActionableMode = arr;
        return [x, y];
    }


    function _fnSetEnabledColumns(enableColumns)   {
        _enabledColumnsForNavigation = enableColumns;
    }
    /*
     * Function: _fnCaptureKeys
     * Purpose:  Start capturing key events for this table
     * Returns:  -
     * Inputs:   -
     */
    function _fnCaptureKeys( )
    {
        _log('capture keys. #' + $(_nBody).closest('[id]').attr('id') +  ' already captured=' + _bKeyCapture);
        if ( !_bKeyCapture )
        {
            _bKeyCapture = true;
        }
    }


    /*
     * Function: _fnReleaseKeys
     * Purpose:  Stop capturing key events for this table
     * Returns:  -
     * Inputs:   -
     */
    function _fnReleaseKeys( )
    {
        _log('  release keys.  already captured=' + _bKeyCapture);
        _bKeyCapture = false;
    }



    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Support functions
     */

    /*
     * Function: _fnCellFromCoords
     * Purpose:  Calulate the target TD cell from x and y coordinates
     * Returns:  node: - TD target
     * Inputs:   int:x - x coordinate
     *           int:y - y coordinate
     */
    function _fnCellFromCoords( x, y )
    {
        if ( _oDatatable )
        {
            var oSettings = _oDatatable.fnSettings();
            if ( typeof oSettings.aoData[ oSettings.aiDisplay[ y ] ] != 'undefined' )
            {
                return oSettings.aoData[ oSettings.aiDisplay[ y ] ].nTr.getElementsByTagName('td')[x];
            }
            else
            {
                return null;
            }
        }
        else
        {
            return jQuery('tr:eq('+y+')>td:eq('+x+')', _nBody )[0];
        }
    }


    /*
     * Function: _fnCoordsFromCell
     * Purpose:  Calculate the x and y position in a table from a TD cell
     * Returns:  array[2] int: [x, y]
     * Inputs:   node:n - TD cell of interest
     * Notes:    Not actually interested in this for DataTables since it might go out of date
     */
    function _fnCoordsFromCell( n )
    {
        if ( _oDatatable )
        {
            var oSettings = _oDatatable.fnSettings();
            return [
                jQuery('td', n.parentNode).index(n),
                    jQuery('tr', n.parentNode.parentNode).index(n.parentNode) + oSettings._iDisplayStart
            ];
        }
        else
        {
            return [
                jQuery('td', n.parentNode).index(n),
                jQuery('tr', n.parentNode.parentNode).index(n.parentNode)
            ];
        }
    }


    /*
     * Function: _fnSetScrollTop
     * Purpose:  Set the vertical scrolling position
     * Returns:  -
     * Inputs:   int:iPos - scrolltop
     * Notes:    This is so nasty, but without browser detection you can't tell which you should set
     *           So on browsers that support both, the scroll top will be set twice. I can live with
     *           that :-)
     */
    function _fnSetScrollTop( iPos )
    {
        document.documentElement.scrollTop = iPos;
        document.body.scrollTop = iPos;
    }


    /*
     * Function: _fnSetScrollLeft
     * Purpose:  Set the horizontal scrolling position
     * Returns:  -
     * Inputs:   int:iPos - scrollleft
     */
    function _fnSetScrollLeft( iPos )
    {
        document.documentElement.scrollLeft = iPos;
        document.body.scrollLeft = iPos;
    }


    /*
     * Function: _fnGetPos
     * Purpose:  Get the position of an object on the rendered page
     * Returns:  array[2] int: [left, right]
     * Inputs:   node:obj - element of interest
     */
    function _fnGetPos ( obj )
    {
        var iLeft = 0;
        var iTop = 0;

        if (obj.offsetParent) //KB:remove these 5 lines - just the while loop is sufficient, and safer
        {
            iLeft = obj.offsetLeft;
            iTop = obj.offsetTop;
            obj = obj.offsetParent;
            while (obj)
            {
                iLeft += obj.offsetLeft;
                iTop += obj.offsetTop;
                obj = obj.offsetParent;
            }
        }
        return [iLeft,iTop];
    }


    /*
     * Function: _fnFindDtCell
     * Purpose:  Get the coords. of a cell from the DataTables internal information
     * Returns:  array[2] int: [x, y] coords. or null if not found
     * Inputs:   node:nTarget - the node of interest
     */
    function _fnFindDtCell( nTarget )
    {
        var oSettings = _oDatatable.fnSettings();
        for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
        {
            var nTr = oSettings.aoData[ oSettings.aiDisplay[i] ].nTr;
            var nTds = nTr.getElementsByTagName('td');
            for ( var j=0, jLen=nTds.length ; j<jLen ; j++ )
            {
                if ( nTds[j] == nTarget )
                {
                    return [ j, i ];
                }
            }
        }
        return null;
    }


    /*
     * Function: _fnReleaseFocus
     * Purpose: Release table focus when click or focus outside the table
     * Returns: -
     * Inputs: -
     */
    function _fnReleaseFocus(e) {
        var nTarget = e.target;
        var bTableClick = false;
        if(_that.isOutOfFocusMode())
            return ;
        if($(nTarget).parents('.keytable-popup').length) bTableClick = true;
        else    {
            bTableClick = _fnCheckTargetExistsInGrid(nTarget);
        }
        if ( !bTableClick )
        {
            _fnBlur();
        }
    }

    function _fnCheckTargetExistsInGrid(nTarget){
        var bTableClick = false;
        while ( nTarget )
        {
            if ( nTarget == oInit.table )
            {
                bTableClick = true;
                break;
            }
            nTarget = nTarget.parentNode;
        }
        return bTableClick;
    }

    /*
     * Function: _fnInitScanForActionableCells
     * Purpose: Scans for actionable cells in the grid and prepares the navigational path for every row during actionable mode.
     * Returns: -
     * Inputs: -
     */
    function _fnInitScanForActionableCells(){
        var tdArray;
        var trArray = $(_nBody);
        var editableComponentExists;
        var trIndex;
        $('tr',trArray).each(function()              {
            trIndex = $(this).index();
            tdArray = new Array();
            $(_ACTIONABLE_COMPONENTS_CONSTANT, this).each(function() {
                $(this).each(function(){
                    tdArray.push($(this).parent().parent().children().index($(this).parent()));
                });
            });
            _actionablePositionsEveryRow[trIndex] = tdArray;
        });
    }

    /*
     * Function: _fnInitFocusableCellsInGrid
     * Purpose: Scans for grid and prepares the navigational path for every row during navigational mode.
     * Returns: -
     * Inputs: -
     */
    function _fnInitFocusableCellsInGrid(){
        if( !_columnsNavigationMode ) {
            var rows = _nBody.getElementsByTagName('tr');
            var rowLength = rows.length;
            var colLength = 0;
            if(rowLength > 0 ) {
                colLength = rows[0].getElementsByTagName('td').length;
                _columnsNavigationMode = Array.apply(null, {length:colLength}).map(Number.call, Number);
            }
        }
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Initialisation
     */

    /*
     * Function: _fnInit
     * Purpose:  Initialise the KeyTable
     * Returns:  -
     * Inputs:   object:oInit - optional - Initalisation object with the following parameters:
     *   array[2] int:focus - x and y coordinates of the initial target
     *     or
     *     node:focus - the node to set initial focus on
     *   node:table - the table to use, if not given, first table with class 'KeyTable' will be used
     *   string:focusClass - focusing class to give to table elements
     *           object:that - focus
     *   bool:initScroll - scroll the view port on load, default true
     *   int:tabIndex - the tab index to give the hidden input element
     */
    function _fnInit( oInit, that )
    {
        /* Save scope */
        _that = that;

        /* Cache the tbody node of interest */
        _nBody = oInit.table.getElementsByTagName('tbody')[0];

        $(oInit.table).addClass('KeyTable');

        if ( typeof oInit.datatable != 'undefined' ) {
            _oDatatable = oInit.datatable;
        }
        _fnSetGridOutOfFocusMode();
        _fnInitScanForActionableCells();
        _fnInitFocusableCellsInGrid();

        _iDefaultX = 0;
        _iDefaultY = 0;

        //set the tabindex to the first cell of the grid
        jQuery(_fnCellFromCoords(_iDefaultX,_iDefaultY)).attr('tabindex','0');

        /*
         * Add event listeners
         * Well - I hate myself for doing this, but it would appear that key events in browsers are
         * a complete mess, particulay when you consider arrow keys, which of course are one of the
         * main areas of interest here. So basically for arrow keys, there is no keypress event in
         * Safari and IE, while there is in Firefox and Opera. But Firefox and Opera don't repeat the
         * keydown event for an arrow key. OUCH. See the following two articles for more:
         *   http://www.quirksmode.org/dom/events/keys.html
         *   https://lists.webkit.org/pipermail/webkit-dev/2007-December/002992.html
         *   http://unixpapa.com/js/key.html
         * PPK considers the IE / Safari method correct (good enough for me!) so we (urgh) detect
         * Mozilla and Opera and apply keypress for them, while everything else gets keydown. If
         * Mozilla or Opera change their implemention in future, this will need to be updated...
         * although at the time of writing (14th March 2009) Minefield still uses the 3.0 behaviour.
         */
        if ( jQuery.browser.mozilla || jQuery.browser.opera )
        {
            jQuery(document).bind( "keypress", _fnKey );
        }
        else
        {
            jQuery(document).bind( "keydown", _fnKey );
        }


        if ( _oDatatable )
        {
            jQuery('tbody td', _oDatatable.fnSettings().nTable).on( 'click', _fnClick );
        }
        else
        {
            jQuery(_ACTIONABLE_COMPONENTS_TO_SET_FOCUS, _nBody).on('focus', _fnPerformFocusOnComponent );
            jQuery(_ACTIONABLE_COMPONENTS_TO_SET_FOCUS, _nBody).on('click', _fnDummyClickEventOnComponent);
            jQuery('td', _nBody).on('click', _fnClick );
        }

        $("td").focus(function(e){
            if(!isFocusOnTheGrid() && _that.isOutOfFocusMode())   {
                console.log(e.target,' executing td focus   '+ e.type);
                _fnSetGridNavigationMode();
            }
        });

        /* Lose table focus when click outside the table */
        document.addEventListener('click', _fnReleaseFocus,true );
    }

    function _fnDummyClickEventOnComponent(e){
        e.stopPropagation();
        e.preventDefault();
    }

    function _fnPerformFocusOnComponent(e)  {
        var nTarget = _fnGetCellForSelectedComponent(this);
        var prevTarget = _fnCellFromCoords(_iOldX,_iOldY);
        if (prevTarget!=nTarget)    {
            _fnSetGridActionableMode(nTarget,e);
            e.stopPropagation();
            e.preventDefault();
        }
    }

    this.fnCoordsFromCell = _fnCoordsFromCell; // expose, at least for debugging

    this.setNavigationMode = function(){
        _fnSetGridMode(_MODE.NAVIGATION);
    };

    this.setActionableMode = function(){
        _fnSetGridMode(_MODE.ACTIONABLE);
    };

    this.isNavigationMode = function(){
        return (_that.gridCurrentMode === _MODE.NAVIGATION);
    };

    this.isActionableMode = function(){
        return (_that.gridCurrentMode === _MODE.ACTIONABLE);
    };

    this.isOutOfFocusMode = function(){
        return (_that.gridCurrentMode === _MODE.OUTOFFOCUS);
    };
    /* Initialise our new object */
    _fnInit( oInit, this );
}

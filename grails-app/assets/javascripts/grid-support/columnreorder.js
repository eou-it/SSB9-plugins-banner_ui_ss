/* Copyright 2013 Ellucian Company L.P. and its affiliates. */

;(function ( window, $, _ ) {

  var info = void 0; // holder for data while a column is being moved
  var dragTreshold = 100; // treshold for column move intention detection

  function start( event ) {
    var th       = event.target.nodeName === 'TH' ? $( event.target ) : $( event.target ).closest( 'th' );
    var idx      = th.index();
    var table    = th.closest( 'table' );
    var position = th.position();
    var el       = $( '<table class="grid ui-widget ui-widget-content"><thead><tr></tr></thead><tbody></tbody></table>' );

    if ( idx === -1 ) return;

    info = {
      moving:    false,
      el:        el,
      columnIdx: idx,
      table:     table,
      initialX:  event.pageX,
      initialY:  event.pageY
    };

    var cutoff  = 5;
    var rows    = $( 'tbody tr td:nth-child(' + ( idx + 1 ) + ')', table );

    var tr = _.map( _.first( rows, cutoff ), function( it, idx ) {
      return $( '<tr></tr>' ).append( $( $( it ).clone() ) )[0];
    });

    if ( rows.length > cutoff ) {
      tr.push( $( '<tr></tr>' ).append( '<td><span>...</span></td>' )[0] );
    }

    $( 'thead tr', el ).append( $( th.clone() ) );
    $( 'tbody', el ).append( tr );

    el.css({
      'position': 'absolute',
      'left':     position.left + 'px',
      'top':      position.top  + 'px',
      'width':    th.width()    + 'px',
      'opacity':  0.7,
      'zIndex':   50000
    });

    // Capture mousemove events on the page for improved user experience
    // and mouseup events only on the table elements
    $( document ).on( 'mousemove', move );
    $( document ).on( 'mouseup',   end  );

    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  function move( event ) {
    var dx = info.initialX - event.pageX;
    var dy = info.initialY - event.pageY;

    if ( !info.moving && dx * dx + dy * dy > dragTreshold ) {
      $( 'body' ).prepend( info.el );
      info.moving = true;
    }

    // support edge detection and auto-scrolling if this is a horizontally scrolling grid
    var par = info.table.parent();
    var leftBound, rightBound, boundaryEase;

    if ( par.hasClass( 'grid-scroll-x' ) ) {
      leftBound  = Math.floor( par.position().left );
      rightBound = Math.floor( par.width() + leftBound );

      boundaryEase = 40;

      function near( it, that ) {
        return it <= that + boundaryEase;
      }

      function far( it, that ) {
        return it >= that - boundaryEase;
      }

      if ( par.scrollLeft() > 0 && near( event.pageX, leftBound ) ) {
        par.scrollLeft( par.scrollLeft() - 10 );
      }
      else if ( far( event.pageX, rightBound ) ) {
        par.scrollLeft( par.scrollLeft() + 10 );
      }
    }

    // Move the column element with the mouse coordinates
    var width  = Math.floor( $( info.el ).width()  / 2 );
    var height = Math.floor( $( 'th:eq(1)', info.table ).height()  / 2 );

    info.el.css({
      'top':  ( event.pageY - height ) + "px",
      'left': ( event.pageX - width )  + "px"
    });

    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  function end( event ) {
    $( document ).off( 'mousemove', move );
    $( document ).off( 'mouseup',   end  );

    if ( !info.moving )
      return;

    info.el.remove();

    var dropEl = document.elementFromPoint( event.pageX, event.pageY );

    // stop action if the drop target is not within the table
    if ( $( dropEl ).closest( info.table ).length <= 0 )
      return;

    var targetCol = $( dropEl ).closest( 'th, td' ).index();

    if ( targetCol != -1 && targetCol != info.columnIdx )
      swap( info.table, info.columnIdx, targetCol );

    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  // Swap the location of the source column based on column indexes
  function swap( table, from, to ) {
    _.each( table[0].rows, function( it, idx ) {
      var x = it.removeChild( it.cells[ from ] );

      if ( to < it.cells.length )
        it.insertBefore( x, it.cells[ to ] );
      else
        it.appendChild( x );
    });
  }

  window.setupColumnReordering = function( table ) {
    $( 'th', table ).on( 'mousedown', start );
  };
}).call( null, window, $, _ );

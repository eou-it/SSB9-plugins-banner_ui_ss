function sortAndPaginate ( data, max, offset, sortColumn, sortDirection )  {
    max    = _.isNumber( max ) ? max : parseInt( max );
    offset = _.isNumber( offset ) ? offset: parseInt( offset );

    var resolveProperty = function ( obj, property ) {
      property = property.split( '.' );

      while( obj && property[ 0 ] )
          obj = obj[ property.shift() ] || undefined;

      return obj;
    };

    var sorted = _.sortBy( data, function( it ) {
        return resolveProperty( it, sortColumn ).toLowerCase();
    } );

    if (sortDirection == "desc")
       sorted = sorted.reverse();

    var results = {
        data:        sorted.slice( offset, Math.min( offset + max, data.length ) ),
        success:     true,
        totalCount:  data.length,
        pageOffset:  offset,
        pageMaxSize: max
    };

    return results;
}

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
    <head>
        <meta name="layout" content="jasmine"/>
        <meta name="menuEndPoint" content="/TestBannerUiSs/ssb/menu"/>
        <meta name="menuBaseURL" content="/TestBannerUiSs/ssb"/>

        <title>Backbone.PagedCollection Jasmine SPEC</title>

        <r:script>
            var endpoint = '${request.contextPath}/ssb/resource/demoPerson';

            describe( "Backbone.PagedCollection tests", function () {
                var ajaxManager = new AjaxManager(),
                    PersonModel = Backbone.Model.extend({ });

                var PersonCollection = Backbone.PagedCollection.extend({
                    model:         PersonModel,
                    url:           endpoint,
                    batch:         true,
                    pageMaxSize:   5,
                    sortColumn:    "lastName",
                    sortDirection: "asc",
                    ajaxCallback:  function( params ) {
                        return ajaxManager.create( "BioDem", { abortOld: true } ).add( params );
                    }
                });

                var personCollection = new PersonCollection;

                beforeEach( function () {
                    while( personCollection.length > 0 ) {
                        personCollection.pop();
                    }
                });

                it( "validate init settings", function () {
                    expect( personCollection ).not.toBeNull();
                    expect( personCollection.url ).toEqual( endpoint );
                    expect( personCollection.sortColumn ).toEqual( "lastName" );
                    expect( personCollection.sortDirection ).toEqual( "asc" );
                    expect( personCollection.length ).toEqual( 0 );
                    expect( personCollection.paginate ).toBeTruthy();
                    expect( personCollection.page ).toEqual( 1 );
                    expect( personCollection.pageMaxSize ).toEqual( 5 );
                    expect( personCollection.totalCount ).toEqual( 0 );
                });

                it( "initial fetch", function () {

                    personCollection.fetch();

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        expect( personCollection.length ).toEqual( 5 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                    });
                });

                it( "execute nextPage()", function () {

                    personCollection.nextPage();

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        var info = personCollection.pageInfo();

                        expect( personCollection.length ).toEqual( 5 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                        expect( personCollection.page ).toEqual( 2 );

                        expect( info ).not.toBeNull();
                        expect( info.totalCount ).toEqual( 200 );
                        expect( info.pageMaxSize ).toEqual( 5 );
                        expect( info.pages ).toEqual( 40 );
                        expect( info.page ).toEqual( 2 );
                        expect( info.prev ).toEqual( 1 );
                        expect( info.next ).toEqual( 3 );
                        expect( info.pageRanges.length ).toEqual( 40 );
                        expect( info.range.length ).toEqual( 2 );
                        expect( info.range[0] ).toEqual( 6 );
                        expect( info.range[1] ).toEqual( 10 );
                    });
                });

                it( "execute previousPage()", function () {

                    personCollection.previousPage();

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        var info = personCollection.pageInfo();

                        expect( personCollection.length ).toEqual( 5 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                        expect( personCollection.page ).toEqual( 1 );

                        expect( info ).not.toBeNull();
                        expect( info.totalCount ).toEqual( 200 );
                        expect( info.pageMaxSize ).toEqual( 5 );
                        expect( info.pages ).toEqual( 40 );
                        expect( info.page ).toEqual( 1 );
                        expect( info.prev ).toBeFalsy();
                        expect( info.next ).toEqual( 2 );
                        expect( info.pageRanges.length ).toEqual( 40 );
                        expect( info.range.length ).toEqual( 2 );
                        expect( info.range[0] ).toEqual( 1 );
                        expect( info.range[1] ).toEqual( 5 );
                    });
                });

                it( "execute lastPage()", function () {

                    personCollection.lastPage();

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        var info = personCollection.pageInfo();

                        expect( personCollection.length ).toEqual( 5 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                        expect( personCollection.page ).toEqual( 40 );

                        expect( info ).not.toBeNull();
                        expect( info.totalCount ).toEqual( 200 );
                        expect( info.pageMaxSize ).toEqual( 5 );
                        expect( info.pages ).toEqual( 40 );
                        expect( info.page ).toEqual( 40 );
                        expect( info.prev ).toEqual( 39 );
                        expect( info.next ).toBeFalsy();
                        expect( info.pageRanges.length ).toEqual( 40 );
                        expect( info.range.length ).toEqual( 2 );
                        expect( info.range[0] ).toEqual( 196 );
                        expect( info.range[1] ).toEqual( 200 );
                    });
                });

                it( "execute firstPage()", function () {

                    personCollection.firstPage();

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        var info = personCollection.pageInfo();

                        expect( personCollection.length ).toEqual( 5 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                        expect( personCollection.page ).toEqual( 1 );

                        expect( info ).not.toBeNull();
                        expect( info.totalCount ).toEqual( 200 );
                        expect( info.pageMaxSize ).toEqual( 5 );
                        expect( info.pages ).toEqual( 40 );
                        expect( info.page ).toEqual( 1 );
                        expect( info.prev ).toBeFalsy();
                        expect( info.next ).toEqual( 2 );
                        expect( info.pageRanges.length ).toEqual( 40 );
                        expect( info.range.length ).toEqual( 2 );
                        expect( info.range[0] ).toEqual( 1 );
                        expect( info.range[1] ).toEqual( 5 );
                    });
                });

                it( "execute goToPage()", function () {

                    personCollection.goToPage( 23 );

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        var info = personCollection.pageInfo();

                        expect( personCollection.length ).toEqual( 5 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                        expect( personCollection.page ).toEqual( 23 );

                        expect( info ).not.toBeNull();
                        expect( info.totalCount ).toEqual( 200 );
                        expect( info.pageMaxSize ).toEqual( 5 );
                        expect( info.pages ).toEqual( 40 );
                        expect( info.page ).toEqual( 23 );
                        expect( info.prev ).toEqual( 22 );
                        expect( info.next ).toEqual( 24 );
                        expect( info.pageRanges.length ).toEqual( 40 );
                        expect( info.range.length ).toEqual( 2 );
                        expect( info.range[0] ).toEqual( 111 );
                        expect( info.range[1] ).toEqual( 115 );
                    });
                });

                it( "execute goToPage( with invalid page number (< 1) )", function () {
                    expect( personCollection.page ).toEqual( 23 );
                    expect( personCollection.goToPage( -1 ) ).toBeFalsy();
                });

                it( "execute goToPage( with invalid page number (larger then max page) )", function () {
                    expect( personCollection.page ).toEqual( 23 );
                    expect( personCollection.goToPage( 999 ) ).toBeFalsy();
                });

                it( "execute goToPage( with invalid page number (no param) )", function () {
                    expect( personCollection.page ).toEqual( 23 );
                    expect( personCollection.goToPage( ) ).toBeFalsy();
                });

                it( "execute goToPage( with invalid page number (a string) )", function () {
                    expect( personCollection.page ).toEqual( 23 );
                    expect( personCollection.goToPage( "10" ) ).toBeFalsy();
                });

                it( "execute goToPage( with invalid page number (current page) )", function () {
                    expect( personCollection.page ).toEqual( 23 );
                    expect( personCollection.goToPage( 23 ) ).toBeFalsy();
                });

                it( "execute setPageSize( 50 )", function () {

                    personCollection.setPageSize( 50 );

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        var info = personCollection.pageInfo();

                        expect( personCollection.length ).toEqual( 50 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                        expect( personCollection.page ).toEqual( 4 );

                        expect( info ).not.toBeNull();
                        expect( info.totalCount ).toEqual( 200 );
                        expect( info.pageMaxSize ).toEqual( 50 );
                        expect( info.pages ).toEqual( 4 );
                        expect( info.page ).toEqual( 4 );
                        expect( info.prev ).toEqual( 3 );
                        expect( info.next ).toBeFalsy();
                        expect( info.pageRanges.length ).toEqual( 4 );
                        expect( info.range.length ).toEqual( 2 );
                        expect( info.range[0] ).toEqual( 151 );
                        expect( info.range[1] ).toEqual( 200 );
                    });
                });

                it( "execute setPageSize( with invalid page number (a string) )", function () {
                    expect( personCollection.page ).toEqual( 4 );
                    expect( personCollection.setPageSize( "15" ) ).toBeFalsy();
                });

                it( "execute pageInfo( )", function () {

                    personCollection.goToPage( 1 );

                    waitsFor( function () {
                        return personCollection.length > 0;
                    }, 'waiting on service fetch');

                    runs( function () {
                        var info = personCollection.pageInfo();

                        expect( personCollection.length ).toEqual( 50 );
                        expect( personCollection.totalCount ).toEqual( 200 );
                        expect( personCollection.page ).toEqual( 1 );

                        expect( info ).not.toBeNull();
                        expect( info.totalCount ).toEqual( 200 );
                        expect( info.pageMaxSize ).toEqual( 50 );
                        expect( info.pages ).toEqual( 4 );
                        expect( info.page ).toEqual( 1 );
                        expect( info.prev ).toBeFalsy();
                        expect( info.next ).toEqual( 2 );
                        expect( info.pageRanges.length ).toEqual( 4 );
                        expect( info.range.length ).toEqual( 2 );
                        expect( info.range[0] ).toEqual( 1 );
                        expect( info.range[1] ).toEqual( 50 );
                    });
                });
            });
        </r:script>
    </head>
    <body></body>
</html>
/** *****************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.common

import grails.test.GrailsUnitTestCase

class RtlCssGeneratorTests extends GrailsUnitTestCase {
    def rtlCssGenerator = new RtlCssGenerator()

    def commentWithBrace = '/* { */'
    def css = '.class { border-left:1px; }'
    def rtl = css.replaceAll( 'left', 'right' );

    def ws( text ) {
        return text.replaceAll( /\s+/, ' ' )
    }

    def transform( text ) {
        return ws( rtlCssGenerator.transformCss( text ))
    }

    void 'test convert border-left'() {
        assertEquals rtl, transform( css )
    }

    void testCommentsWithCurlyBraces() {
        assertEquals '', transform( commentWithBrace )
    }

    void 'test comments with curly braces inside text'() {
        assertEquals rtl + rtl, transform( css + commentWithBrace + css)
    }

    void 'test comment without braces'() {
        def commentWithoutBrace = '/* | */'
        assertEquals '', transform( commentWithoutBrace )
    }

    void 'test comments within css properties'() {
        def commentsInProperties = '.class { color:blue;/*{identifier}*/ background:none;\n}'
        def desiredCss = '.class { color:blue; background:none; }'
        assertEquals desiredCss, transform( commentsInProperties )
    }

    void 'test comments before and after blocks'() {
        def inputCss = '/* Beginning comment */.class { color:blue; }/* Ending comment */'
        def desiredCss = '/* Beginning comment */.class { color:blue; }'
        assertEquals desiredCss, transform( inputCss )
    }

    void 'test comments with braces before and after blocks'() {
        def inputCss = '/* Beginning } comment */.class { color:blue; }/* Ending { comment */'
        def desiredCss = '.class { color:blue; }'
        assertEquals desiredCss, transform( inputCss )
    }
}

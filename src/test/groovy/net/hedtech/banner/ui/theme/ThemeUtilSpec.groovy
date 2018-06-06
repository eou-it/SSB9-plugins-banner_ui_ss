/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.ui.theme


import spock.lang.Specification
import spock.lang.Unroll


class ThemeUtilSpec extends Specification {
    @Unroll
    def "test sanitizeName ()"() {
        expect:
        System.out.println(name + badRegex + ThemeUtil.sanitizeName(name).matches( ".*[${badRegex}].*" ))
        !ThemeUtil.sanitizeName(name).matches( ".*[${badRegex}].*" )

        where:
        name << [
            "asdf",
            "zxcv",
            "asdf/../zxcv",
            "asdf*zxcv",
            "asdf<script>alert('uh-oh')</script>"
        ]
        badRegex = ".*[<\\()./*>]"
   }

}
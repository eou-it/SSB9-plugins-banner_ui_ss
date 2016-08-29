// Copyright 2013-2016 Ellucian Company L.P. and its affiliates.
package net.hedtech.banner.ui

class AnalyticsTagLib {
    def analytics = { attrs, body ->
        def text
        def trackingId
        //check if the tracking id with ellucian or with client
        trackingId = checkTrackingId(attrs);
        if (trackingId != "") {
            text = "<script>\n" +
                    "\n" +
                    "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n" +
                    "                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n" +
                    "                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n" +
                    "            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n" +
                    "\n" +
                    "            ga('create', '" +
                    trackingId + "', 'auto');\n" +
                    "            ga('send', 'pageview');\n" +
                    "           /* ga('send', 'event', {\n" +
                    "                eventCategory: 'Outbound Link',\n" +
                    "                eventAction: 'click',\n" +
                    "                eventLabel: event.target.href,\n" +
                    "                transport: 'beacon'\n" +
                    "            });\n" +
                    "*/\n" +
                    "</script>"


            out << text
        } else
            out << ""

    }

    public def checkTrackingId(attrs) {
        if (attrs.allowEllucianTracker && attrs.ellucianTrackerId) {
            return attrs.ellucianTrackerId;
        } else if (attrs.clientTrackerId) {

            return attrs.clientTrackerId;
        } else {
            return "";
        }
    }
}

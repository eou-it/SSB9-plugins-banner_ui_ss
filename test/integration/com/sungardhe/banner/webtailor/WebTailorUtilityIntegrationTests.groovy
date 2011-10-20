/** *****************************************************************************
 � 2010 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
package com.sungardhe.banner.webtailor

import com.sungardhe.banner.testing.BaseIntegrationTestCase

/**
 * This is a helper class that is used to access Web Tailor
 *
 */


class WebTailorUtilityIntegrationTests extends BaseIntegrationTestCase {

    protected void setUp() {
        formContext = ['SFAALST']
        super.setUp()
    }


    def testGetInfoText() {
        
        def infoText = WebTailorUtility.getInfoText('twbkwbis.P_ValLogin', 'WELCOME')
        assertTrue infoText.contains('Welcome')
        
    }

}
<?xml version="1.0" encoding="UTF-8"?>
<!--
/** *****************************************************************************

 2010 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
 
 NOTICE:  This pom file is currently used as the maven-publisher is not picking 
          up the correct groupId from the *Plugin file. When this is corrected, 
          this pom will be removed (as it will be auto-generated).
-->
<project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.sungardhe</groupId>
  <artifactId>banner-ui-ss</artifactId>
  <version>0.0.77</version>
  <packaging>zip</packaging>
  <description>A Grails Plugin providing core and UI framework for Banner Self Service</description>
  <distributionManagement>
    <snapshotRepository>
      <id>snapshots</id>
      <name>SunGardHE Internal Repository for Application/Plugin Snapshots</name>
      <url>http://m038083:8081/nexus/content/repositories/snapshots/</url>
    </snapshotRepository>
    <repository>
      <id>releases</id>
      <name>SunGardHE Internal Repository for Application Releases</name>
      <url>http://m038083:8081/nexus/content/repositories/releases/</url>
    </repository>
  </distributionManagement>
</project>

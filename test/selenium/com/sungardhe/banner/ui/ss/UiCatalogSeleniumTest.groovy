/*********************************************************************************
 Copyright 2009-2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/
package com.sungardhe.banner.ui.ss

import com.thoughtworks.selenium.*
import grails.plugins.selenium.SeleniumAware

@Mixin(SeleniumAware)
class UiCatalogSeleniumTest extends SeleneseTestCase  {

    @Override
    void setUp() throws Exception {
          selenium = new DefaultSelenium("localhost",4444,'*firefox',"http://localhost:8080/")  {
              public void open(String url) {
                  commandProcessor.doCommand("open",url,"true")
              }
          }
          selenium.start();
    }

    void testPressButtons() throws Exception {
        selenium.open("/banner_ss_poc/uiCatalog")
        verifyEquals("50", selenium.getAttribute("css=.progress-bar@aria-valuenow"))
        verifyEquals("progressbar", selenium.getAttribute("css=.progress-bar@role"))
        selenium.click("css=button.button-two")
        verifyEquals("66", selenium.getAttribute("css=.progress-bar@aria-valuenow"))
        verifyEquals("Button Two", selenium.getText("css=.button-result"))
        selenium.click("css=button.button-one")
        verifyEquals("33", selenium.getAttribute("css=.progress-bar@aria-valuenow"))
        verifyEquals("Button One", selenium.getText("css=.button-result"))
        verifyTrue(selenium.isTextPresent("tab one is for HTML5 specific widgets "))
        selenium.click("demoTabTwo")
        verifyTrue(selenium.isTextPresent("tab two is for non-HTML5 specific widgets "))

        selenium.click("css=span.number")
        selenium.type("value", "3433232")
        selenium.focus("value")
        selenium.keyDown("value", "\\13")
//        verifyEquals("3433232", selenium.getText("css=span.number"))

        selenium.click("demoTabOne")
        verifyTrue(selenium.isTextPresent("tab one is for HTML5 specific widgets "))
    }
    
    void testDatatables() throws Exception {
        selenium.open("/banner_ss_poc/uiCatalog")
        verifyEquals("Archer", selenium.getText("css=td.sorting_1"))
        selenium.click("css=div.DataTables_sort_wrapper")
        verifyEquals("Tyson", selenium.getText("css=td.sorting_1"))
        verifyEquals("Shaquill.Silver@horizoncollege.edu", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[3]/td[6]"))
        verifyEquals("051691", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[4]/td[4]"))
        verifyEquals("A0000014", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[5]/td[3]"))
        selenium.click("demoPersonTable_first")
        verifyEquals("Tyson", selenium.getText("css=td.sorting_1"))
        selenium.click("css=#banner-id-col > div.DataTables_sort_wrapper")
        verifyEquals("A0000000", selenium.getText("css=td.sorting_1"))
        selenium.click("css=#banner-id-col > div.DataTables_sort_wrapper")
        verifyEquals("A0000019", selenium.getText("css=td.sorting_1"))
        selenium.click("css=#email-col > div.DataTables_sort_wrapper")
        verifyEquals("Archer.Apple@horizoncollege.edu", selenium.getText("css=td.sorting_1"))
        selenium.click("css=#email-col > div.DataTables_sort_wrapper")
        verifyEquals("Tyson.Tuesday@horizoncollege.edu", selenium.getText("css=td.sorting_1"))
        selenium.click("css=div.DataTables_sort_wrapper")
        selenium.click("css=div.DataTables_sort_wrapper")
        selenium.click("css=div.DataTables_sort_wrapper")
        selenium.click("css=div.DataTables_sort_wrapper")
        selenium.click("css=div.DataTables_sort_wrapper")
        verifyEquals("Beckham.Luna@horizoncollege.edu", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[2]/td[6]"))
        verifyEquals("020291", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[3]/td[4]"))
        verifyEquals("A0000002", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[5]/td[3]"))
        verifyEquals("2150000004", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[7]/td[5]"))
        verifyEquals("Diesel.October@horizoncollege.edu", selenium.getText("//table[@id='demoPersonTable']/tbody/tr[10]/td[6]"))
        selenium.click("//div[@id='demoPersonTable_paginate']/span[3]/span[2]")
    }
}


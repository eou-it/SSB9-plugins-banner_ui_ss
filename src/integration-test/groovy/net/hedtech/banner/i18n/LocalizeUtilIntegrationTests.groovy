/*******************************************************************************
Copyright 2018 Ellucian Company L.P. and its affiliates.
*******************************************************************************/

package net.hedtech.banner.i18n

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.context.i18n.LocaleContextHolder as LCH
import net.hedtech.banner.exceptions.ApplicationException

import static org.junit.Assert.*

@Integration
@Rollback
class LocalizeUtilIntegrationTests extends BaseIntegrationTestCase {

    def localizeUtil
    private static final String EN = "en"
    private static final String US = "US"
    private static final def TEST_NUMBER = 1234567890
    private static final int YEAR = 117
    private static final int MONTH = 03
    private static final int DAY = 12
    private static final String FORMATTED_NUMBER = "1,234,567,890"

    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        localizeUtil=new LocalizeUtil()
        LCH.setLocale(new Locale(EN, US))
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
    }


    @Test
    void testGetDateFormat() {
        assertEquals("04/12/2017", localizeUtil.formatDate(new Date(YEAR,MONTH,DAY)))
    }


    @Test
    void testGetDateFormatForException() {
        assertEquals(12, localizeUtil.formatDate(12))
    }


    @Test
    void testParseDate() {
        assertEquals(new Date(YEAR,MONTH,DAY), localizeUtil.parseDate("04/12/2017"))
    }


    @Test
    void testParseDateWithParseException() {
        try {
            localizeUtil.parseDate("2017/04/12")
            assertFalse(false)
        } catch(ParseException) {
            assertTrue(true)
        }
    }


    @Test
    void testParseDateWithNoValue() {
        assertEquals("", localizeUtil.parseDate(""))
    }


    @Test
    void testMessageWithNoValue() {
        assertEquals("", localizeUtil.message(""))
    }


    @Test
    void testMessageWithNoLocale() {
        assertEquals("MM/dd/yyyy", localizeUtil.message("default.date.format"))
    }


    @Test
    void testParseNumberWithException() {
        try {
            localizeUtil.parseNumber(TEST_NUMBER)
            assertFalse(false)
        }catch(ApplicationException ae){
            assertTrue(true)
        }
    }


    @Test
    void testParseNumber() {
        assertEquals(TEST_NUMBER, localizeUtil.parseNumber(TEST_NUMBER.toString()))
    }


    @Test
    void testParseNumberWithNoValue() {
       assertEquals("", localizeUtil.parseNumber(""))
    }


    @Test
    void testFormatNumber() {
        assertEquals(FORMATTED_NUMBER, localizeUtil.formatNumber(TEST_NUMBER))
    }


    @Test
    void testFormatNumberWithIllegalArgumentException() {
        assertEquals("testNumber", localizeUtil.formatNumber("testNumber"))
    }
}

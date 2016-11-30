import grails.test.AbstractCliTestCase

class SetupDevTests extends AbstractCliTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testSetupDev() {

        execute(["setup-dev"])

        assertEquals 0, waitForProcess()
        verifyHeader()
    }
}

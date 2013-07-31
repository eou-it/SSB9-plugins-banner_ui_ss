import net.hedtech.banner.loginworkflow.PostLoginWorkflow
import net.hedtech.banner.mep.MultiEntityProcessingService
import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.ApplicationContext
import net.hedtech.banner.loginworkflow.RaceAndEthnicityFlow

import net.hedtech.banner.loginworkflow.UserAgreementFlow
import org.springframework.web.context.request.RequestContextHolder
import net.hedtech.banner.security.FormContext

class BannerSelfServiceFilterFilters {
    def springSecurityService
    UserAgreementFlow userAgreementFlow
    List listOfFlows = []

    def filters = {
        all(controller:  "selfServiceMenu|login|logout|survey", invert: true) {
            before = {
                boolean allDone = request.getSession().getAttribute("ALL_DONE")
                 if(listOfFlows.empty){
                     getListOfFlows()
                 }
                String path = request.request.strippedServletPath
                if(springSecurityService.isLoggedIn() && !allDone && !checkIgnoreUri(path)) {
                    if(path != null) {
                        println "request.request.strippedServletPath " + path
                        request.getSession().setAttribute("URI_ACCESSED", path)

                        setFormContext()

                        for(int i = 0; i < listOfFlows.size(); i++) {
                            if(listOfFlows[i].showPage(request)) {
                                redirect uri: listOfFlows[i].getControllerUri();
                                return false;

                            }
                       }
                       request.getSession().setAttribute("ALL_DONE",true)
                    }
                }
            }
        }
    }

    private setFormContext() {
        def associatedFormsList = []
        associatedFormsList?.add( 0, "SELFSERVICE" )
        FormContext.set( associatedFormsList )
    }

    public boolean checkIgnoreUri(String path) {
        boolean isIgnoredUri = false;

        for (int i = 0 ; i < listOfFlows.size(); i++) {
            if(path?.contains(listOfFlows[i].getControllerUri())) {
                isIgnoredUri = true
                break;
            }
        }
        return isIgnoredUri
    }

    public List getListOfFlows()
    {
        ApplicationContext ctx = (ApplicationContext) ApplicationHolder.getApplication().getMainContext()
        userAgreementFlow = (UserAgreementFlow) ctx.getBean("userAgreementFlow")
        listOfFlows = [userAgreementFlow, RaceAndEthnicityFlow]
        return listOfFlows
    }
}

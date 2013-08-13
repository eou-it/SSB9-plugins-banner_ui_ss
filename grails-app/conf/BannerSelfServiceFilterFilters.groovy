import net.hedtech.banner.loginworkflow.PostLoginWorkflow
import net.hedtech.banner.mep.MultiEntityProcessingService
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.ApplicationContext
import net.hedtech.banner.loginworkflow.SurveyFlow

import net.hedtech.banner.loginworkflow.UserAgreementFlow
import org.springframework.web.context.request.RequestContextHolder
import net.hedtech.banner.security.FormContext

class BannerSelfServiceFilterFilters {
    def springSecurityService
    UserAgreementFlow userAgreementFlow
    SurveyFlow surveyFlow
    List listOfFlows = []
    private final log = Logger.getLogger(getClass())

    def filters = {
        all(controller:  "selfServiceMenu|login|logout|survey|userAgreement|error", invert: true) {
            before = {
                log.info("Inside BannerSelfServiceFilterFilters")
                boolean allDone = request.getSession().getAttribute("ALL_DONE")
                log.info("All Done :" + allDone )
                 if(listOfFlows.empty){
                     getListOfFlows()
                 }
                String path = request.request.strippedServletPath
                if(springSecurityService.isLoggedIn() && !allDone && !checkIgnoreUri(path)) {
                    log.info("Path :" + path )
                    if(path != null) {
                        println "request.request.strippedServletPath " + path
                        request.getSession().setAttribute("URI_ACCESSED", path)

                        setFormContext()
                        log.info("Form Context set")
                        for(int i = 0; i < listOfFlows.size(); i++) {
                            if(listOfFlows[i].showPage(request)) {
								log.info("Redirecting uri :")
                                redirect uri: listOfFlows[i].getControllerUri()
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


    public List getListOfFlows() {
        ApplicationContext ctx = (ApplicationContext) ApplicationHolder.getApplication().getMainContext()
        userAgreementFlow = (UserAgreementFlow) ctx.getBean("userAgreementFlow")
        surveyFlow = (SurveyFlow) ctx.getBean("surveyFlow")
        listOfFlows = [userAgreementFlow, surveyFlow]
        return listOfFlows
    }
}

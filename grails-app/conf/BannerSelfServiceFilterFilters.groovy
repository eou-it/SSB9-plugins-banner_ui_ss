import net.hedtech.banner.loginworkflow.SurveyFlow
import net.hedtech.banner.loginworkflow.UserAgreementFlow
import net.hedtech.banner.security.FormContext
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.ApplicationContext

class BannerSelfServiceFilterFilters {
    def springSecurityService
    UserAgreementFlow userAgreementFlow
    SurveyFlow surveyFlow
    List listOfFlows = []
    private final log = Logger.getLogger(getClass())

    def filters = {
        all(controller:  "selfServiceMenu|login|logout|survey|userAgreement|error", invert: true) {
            before = {
                boolean allDone = request.getSession().getAttribute("ALL_DONE")
                 if(listOfFlows.empty){
                     getListOfFlows()
                 }
                String url = request?.requestURL?.toString()
                if(url?.contains("grails")){
                    url = url.substring(url.indexOf("grails/")+6, url.indexOf(".dispatch"));
                    url = "/ssb" + url
                    if (request?.getQueryString()) {
                        url = url + "?" + request?.getQueryString()
                    }
                }else{
                    url =null
                }
                String path = url
                if(springSecurityService.isLoggedIn() && !allDone && !checkIgnoreUri(path)) {
                    if(path != null) {
                        request.getSession().setAttribute("URI_ACCESSED", path)

                        setFormContext()
                        for(int i = 0; i < listOfFlows.size(); i++) {
                            if(listOfFlows[i].showPage(request)) {
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

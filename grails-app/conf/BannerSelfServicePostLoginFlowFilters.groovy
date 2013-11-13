import net.hedtech.banner.configuration.HttpRequestUtils
import net.hedtech.banner.security.FormContext
import org.apache.log4j.Logger
import net.hedtech.banner.loginworkflow.PostLoginWorkflow
import org.codehaus.groovy.grails.web.servlet.GrailsUrlPathHelper
import javax.servlet.http.HttpSession
import org.codehaus.groovy.grails.commons.ConfigurationHolder as CH

/*******************************************************************************
 Copyright 2009-2012 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
class BannerSelfServicePostLoginFlowFilters {
    private static final String SLASH = "/"
    private static final String QUESTION_MARK = "?"
    def springSecurityService
    private final log = Logger.getLogger(getClass())
    public static final String LAST_FLOW_COMPLETED =  "LAST_FLOW_COMPLETED"
    def filters = {
        all(controller:  "selfServiceMenu|login|logout|error|dateConverter", invert: true) {
            before = {
                if(!isUriPartOfIgnoreUriConfig(request)) {
                    HttpSession session = request.getSession()
                    boolean isAllFlowCompleted = session.getAttribute(PostLoginWorkflow.FLOW_COMPLETE)
                    String path = getServletPath(request)
                    if(springSecurityService.isLoggedIn() &&  path != null && !isAllFlowCompleted ){

                        log.debug "Initializing workflow classes"
                        List<PostLoginWorkflow> listOfFlows = []
                        listOfFlows = PostLoginWorkflow.getListOfFlows()
                        Map<String,Integer> uriMap = initializeUriMap(listOfFlows)

                        def lastFlowCompleted = session.getAttribute(LAST_FLOW_COMPLETED)
                        String uriRedirected = session.getAttribute(PostLoginWorkflow.URI_REDIRECTED)

                        boolean uriHampered = false
                        if(uriRedirected != null){
                            String controllerRedirected = HttpRequestUtils.getControllerNameFromPath(uriRedirected)
                            if(!path.contains(controllerRedirected)){
                                uriHampered = true
                            }
                        }
                        if(shouldVerifyFlowCompleted(lastFlowCompleted, path, uriMap, uriHampered)) {
                            if(lastFlowCompleted == null){
                                lastFlowCompleted = 0
                            }
                            session.setAttribute(PostLoginWorkflow.URI_ACCESSED, path)
                            setFormContext()
                            int noOfFlows = listOfFlows.size()
                            for(int i = lastFlowCompleted; i < noOfFlows; i++) {
                                session.setAttribute(LAST_FLOW_COMPLETED, i)
                                if(listOfFlows[i].isShowPage(request)) {
                                    log.debug "Workflow URI " + listOfFlows[i].getControllerUri()
                                    session.setAttribute(PostLoginWorkflow.URI_REDIRECTED, listOfFlows[i].getControllerUri())
                                    redirect uri: listOfFlows[i].getControllerUri()
                                    return false;
                                }
                           }
                           session.setAttribute(PostLoginWorkflow.FLOW_COMPLETE,true)
                        }
                    }
                }
            }
        }
    }

    private boolean shouldVerifyFlowCompleted(def lastFlowCompleted, String path, HashMap<String, Integer> uriMap ,boolean uriHampered) {
         return  (!isFlowControllerURI(path, uriMap)) || lastFlowCompleted == null || uriHampered
    }

    private boolean isUriPartOfIgnoreUriConfig(request) {
        String path = getServletPath(request)
        def ssLoginWorkflowIgnoreUri = CH.config.ssLoginWorkflowIgnoreUri instanceof List ? CH.config.ssLoginWorkflowIgnoreUri : []
        return ssLoginWorkflowIgnoreUri.any { path =~ it }
    }

    private setFormContext() {
        def associatedFormsList = []
        associatedFormsList?.add( 0, "SELFSERVICE" )
        FormContext.set( associatedFormsList )
    }

    public boolean isFlowControllerURI(String path,Map uriMap) {
        boolean isIgnoredUri = false;
        String controllerName = HttpRequestUtils.getControllerNameFromPath(path)
        if(uriMap.get(controllerName)!=null)
        {
            isIgnoredUri = true
        }
        return isIgnoredUri
    }


    private HashMap<String,Integer> initializeUriMap(List<PostLoginWorkflow> listOfFlows) {
        HashMap<String,Integer> uriMap = new HashMap()
        int noOfFlows = listOfFlows.size()
        for (int i = 0 ; i < noOfFlows; i++) {
            uriMap.put(listOfFlows[i].getControllerName(),i);
        }
        return uriMap
    }

    private getServletPath(request) {
        GrailsUrlPathHelper urlPathHelper = new GrailsUrlPathHelper();
        String path = urlPathHelper.getOriginatingRequestUri(request);
        if (path!=null){
            path = path.substring(request.getContextPath().length())
            if (SLASH.equals(path))
            {
                path = null
            }
            else if (request?.getQueryString()) {
                path = path + QUESTION_MARK + request?.getQueryString()
            }
        }
        return path
    }
}

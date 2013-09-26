import net.hedtech.banner.security.FormContext
import org.apache.log4j.Logger
import net.hedtech.banner.loginworkflow.PostLoginWorkflow
import org.codehaus.groovy.grails.web.servlet.GrailsUrlPathHelper
import javax.servlet.http.HttpSession

/*******************************************************************************
 Copyright 2009-2012 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
class BannerSelfServicePostLoginFlowFilters {
    private static final String SSB_BASE_URL = "ssb"
    private static final String SLASH = "/"
    private static final String QUESTION_MARK = "?"
    def springSecurityService
    List<PostLoginWorkflow> listOfFlows = []
    private final log = Logger.getLogger(getClass())
    public static final String LAST_FLOW_COMPLETED =  "LAST_FLOW_COMPLETED"
    def filters = {
        all(controller:  "selfServiceMenu|login|logout|error|dateConverter", invert: true) {
            before = {
                HttpSession session = request.getSession()
                boolean isflowCompleted = session.getAttribute(PostLoginWorkflow.FLOW_COMPLETE)
                listOfFlows = PostLoginWorkflow.getListOfFlows()
                log.debug "Initializing workflow classes"
                Map<String,Integer> uriMap = initializeUriMap(listOfFlows)
                String path = getServletPath(request)
                def lastFlowCompleted = session.getAttribute(LAST_FLOW_COMPLETED)
                if(verifyFlowCompleted(lastFlowCompleted, path, isflowCompleted, uriMap)) {
                    session.setAttribute(PostLoginWorkflow.URI_ACCESSED, path)
                    setFormContext()
                    int noOfFlows = listOfFlows.size()
                    for(int i = 0; i < noOfFlows; i++) {
                        session.setAttribute(LAST_FLOW_COMPLETED, i)
                        if(listOfFlows[i].isShowPage(request)) {
                            log.debug "Workflow URI " + listOfFlows[i].getControllerUri()
                            redirect uri: listOfFlows[i].getControllerUri()
                            return false;

                        }
                   }
                   session.setAttribute(PostLoginWorkflow.FLOW_COMPLETE,true)
                }else if (null != lastFlowCompleted && checkDisplayPage(path,lastFlowCompleted,uriMap)){
                    if (listOfFlows[lastFlowCompleted].isShowPage(request)){
                        redirect uri: listOfFlows[lastFlowCompleted].getControllerUri()
                        return false
                    }
                }
            }
        }
    }

    private boolean verifyFlowCompleted(def lastFlowCompleted, String path, boolean isflowCompleted, HashMap<String, Integer> uriMap) {
        boolean checkFlow = false
        if (springSecurityService.isLoggedIn() && path != null ){
            checkFlow = lastFlowCompleted==null || (!isflowCompleted && !isFlowControllerURI(path, uriMap))
        }
        return checkFlow
    }

    private setFormContext() {
        def associatedFormsList = []
        associatedFormsList?.add( 0, "SELFSERVICE" )
        FormContext.set( associatedFormsList )
    }

    public boolean isFlowControllerURI(String path,Map uriMap) {
        boolean isIgnoredUri = false;
        String controllerName = getControllerNameFromPath(path)
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

    private String getControllerNameFromPath(String url){
        if (url.contains(SSB_BASE_URL)){
            url = url.substring(url.indexOf(SSB_BASE_URL)+SSB_BASE_URL.length()+1);
            if (url.contains(SLASH)){
                url = url.substring(0,url.indexOf(SLASH))
            }
        }
        return url
    }

    private boolean checkDisplayPage(String path,def lastFlowCompleted,Map uriMap) {
        if(path!=null && null != lastFlowCompleted){
            String controllerName = getControllerNameFromPath(path)
            return springSecurityService.isLoggedIn() && uriMap.containsKey(controllerName) && uriMap.get(controllerName) != 0 && lastFlowCompleted != uriMap.get(controllerName)
        }else{
            return false
        }
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

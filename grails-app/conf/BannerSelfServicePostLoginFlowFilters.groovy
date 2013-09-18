import net.hedtech.banner.security.FormContext
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.ApplicationContext
import net.hedtech.banner.loginworkflow.PostLoginWorkflow

class BannerSelfServicePostLoginFlowFilters {
    def springSecurityService
    List<PostLoginWorkflow> listOfFlows = []
    private final log = Logger.getLogger(getClass())
    static Map uriMap
    def filters = {
        all(controller:  "selfServiceMenu|login|logout|error", invert: true) {
            before = {

                boolean allDone = request.getSession().getAttribute(PostLoginWorkflow.ALL_DONE)

                log.debug "Initializing workflow classes"
                initializeListOfFlows()
                String path = getRequestPath(request)
                def lastVisitedIndex = request.getSession().getAttribute("lastVisitedIndex")
                if(springSecurityService.isLoggedIn() && path != null && !allDone && !checkIgnoreUri(path)) {
                        request.getSession().setAttribute(PostLoginWorkflow.URI_ACCESSED, path)
                        setFormContext()
                        for(int i = 0; i < listOfFlows.size(); i++) {
                            request.getSession().setAttribute("lastVisitedIndex", i)
                            if(listOfFlows[i].showPage(request)) {
                                log.debug "Workflow URI " + listOfFlows[i].getControllerUri()
                                redirect uri: listOfFlows[i].getControllerUri()
                                return false;

                            }
                       }
                       request.getSession().setAttribute(PostLoginWorkflow.ALL_DONE,true)
                }
                else if (checkDisplayPage(request,lastVisitedIndex)){
                    if (listOfFlows[lastVisitedIndex].showPage(request)){
                        redirect uri: listOfFlows[lastVisitedIndex].getControllerUri()
                        return false
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
            if(path?.contains(listOfFlows[i].getControllerName())) {
                isIgnoredUri = true
                break;
            }
        }
        return isIgnoredUri
    }


    private List initializeListOfFlows() {
        if(listOfFlows.isEmpty()){
            ApplicationContext ctx = (ApplicationContext) ApplicationHolder.getApplication().getMainContext()
            List<String> flows = PostLoginWorkflow.getListOfFlows();
            for(String flow : flows) {
                listOfFlows.add(ctx.getBean(flow))
            }
            uriMap = new HashMap()
            for (int i = 0 ; i < listOfFlows.size(); i++) {
                uriMap.put(listOfFlows[i].getControllerName(),i);
            }
            return listOfFlows
        }
    }

    private String getRequestPath(request) {
        String url = request?.requestURL?.toString()
        if(url?.contains("grails")){
            url = getStrippedPath(url)
            url = "/ssb" + url
            if (request?.getQueryString()) {
                url = url + "?" + request?.getQueryString()
            }
        }else{
            url = null
        }
        return url
    }

    private String getControllerNameFromPath(String url){
        url = getStrippedPath(url)
        url =  url.substring(1)
        if (url.contains("/")){
            url = url.substring(0,url.indexOf("/"))
        }
        return url
    }

    private String getStrippedPath(String url) {
        url = url.substring(url.indexOf("grails/") + 6, url.indexOf(".dispatch"))
        return url
    }

    private boolean checkDisplayPage(def request,def lastVisitedIndex ) {
        String url = request?.requestURL?.toString()
        if(url?.contains("grails")){
            String controllerName = getControllerNameFromPath(url)
            return springSecurityService.isLoggedIn() && uriMap.containsKey(controllerName) && uriMap.get(controllerName) != 0 && lastVisitedIndex != uriMap.get(controllerName)
        }else{
            return false
        }
    }
}

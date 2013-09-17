import net.hedtech.banner.security.FormContext
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.ApplicationContext
import net.hedtech.banner.loginworkflow.PostLoginWorkflow

class BannerSelfServicePostLoginFlowFilters {
    def springSecurityService
    List<PostLoginWorkflow> listOfFlows = []
    private final log = Logger.getLogger(getClass())
    static int lastVisitedIndex
    static Map uriMap
    def filters = {
        all(controller:  "selfServiceMenu|login|logout|error", invert: true) {
            before = {

                boolean allDone = request.getSession().getAttribute(PostLoginWorkflow.ALL_DONE)

                log.debug "Initializing workflow classes"
                initializeListOfFlows()
                String path = getRequestPath(request)

                if(springSecurityService.isLoggedIn() && !allDone && !checkIgnoreUri(path)) {
                    if(path != null) {
                        request.getSession().setAttribute(PostLoginWorkflow.URI_ACCESSED, path)

                        setFormContext()

                        for(int i = 0; i < listOfFlows.size(); i++) {
                            lastVisitedIndex = i
                            if(listOfFlows[i].showPage(request)) {
                                log.debug "Workflow URI " + listOfFlows[i].getControllerUri()
                                redirect uri: listOfFlows[i].getControllerUri()
                                return false;

                            }
                       }
                       request.getSession().setAttribute(PostLoginWorkflow.ALL_DONE,true)
                    }
                }
                if (checkDisplayPage(path)){
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
            if(path?.contains(listOfFlows[i].getControllerUri())) {
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
                uriMap.put(listOfFlows[i].getControllerUri(),i);
            }
            return listOfFlows
        }
    }

    private String getRequestPath(request) {
        String url = request?.requestURL?.toString()
        if(url?.contains("grails")){
            url = url.substring(url.indexOf("grails/")+6, url.indexOf(".dispatch"));
            url = "/ssb" + url
            if (request?.getQueryString()) {
                url = url + "?" + request?.getQueryString()
            }
        }else{
            url = null
        }
        return url
    }

    private boolean checkDisplayPage(String path) {
        String accessedPath
        if (path?.contains("?"))
        {
            accessedPath = path.substring(0,path.indexOf("?"))
        }else{
            accessedPath = path
        }
        springSecurityService.isLoggedIn() && uriMap.containsKey(accessedPath) && uriMap.get(accessedPath) != 0 && lastVisitedIndex != uriMap.get(accessedPath)
    }
}

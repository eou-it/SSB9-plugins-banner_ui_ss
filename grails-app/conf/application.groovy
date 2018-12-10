/*******************************************************************************
 Copyright 2009-2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

grails.project.groupId = "net.hedtech" // used when deploying to a maven repo

grails.mime.file.extensions = true // enables the parsing of file extensions from URLs into the request format
grails.mime.use.accept.header = false
grails.mime.types = [html: ['text/html', 'application/xhtml+xml'],
                     xml: ['text/xml', 'application/xml', 'application/vnd.sungardhe.student.v0.01+xml'],
                     text: 'text/plain',
                     js: 'text/javascript',
                     rss: 'application/rss+xml',
                     atom: 'application/atom+xml',
                     css: 'text/css',
                     csv: 'text/csv',
                     all: '*/*',
                     json: ['application/json', 'text/json'],
                     form: 'application/x-www-form-urlencoded',
                     multipartForm: 'multipart/form-data'
]

// The default codec used to encode data with ${}
grails.views.default.codec = "html" // none, html, base64  **** Charlie note: Setting this to html will ensure html is escaped, to prevent XSS attack ****
grails.views.gsp.encoding = "UTF-8"
grails.converters.encoding = "UTF-8"
grails.plugin.springsecurity.logout.afterLogoutUrl = "/banner.zul?page=mainPage"
grails.converters.domain.include.version = true
grails.converters.json.date = "default"
grails.converters.json.pretty.print = true
grails.converters.json.default.deep = true

// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = false

// enable GSP preprocessing: replace head -> g:captureHead, title -> g:captureTitle, meta -> g:captureMeta, body -> g:captureBody
grails.views.gsp.sitemesh.preprocess = true

// set per-environment serverURL stem for creating absolute links
environments {
    production {
        grails.serverURL = "http://NOT_USED:8080/${appName}"
    }
    development {
        grails.serverURL = "http://NOT_USED:8080/${appName}"
    }
    test {
        grails.serverURL = "http://NOT_USED:8080/${appName}"
    }
}

// ******************************************************************************
//
//                       +++ DATA ORIGIN CONFIGURATION +++
//
// ******************************************************************************
// This field is a Banner standard, along with 'lastModifiedBy' and lastModified.
// These properties are populated automatically before an entity is inserted or updated
// within the database. The lastModifiedBy uses the username of the logged in user,
// the lastModified uses the current timestamp, and the dataOrigin uses the value
// specified here:
dataOrigin = "Banner"


// ******************************************************************************
//
//                       +++ FORM-CONTROLLER MAP +++
//
// ******************************************************************************
// This map relates controllers to the Banner forms that it replaces.  This map
// supports 1:1 and 1:M (where a controller supports the functionality of more than
// one Banner form.  This map is critical, as it is used by the security framework to
// set appropriate Banner security role(s) on a database connection. For example, if a
// logged in user navigates to the 'medicalInformation' controller, when a database
// connection is attained and the user has the necessary role, the role is enabled
// for that user and Banner object.
formControllerMap = [
        'validation': ['GTVPARS', 'GTVINSM', 'STVDEPT', 'STVDISA', 'STVGMOD', 'STVSUBJ', 'STVLEVL', 'STVCAMP', 'STVDIVS', 'STVMDEQ', 'STVCOLL', 'STVSCHD'],
        'medicalinformation': ['GOAMEDI'],
        'integrationpartnersystemrule': ['GORINTG'],
        'function': ['GTVFUNC'],
        'integrationpartner': ['GTVINTP'],
        'instructionalmethod': ['GTVINSM'],
        'meetingtype': ['GTVMTYP'],
        'partition': ['GTVPARS'],
        'scheduletoolstatus': ['GTVSCHS'],
        'durationunit': ['GTVDUNT'],
        'personidentificationname': ['SPAIDEN'],
        'lookup': ['SPAIDEN', 'GTVPARS', 'GTVINSM'],
        'awardcategory': ['STVACAT'],
        'admissionrequiest': ['STVADMR'],
        'catalogapproval': ['STVAPRV'],
        'assignmenttype': ['STVASTY'],
        'attribute': ['STVATTR'],
        'studentattribute': ['STVATTS'],
        'block': ['STVBLCK'],
        'building': ['STVBLDG'],
        'campus': ['STVCAMP'],
        'cipcode': ['STVCIPC'],
        'controlrule': ['STVCNTR'],
        'college': ['STVCOLL'],
        'committeeandservicetype': ['STVCOMT'],
        'coursestatus': ['STVCSTA'],
        'catalogelementone': ['STVCUDA'],
        'catalogelementtwo': ['STVCUDB'],
        'catalogelementthree': ['STVCUDC'],
        'catalogelementfour': ['STVCUDD'],
        'catalogelementfive': ['STVCUDE'],
        'catalogelementsix': ['STVCUDF'],
        'classcode': ['STVCLAS'],
        'classification': ['STVCSSL'],
        'cohort': ['STVCHRT'],
        'degree': ['STVDEGC'],
        'degreelevel': ['STVDEGC'],
        'department': ['STVDEPT'],
        'disability': ['STVDISA'],
        'division': ['STVDIVS'],
        'evaluationquestion': ['STVEVAL'],
        'facultycontract': ['STVFCNT'],
        'facultystatus': ['STVFCST'],
        'facultycategory': ['STVFCTG'],
        'facultystafftype': ['STVFSTP'],
        'facultyadvisorquery': ['SIAIQRY'],
        'feetype': ['STVFTYP'],
        'gradingmode': ['STVGMOD'],
        'interest': ['STVINTS'],
        'level': ['STVLEVL'],
        'disabilityassistance': ['STVMDEQ'],
        'medicalequipment': ['STVMDEQ'],
        'medicalcondition': ['STVMEDI'],
        'occupationalcourse': ['STVOCCS'],
        'prerequisitewaiver': ['STVPWAV'],
        'feeassessmentrate': ['STVRATE'],
        'residency': ['STVRESD'],
        'termrestriction': ['STVRTRM'],
        'sourceandbackgroundinformation': ['STVSBGI'],
        'schedulecontract': ['STVSCCD'],
        'scheduletype': ['STVSCHD'],
        'scheduleoverride': ['SSAOVRR'],
        'studenttype': ['STVSTYP'],
        'subject': ['STVSUBJ'],
        'testscore': ['STVTESC'],
        'term': ['STVTERM'],
        'taxonomyofprograms': ['STVTOPS'],
        'visatype': ['STVVTYP'],
        'workloadrule': ['STVWKLD'],
        'programrules': ['SMAPRLE'],
        'coursegeneralinformation': ['SCACRSE'],
        'courseroomattribute': ['SCACRSE'],
        'coursepartition': ['SCACRSE'],
        'coursedetailinformation': ['SCADETL'],
        'courseattribute': ['SCADETL'],
        'coursecorequisite': ['SCADETL'],
        'coursesupplementaldata': ['SCADETL'],
        'coursedescription': ['SCADETL'],
        'coursetext': ['SCADETL'],
        'coursefee': ['SCADETL'],
        'courseintegrationpartners': ['SCADETL'],
        'coursetransferinstituitions': ['SCADETL'],
        'courseequivalent': ['SCADETL'],
        'coursedetailinformationpage': ['SCADETL'],
        'coursetestscorerestrictionandprerequisites': ['SCAPREQ'],
        'coursearearestriction': ['SCAPREQ'],
        'coursetestscorerestrictioninformationpage': ['SCAPREQ'],
        'coursemajorrestriction': ['SCARRES'],
        'courseregistrationrestrictions': ['SCARRES'],
        'coursedepartmentrestriction': ['SCARRES'],
        'coursecollegerestriction': ['SCARRES'],
        'courseprogramrestriction': ['SCARRES'],
        'catalogcampusrestriction': ['SCARRES'],
        'coursesearch': ['SCASRCH'],
        'coursetermrestriction': ['SCASRES'],
        'coursecampusrestriction': ['SCASRES'],
        'courselevelrestriction': ['SCASRES'],
        'courseclassrestriction': ['SCASRES'],
        'coursedegreerestriction': ['SCASRES'],
        'coursecollegedepartmenttext': ['SCATEXT'],
        'coursecollegedepartmentdescription': ['SCATEXT'],
        'coursecollegedepartment': ['SCATEXT'],
        'facultymemberbase': ['SIBINST'],
        'facultymemberinstructionalassignment': ['SIRASGN'],
        'campussecurity': ['SOAPROF'],
        'arealibrary': ['SSAPREQ'],
        'sectionmeetingtime': ['SSASECT'],
        'scheduleexclusionrules': ['SSAEXCL'],
        'coursechortrestriction': ['SCASRES'],
        'coursestudentattributerestriction': ['SCARRES'],
        'institutionaldescription': ['GUAINIT'],
        'sectionstatus': ['STVSSTS'],
        'partofterm': ['STVPTRM'],
        'sessioncode': ['STVSESS'],
        'schedule': ['SSASECT'],
        'reservedseatsinquiry': ['SSIRESV'],
        'section': ['SSASECT'],
        'specialapproval': ['STVSAPR'],
        'attendanceaccountingmethod': ['STVACCT'],
        'termbase': ['SOATERM'],
        'partoftermrule': ['SOATERM'],
        'coursesyllabus': ['SCASYLB'],
        'coursesyllabuslearningobective': ['SCASYLB'],
        'coursesyllabusrequiredmaterial': ['SCASYLB'],
        'coursesyllabustechnicalrequirement': ['SCASYLB'],
        'courselabordistribution': ['SCACLBD'],
        'coursebasemaintenance': ['SCABASE'],
        'catalogprerequisiteandtestscorerestrictions': ['SCAPREQ'],
        'buildingandroomattribute': ['STVRDEF'],
        'dummyController': ['ANY_FORM', 'ANOTHER_FORM'],
        'basiccourseinformation': ['SCACRSE'],
        'mutualcourseexclusion': ['SCAMEXC'],
        'fund': ['SCAMEXC'],
        'collegeanddepartmenttext': ['SCATEXT'],
        'catalogschedulerestrictions': ['SCASRES'],
        'historygradingcodemaintenance': ['SHAGRDE'],
        'studentaccountsdetailchargepayment': ['TSADETC'],
        'detailchargepaymentcategory': ['TTVDCAT'],
        'sectiontestscoreandprerequisiterestriction': ['SSAPREQ'],
        'sectioncomment': ['SSATEXT'],
        'sectiondescription': ['SSATEXT'],
        'schedulelabordistribution': ['SSACLBD'],
        'sectionfacultywebdisplaycontrol': ['SSAWSEC'],
        'sectionstudentwebdisplaycontrol': ['SSAWSEC'],
        'sectionarearestriction': ['SSAPREQ'],
        'sectioncorequisite': ['SSADETL'],
        'sectionlink': ['SSADETL'],
        'sectiondegreeprogramattribute': ['SSADETL'],
        'sectionmajorrestriction': ['SSADETL'],
        'sectioncontract': ['SSADETL'],
        'schedulecrosslistenrollmentinformationbase': ['SSAXLST'],
        'schedulecrosslistdefinition':['SSAXLST'],
        'schedulecrosslistquery':['SSAXLSQ'],
        'sectionfee': ['SSADETL'],
        'blockschedulesectionquery': ['SSABSCQ'],
        'blockschedulecontrol': ['SSABLCK'],
        'blockschedulequery': ['SSABLKQ'],
        'sectionevaluation': ['SSAEVAL'],
        'sectionsyllabus': ['SSASYLB'],
        'sectionsyllabuslongcoursetitle': ['SSASYLB'],
        'sectionsyllabuslearningobjective': ['SSASYLB'],
        'sectionsyllabusrequiredmaterial': ['SSASYLB'],
        'sectionsyllabustechnicalrequirement': ['SSASYLB'],
        'scheduleprocessingrules': ['SSARULE'],
        'sectionolrregistrationstatus': ['SSARULE'],
        'sectionolrextensionrule': ['SSARULE'],
        'sectionolrrefunding': ['SSARULE'],
        'waitlistautomationsectioncontrol'    : [ 'SSAWLSC'] ,
        'sectionprerequisiteandtestscorerestrictions': ['SSAPREQ'],
        'scheduleprerequisiteandtestscorerestrictions': ['SSAPREQ'],
        'sectionfeeassessmentcontrol':['SSADFEE'],
        'facultymemberworkloadtermrule': ['SIAFLRT'],
        'facultyworkloadtermrules': ['SIAFLRT'],
        'scheduledetail': ['SSADETL'],
        'studentaccountsreceivableuserrestrictions': ['TGAUPRF'],
        'studentaccountsreceivablebillingControl': ['TGACTRL', 'TSACTRL'],
        'studentaccountsreceivableuseridprofile': ['TGAUPRF', 'TGIUPRF'],
        'studentbase': ['SGASTDN'],
        'studentcooperativeeducationduty': ['SGACOOP'],
        'studentcooperativeeducation': ['SGACOOP'],
        'nametype': ['GTVNTYP'],
        'fgacdomain': ['GTVFDMN'],
        'historyinstitutionalcoursetermmaintenance': ['SHATCKN'],
        'historyinstitutionalcoursemaintenancetermheader': ['SHAINST'],
        'historyinstitutionalcoursemaintenancelevelapplied': ['SHATCKN'],
        'studentcentricperiod': ['SOASCPS'],
        'registrationstudentregistration': ['SFAREGS'],
        'quickentry': [ 'SAAQUIK' ],
        'basicskill': ['STVBSKL', 'SHATCKN'],
        'cohortreason': ['STVCHRT' , 'SGASTDN'],
        'gradecomment': ['STVGCMT', 'SHATCKN'],
        'combinedacademicstanding': ['STVCAST', 'SHAINST'],
        'cooperativeeducation': ['STVCOPC', 'SGACOOP'],
        'employer': ['STVEMPL', 'SHACOOP'],
        'enrollemntStatus': ['STVESTS', 'SFAREGS'],
        'incomerange': ['STVINTC', 'SGASTDN'],
        'studentcentricperiodcyclevalidation': ['STVSCPC', 'SGASTDN'],
        'studentstatus': ['STVSTYP', 'SGASTDN'],
        'withdrawalreason': ['STVWRSN', 'SGASTDN'],
        'withdrawalstatus': ['STVWDRL', 'SGASTDN'],
        'geographicregionascostcenterinformationbydisctirctordivision': ['GTVDICD', 'SPAIDEN'],
        'nation': ['STVNATN', 'SPAIDEN'],
        'site': ['STVSITE', 'SGASTDN'],
        'state': ['STVSTAT', 'SPAIDEN'],
        'academicstanding': ['STVASTD', 'SPAIDEN'],
        'admissiontype': ['STVADMT', 'SGASTDN'],
        'apprenticeship': ['STVAPRN', 'SGASTDN'],
        'careerplanning': ['STVCAPL', 'SGASTDN'],
        'curriculumactivitystatus': ['STVCACT', 'SGASTDN'],
        'curriculumstatus': ['STVCSTS', 'SGASTDN'],
        'educationgoal': ['STVEGOL', 'SGASTDN'],
        'educationlevel': ['STVEGLV', 'SGASTDN'],
        'employmentexpectation': ['STVEMEX', 'SGASTDN'],
        'examination': ['STVEXAM', 'SGASTDN'],
        'gainstatus': ['STVgain', 'SGASTDN'],
        'leaveofabsence': ['STVLEAV', 'SGASTDN'],
        'orientationsession': ['STVORNT', 'SGASTDN'],
        'practicaltraining': ['STVPRAC', 'SGASTDN'],
        'progressevaluation': ['STVPREV', 'SGASTDN'],
        'registrationreason': ['STVRGRE', 'SGASTDN'],
        'timestatus': ['STVTMST', 'SGASTDN'],
        'transfercenter': ['STVTRNS', 'SGASTDN'],
        'vocationaleducation': ['STVVOED', 'SGASTDN'],
        'registrationstudentcourseregistration': ['SFAREGS'] ,
        'sectionwebcontrols'                  : [ 'SSAWSEC' ],
        'schedulerestrictions'   			  : [ 'SSARRES' ],
        'sectiondepartmentrestriction'        : [ 'SSARRES' ],
        'scheduleacademiccalendarrules' : [ 'SSAACRL' ],
        'academiccalendarrulequery': ['SSAQCRL'],
        'scheduleevaluation' : ['SSAEVAL'],
        'studentcourseregistration': [ 'SFAREGS' ],
        'crosslistmeetingtimeinstructorquery': ['SSAXMTI'],
        'subjectschedulingrules': ['SSASBSH'],
        'schedulecalendar': ['SSAACCL'],
        'availablefacultyquery': ['SIAFAVL'],
        'schedulesectionquery' : ['SSASECQ'],
        'buildingroomschedule' : ['SSAMATX'] ,
        'banner'  : ['SCACRSE'],
        'mainpage' : ['GUAGMNU'],
        'menu' : ['GUAGMNU'],
        'facultygradeentry' : ['SIIINST', 'SIAINST'],
        'facultysection' : ['SIIINST', 'SIAINST']
]

grails.plugin.springsecurity.useRequestMapDomainClass = false
//grails.plugin.springsecurity.rejectIfNoRule = true

grails.plugin.springsecurity.securityConfigType = grails.plugin.springsecurity.SecurityConfigType.InterceptUrlMap



// ******************************************************************************
//
//                       +++ INTERCEPT-URL MAP +++
//
// ******************************************************************************

grails.plugin.springsecurity.interceptUrlMap = [
        [pattern:'/', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/login/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/index**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/logout/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/javascripts/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/stylesheets/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/images/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/plugins/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/errors/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/help/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/uiCatalog/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/theme/**', access:['IS_AUTHENTICATED_ANONYMOUSLY']],
        [pattern:'/themeEditor/**', access:['ROLE_SELFSERVICE-WTAILORADMIN_BAN_DEFAULT_M']],
        [pattern:'/ssb/uploadProperties/**', access:['ROLE_SELFSERVICE-WTAILORADMIN_BAN_DEFAULT_M']],

        // ALL URIs specified with the BannerAccessDecisionVoter.ROLE_DETERMINED_DYNAMICALLY
        // 'role' (it's not a real role) will result in authorization being determined based
        // upon a user's role assignments to the corresponding form (see 'formControllerMap' above).
        // Note: This 'dynamic form-based authorization' is performed by the BannerAccessDecisionVoter
        // registered as the 'roleVoter' within Spring Security.
        //
        // Only '/name_used_in_formControllerMap/' and '/api/name_used_in_formControllerMap/'
        // URL formats are supported.  That is, the name_used_in_formControllerMap must be first, or
        // immediately after 'api' -- but it cannot be otherwise nested. URIs may be protected
        // by explicitly specifying true roles instead -- as long as ROLE_DETERMINED_DYNAMICALLY
        // is NOT specified.
        //
        [pattern:'/**', access:['ROLE_DETERMINED_DYNAMICALLY']],
]

dataSource {
    configClass = GrailsAnnotationConfiguration.class
    dialect = "org.hibernate.dialect.Oracle10gDialect"
    loggingSql = false
}


hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = true
    cache.provider_class = 'net.sf.ehcache.hibernate.EhCacheProvider'
    hbm2ddl.auto = null
    show_sql = false
    dialect = "org.hibernate.dialect.Oracle10gDialect"
    config.location = [
            "classpath:hibernate-banner-core.cfg.xml",
            "classpath:hibernate-banner-general-utility.cfg.xml"
    ]
}

grails.config.locations = [
        BANNER_APP_CONFIG: "banner_configuration.groovy"
]
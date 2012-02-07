/*********************************************************************************
 Copyright 2009-2012 SunGard Higher Education. All Rights Reserved.
 This copyrighted software contains confidential and proprietary information of 
 SunGard Higher Education and its subsidiaries. Any use of this software is limited 
 solely to SunGard Higher Education licensees, and is further subject to the terms 
 and conditions of one or more written license agreements between SunGard Higher 
 Education and the licensee in question. SunGard is either a registered trademark or
 trademark of SunGard Data Systems in the U.S.A. and/or other regions and/or countries.
 Banner and Luminis are either registered trademarks or trademarks of SunGard Higher 
 Education in the U.S.A. and/or other regions and/or countries.
 **********************************************************************************/



 /**
  * Specifies all of the URL mappings supported by the application.
  */
class UrlMappings {

    static mappings = {

        "/ssb/menu" {
            controller = "selfServiceMenu"
            action = [GET: "data", POST: "create"]
        }

        "/ssb/i18n/$name*.properties"(controller: "i18n", action: "index" )


        "/ssb/resource/$controller" {
            action = [ GET: "list", POST: "create" ]
        }

        "/ssb/resource/$controller/batch" {
            action = [ POST: "processBatch" ]
        }


        "/ssb/resource/$controller/$id?" {
            action = [ GET: "show", PUT: "update", DELETE: "destroy" ]
            constraints {
                id(matches:/[0-9]+/)
            }
        }

        "/ssb/resource/$controller/$type" {
            action = "list"
            constraints {
                type(matches:/[^0-9]+/)
            }
        }

        "/ssb/resource/$controller/$type/batch" {
            action = [ POST: "processBatch" ]
            constraints {
                type(matches:/[^0-9]+/)
            }
        }

        "/ssb/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

        "/login/auth" {
            controller = "login"
            action = "auth"
        }

        "/login/denied" {
            controller = "login"
            action = "denied"
        }

        "/login/authAjax" {
            controller = "login"
            action = "authAjax"
        }

        "/login/authfail" {
            controller = "login"
            action = "authfail"
        }

        "/logout" {
            controller = "logout"
            action = "index"
        }

        "/logout/timeout" {
            controller = "logout"
            action = "timeout"
        }

        "/"(view:"/index")
        "500"(controller: "error", action: "internalServerError")
        "403"(controller: "error", action: "accessForbidden")
    }
}
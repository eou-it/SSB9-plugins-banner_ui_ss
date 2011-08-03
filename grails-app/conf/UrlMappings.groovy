/** *****************************************************************************
 � 2010 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */



 /**
  * Specifies all of the URL mappings supported by the application.
  */
class UrlMappings {

    static mappings = {

        "/resource/$controller" {
            action = [ GET: "list", POST: "create" ]
        }

        "/resource/$controller/batch" {
            action = [ POST: "processBatch" ]
        }

        "/resource/$controller/$id?" {
            action = [ GET: "show", PUT: "update", DELETE: "destroy" ]
            constraints {
                id(matches:/[0-9]+/)
            }
        }

        "/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

        "/"(view:"/index")
        "500"(controller: 'errors', action: 'serverError')
    }
}

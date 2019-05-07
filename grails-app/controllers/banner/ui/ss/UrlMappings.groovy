package banner.ui.ss

class UrlMappings {

    static mappings = {
        "/themeEditor/" ( controller:"themeEditor", action:"index" )
        "/uploadProperties/" ( controller:"uploadProperties", action:"index" )

        "/"(view:"/index")
        "500"(view:'/error')
    }
}

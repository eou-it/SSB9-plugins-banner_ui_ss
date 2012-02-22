$(document).ready(function() {
    var programmingLanguages2 = [
        "C"           ,
        "C++"         ,
        "D"           ,
        "Groovy"      ,
        "JavaScript"  ,
        "Scala"       ,
        "C#"          ,
        "Ruby"        ,
        "PHP"         ,
        "Go"          ,
        "CoffeeScript",
        "CSS"         ,
        "LessCSS"     ,
        "COBOL"       ,
        "PL/SQL"      ,
        "SQL"         ,
        "Fortran"     ,
        "Objective-C" ,
        "Fortran"
    ];


    $(".comboBox-control-demo").autocomplete({
        source:      programmingLanguages2,
        minLength:   0,
        selectFirst: true,
        autoSelect:  true,
        someOtherPropertyThatShouldDoSomething: false
    });


    $(".comboBox-control-button-demo").click(function() {
        var el = $(".comboBox-control-demo");

        if (el.autocomplete("widget").is(":visible")) {
            el.autocomplete("close");
            return;
        }

        $(this).blur();

        el.autocomplete("search", "");
        el.focus();
    });
});

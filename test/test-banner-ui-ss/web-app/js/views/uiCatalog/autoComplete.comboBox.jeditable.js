$(document).ready(function() {
    var programmingLanguages = [
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

    var autoCompleteComboBoxOptions = editableTypeDefaults({
        name:     "autoCompleteComboBoxExample",
        type:     "combobox",
        combobox: {
            appendTo: "#inner-content",
            source:   programmingLanguages,
            close: function(event, ui) {
                $(this).closest('form').submit();
            },
            open: function(event, ui){
                var elem = $(this);

                var actualScreenHeightAvailable = $(window).height() - $('#footerApplicationBar').outerHeight();

                var comboBoxOptions = $('.ui-autocomplete');
                var comboBoxPadding = comboBoxOptions.innerWidth() - comboBoxOptions.width();

                comboBoxOptions.css('width', elem.width() - comboBoxPadding);

                if (comboBoxOptions.offset().top + comboBoxOptions.outerHeight() >= actualScreenHeightAvailable) {
                    var topOfComboBox         = Math.round(elem.offset().top);
                    var comboBoxOptionsHeight = Math.round(comboBoxOptions.outerHeight());
                    var newOffsetTop          = topOfComboBox - comboBoxOptionsHeight;

                    comboBoxOptions.offset($.extend(comboBoxOptions, { top: Math.round(newOffsetTop) }));
                }
            }
        },
        validate: function(value, settings, original) {
            var it = $("input", original);
            it.val($.trim(value.toUpperCase()));

            return true;
        }
    });

    $(".autoComplete-comboBox-control-demo").editable(function (value, settings) {
            return value;
        },
        autoCompleteComboBoxOptions
    );
});

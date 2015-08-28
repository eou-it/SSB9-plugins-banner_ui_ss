module.service('readonlysvc', function() {

    this.toggle = function(ele,value) {

        var numberInput = $(ele).find('input[type=number]');
        var textInput = $(ele).find('input[type!=number]');
        if(value === 'true'){
            numberInput.attr('readonly','readonly');
            $(numberInput).addClass('readonly');
            $(textInput).addClass('readonly');
            $(numberInput).on('click');
        }
        else{
            numberInput.removeAttr('readonly');
            $(numberInput).removeClass('readonly');
            $(textInput).removeClass('readonly');
            $(numberInput).off('click');

        }

    }
    this.moveCursor = function(ele){
        var numberInput = $(ele).find('input[type=number]');
        function getSelectedText(){
            var selText = "";
            if (window.getSelection) {  // all browsers, except IE before version 9
                if (document.activeElement &&
                    (document.activeElement.tagName.toLowerCase() == "input"))
                {
                    var text = document.activeElement.value;
                    selText = text.substring (document.activeElement.selectionStart,
                        document.activeElement.selectionEnd);
                }
                else {
                    var selRange = window.getSelection ();
                    selText = selRange.toString ();
                }
            }
            else {
                if (document.selection.createRange) {       // Internet Explorer
                    var range = document.selection.createRange ();
                    selText = range.text;
                }
            }

            return selText;
        }
        $(numberInput).on('click focus',function(){
            var cursorPointer = this.selectionStart;
            var len = $(this).val().length;
            var selectedText = getSelectedText();
            if (this.setSelectionRange){
                if((selectedText.length === 0 && $(this).attr('readonly')) || cursorPointer === 0 ){
                    this.setSelectionRange(len, len);
                }
            }
            else{
                $(this).val($(this).val());
            }

        });
    }
});

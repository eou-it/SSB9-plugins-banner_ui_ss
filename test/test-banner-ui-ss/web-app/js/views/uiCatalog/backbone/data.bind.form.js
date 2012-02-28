$(document).ready(function() {
    var form1 = $(".data-bind-form-1");
    var form2 = $(".data-bind-form-2");

    var BindModel = Backbone.Model.extend({});

    var bindModel = new BindModel({
        text1: "Banner",
        text2: "Web",
        text3: "Framework"
    });

    var FormView = Backbone.View.extend({
        el: ".data-bound-forms",
        initialize: function() {
            Backbone.ModelBinding.bind(this);
        }
    });

    var boundForm = new FormView({ model: bindModel });

});

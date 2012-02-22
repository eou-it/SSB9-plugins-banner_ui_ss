$(document).ready(function() {

    var components = _.map($(".component"), function(it) {
        var widgets = _.map($(".code-demonstration", it), function(widget) {
            return {
                name: $(widget).data("component"),
                desc: $(widget).data("desc")
            }
        });

        return {
            name:    $(it).data("component"),
            desc:    $(it).data("desc"),
            widgets: widgets
        };
    });

    var NavigationView = Backbone.View.extend({
        el: ".ui-catalog-navigation-list",
        initialize: function() {
            _.bindAll(this, "render");
        },
        render: function() {
            var view  = this;
            var comps = view.options.model;
            _.each(comps, function(it) {
                var span = view.make("span",  { "data-link": it.name}, it.desc);
                var li   = view.make("li", {}, span);

                var items = _.map(it.widgets, function (widget) {
                    return view.make("li", {}, view.make("span",  { "data-link": widget.name}, widget.desc));
                });

                $(li).append(view.make("ul", {}, items));

                $(view.el).append(li);
            });
        }
    });

    (new NavigationView({ model: components })).render();

    window.scrollableContentView.bindScroll(".ui-catalog-navigation-list li span");
});

$(document).ready(function() {

    var ScrollableContentView = Backbone.View.extend({
        el: "#inner-content",
        initialize: function() {
            _.bindAll(this, "bindScroll", "scroll");
        },
        bindScroll: function(selector) {
            var view = this;

            $(selector).click(function(e) {
                e.preventDefault();
                view.scroll(e.currentTarget);
            });
        },
        scroll: function(el) {
            var duration = 1000;
            var easing   = 'swing';

            var elementToScroll = $(this.el);
            var currentScroll   = elementToScroll.scrollTop();
            var link            = $(el).data("link");
            var linkElement     = $("[data-component=" + link + "]");
            var position        = linkElement.position();
            var target          = (position != null) ? Math.round(position.top) : elementToScroll.innerHeight();

            var scrollTarget = currentScroll + target;

            $("#inner-content:not(:animated)").animate({ scrollTop: scrollTarget }, duration, easing);
        }
    });

    window.scrollableContentView = new ScrollableContentView();
});

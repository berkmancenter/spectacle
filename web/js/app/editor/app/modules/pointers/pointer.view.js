define([
    "app",
    "backbone"
],

function( app ) {

    return Backbone.View.extend({

        $target: null,

        className: function() {
            return "pointer point-" + this.model.get("pointDirection");
        },

        template: "app/modules/pointers/pointer",

        serialize: function() {
            return this.model.toJSON();
        },

        initialize: function() {
            app.on("window-resize", this.positionPointer, this );
        },

        afterRender: function() {
            this.positionPointer();
        },

        positionPointer: function() {
            var css = {};

            this.$target = $( this.model.get("target") );

            if ( this.$target.length ) {
                css.top = ( this.$target.offset().top + ( this.$target.height() / ( this.model.get("verticalDivision") || 2 ) ) - 21 );
                if ( this.model.get("pointDirection") == "right" ) {
                    css.left = this.$target.offset().left - this.$el.width() - 20 - 15 ;
                } else {
                    css.left = this.$target.offset().left + this.$target.width() + 15;
                }
                if ( css.left < 0 ) css.left = 5;

                this.$el.css( css ).show();
            }
        },

        show: function() {
            $("#main").prepend( this.el );

            this.$el.css(_.extend({
                top: "-1000%",
                left: "-1000%"
            }, this.model.get("css") ));

            this.render();
        },

        hide: function() {
            this.$el.fadeOut(function() {
                this.remove();
                this.options.parent.trigger("end");
            }.bind( this ));
        },

        cancel: function() {
            this.$el.fadeOut(function() {
                this.remove();
            }.bind( this ));
        },

        events: {
            "click .stop-pointing": "stopPointing"
        },

        stopPointing: function() {
            this.options.parent.collection.cancel();
            app.emit("help",{
                    action: "close"
            });
        }
    });
});

define([
    "app",
    "backbone"
],

function( app ) {

    return Backbone.View.extend({

        template: "app/modules/intro-modal/intro-modal",
        
        className: "ZEEGA-intro-modal modal-overlay",

        start: function() {
            $("body").append( this.el );
            $("#main").addClass("modal");
            this.render();
            this.$el.fadeIn("fast");
        },

        events: {
            "click .next": "next",
            "click .finish": "finish"
        },

        next: function() {
            this.$(".step-1").fadeOut(function() {
                this.$(".step-2").fadeIn();
            }.bind( this ));
        },

        finish: function() {
            this.hide();
        },

        hide: function() {
            $("#main").removeClass("modal");
            this.$el.fadeOut(function() {
                this.remove();
            }.bind( this ));
        }

    });

});

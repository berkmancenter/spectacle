define([
    "app",


    "backbone"
],

function( app ) {


    return Backbone.View.extend({

        template: "app/templates/modal",
        modalClass: "",
        
        className: function() {
            return "ZEEGA-modal " + this.options.modal.className;
        },

        serialize: function() {
            return this.options;
        },

        show: function() {
            $("body").append( this.el );
            $("#main").addClass("modal");
            this.$el.attr("style","");
            this.render();
        },
        
        events: {
            "click .modal-close": "hide"
        },

        close: function() {
            $("#main").removeClass("modal");
            this.$el.fadeOut(function() {
                this.remove();
            }.bind( this ));
        },

        hide: function() {
            this.close();
        }

    });

});

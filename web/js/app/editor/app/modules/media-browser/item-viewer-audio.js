define([
    "app",
    "backbone"
],

function( app ) {

    return Backbone.View.extend({
        
        className: "item-viewer item-viewer-audio",
        template: "app/templates/item-viewer-audio",

        serialize: function() {
            return _.extend({
                    remix: app.zeega.getCurrentProject().get("remix").remix
                },
                this.model.toJSON()
            );
        },

        exit: function() {
            this.$("audio").attr("src", "");
        }
        
    });

});

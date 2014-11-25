define([
    "app",
    // Libs
    "backbone"
],

function(app, Backbone) {

    return Backbone.View.extend({
        
        className: "pause-overlay",
        template: "app/templates/pause",
        
        serialize: function() {
            return this.model.zeega.toJSON();
        },

        events: {
            "click .play": "play"
        },

        play: function() {
            this.model.play();
        }
    });

});

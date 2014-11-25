define([
    "app",
    "backbone"
],

function( app ) {


    return Backbone.View.extend({

        template: "sidebar",
        className: "sidebar",

        serialize: function() {
            return  _.extend( app.metadata,
                {
                    path: "http:" + app.metadata.hostname + app.metadata.directory
                }
            );
        },
        events: {
            "click .join-zeega": "onSignUp"
        },
        onSignUp: function(){
            app.emit("to_signup", {source: "sidebarButton" });
        }

    });


});

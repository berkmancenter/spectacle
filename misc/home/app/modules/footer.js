define([
    "app",
    "backbone"
],

function( app ) {


    return Backbone.View.extend({

        template: "footer",
        className: "footer",
        serialize: function() {
            return  _.extend( app.metadata,
                {
                    path: "http:" + app.metadata.hostname + app.metadata.directory
                }
            );
        }

    });

});

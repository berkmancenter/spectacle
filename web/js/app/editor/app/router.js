define([
    // Application.
    "app",

    // Modules.
    "modules/initializer"
],

function(app, Initializer) {

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({

        initialize: function() {
            new Initializer();
        },

        routes: {
            "": "index",
            ":projectID": "index"
        }
    });

    return Router;

});

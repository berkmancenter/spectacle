define([
    // Application.
    "app",

    // Modules.
    "modules/initializer"
],

function(app, Initializer) {

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({

        routes: {
            "": "index",
            "settings": "settings",
            "social": "social", // for dev
            "register/social": "social",
            "register": "register",
            "register/": "register"
        },

        index: function() {
            app.page = "settings";
            this.init();
        },

        settings: function() {
            app.page = "settings";
            this.init();
        },

        social: function() {
            app.page = "social";
            this.init();
        },

        register: function() {
            app.page = "register";
            this.init();
        },

        init: _.once(function() {
            $("html").addClass("page-" + app.page );
            new Initializer();
        })

    });

    return Router;

});

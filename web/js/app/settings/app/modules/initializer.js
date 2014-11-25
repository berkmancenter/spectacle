define([
    "app",
    // Modules
    "modules/layout-main",
    "modules/user.model",
    "analytics/analytics",
    "backbone"
],

function( app, MainLayout, User, Analytics) {

    return Backbone.Model.extend({
        
        initialize: function() {
            app.analytics = new Analytics();

            app.analytics.setGlobals({
                userId: app.metadata.userId,
                app: "community",
                context: "web",
                path: app.metadata.path
            });

            if ( window.profileData ) app.user = new User();

            $(".join-zeega").click(function() { app.emit("to_signup"); });
            $(".create-a-zeega").click(function() { app.emit("new_zeega"); });

            this.insertLayout();
        },

        insertLayout: function() {
            app.layout = new MainLayout();
            app.layout.render();
        }

    });

});

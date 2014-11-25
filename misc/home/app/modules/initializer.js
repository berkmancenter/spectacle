define([
    "app",
    // Modules
    "modules/layout-main",
    "analytics/analytics",
    "backbone"
],

function( app, MainLayout, Analytics) {

    return Backbone.Model.extend({
        
        initialize: function() {
            app.analytics = new Analytics();

            app.analytics.setGlobals({
                userId: app.metadata.userId,
                app: "community",
                context: "web",
                path: app.metadata.path
            });

            this.insertLayout();
        },

        insertLayout: function() {
            app.layout = new MainLayout();
            app.layout.render();
        }

    });

});

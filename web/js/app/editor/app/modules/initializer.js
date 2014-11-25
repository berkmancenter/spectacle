define([
    "app",
    // Modules
    "modules/layout-main",
    // Plugins
    "engine/engine",
//    "engine/parser",
    "backbone"
],

function( app, Layout, Engine, Analytics ) {

    return Backbone.Model.extend({
        
        initialize: function() {
            // app.mediaBrowser = new MediaBrowser();
            this.loadProject();
        },

        initAnalytics: function() {
            app.analytics = new Analytics();
            app.analytics.setGlobals({
                "projectId": app.metadata.projectId,
                "userId": app.metadata.userId,
                "userName": app.metadata.userName,
                "app": "editor"
            });

            if( app.metadata.newUser ){
                app.analytics.people.set({
                    $id : app.metadata.userId,
                    $username: app.metadata.userUsername,
                    $created: new Date(),
                    $name: app.metadata.userName,
                    $email: app.metadata.userEmail
                });
                app.emit("new_user", {});
            } else {
                app.analytics.people.set({
                    $id : app.metadata.userId,
                    $username: app.metadata.userUsername,
                    $name: app.metadata.userName
                });
            }

            app.analytics.identify( app.metadata.userUsername );

            if( app.metadata.newZeega ){
                app.analytics.people.increment("zeegas");
                app.emit("new_zeega", {});
            }
            app.analytics.people.increment("editor_sessions");
        },

        loadProject: function( attributes ) {

            if ( window.projectJSON ) {
                this._parseData( jQuery.parseJSON( window.projectJSON ) );
            } else {
                var rawDataModel = new Backbone.Model();
                // mainly for testing
                rawDataModel.url = app.getApi() + "projects/"+ app.metadata.projectId;

                rawDataModel.fetch().success(function( response ) {
                    this._parseData( response );
                }.bind( this )).error(function() {
                    throw new Error("Ajax load fail");
                });
            }
           
        },

        _parseData: function( response ) {

            app.zeega = new Engine.generateZeega( response,
                _.extend({},
                    this.toJSON(),
                    {
                        mode: "editor"
                    })
                );

            app.remix = app.zeega.getCurrentProject().get("remix");

            this.insertLayout();
        },

        insertLayout: function() {

            if ( !app.metadata.dev ) {
                var location = app.metadata.root == "/" ? app.metadata.root + "editor/" + app.zeega.getCurrentProject().id : "/" + app.metadata.root + "editor/" + app.zeega.getCurrentProject().id;
                window.history.pushState("", "", location );
            }

            app.layout = new Layout();
            app.layout.render();
        }

    });

});

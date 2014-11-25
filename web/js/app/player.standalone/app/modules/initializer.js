/*

the controller model should remove any non-route code from router.js
*/

define([
    "app",
    // Libs
    "player/modules/player",

    "modules/ui"

     // Plugins
],

function( app, Player, PlayerUI) {

    return app.Backbone.Model.extend({

        initialize: function() {
            this.initPlayer();
        },

        initPlayer: function() {
            var projectData, loops, hasEndpage;

            projectData = _.isObject( window.projectJSON ) ? window.projectJSON : $.parseJSON( window.projectJSON ) || null;
            
            loops = !app.isEmbed() ? true : app.getIframeAttributes().loop;
            hasEndpage = !loops && !( projectData &&  projectData.project.remix && projectData.project.remix.descendants && projectData.project.remix.descendants.length ) && app.isEmbed();

            app.player = new Player({

                loop: loops,
                scalable: true,
                endPage: hasEndpage,
                controls: false,
                debugEvents: false,
                autoplay: projectData.project.autoplay,
                autoplayDuration: projectData.project.autoplay_duration * 1000,
                preloadRadius: 2,
                target: "#player",
                preview: true,
                data: projectData,
                windowRatio: false,
                url: window.projectJSON ? null : "testproject.json"
            });

            if( window.projectJSON ) {
                this.onDataLoaded();
            } else {
                app.player.once('player:ready', this.onDataLoaded, this);
            }
            app.player.on('sequence_enter', this.updateWindowTitle, this);
           
        },

        onDataLoaded: function() {
            /*
            render base layout
            the base layout contains the logic for the player skin (citations, ui, etc)
            */
            this.setContextVariables();
            app.layout = new PlayerUI();

        },

        // remove this thing
        setContextVariables: function() {
            try {
                app.showChrome = !window.frameElement || !window.frameElement.getAttribute("hidechrome");
            } catch ( err ) {
                app.showChrome = false;
            }

            try {
                app.showEndPage = ( window == window.top ) || ( window.frameElement && window.frameElement.getAttribute("endpage"));
            } catch ( err ) {
                app.showEndPage = true;
            }
        },

        initAnalytics: function() {
            var context;
                        //detect context
            if( window == window.top ) {
                context = "web";
            } else if ( !app.showChrome ) {
                context = "homepage";
            } else {
                context = "embed";
            }

            app.analytics = new Analytics();

            app.analytics.setGlobals({
                projectId: app.player.zeega.getCurrentProject().id,
                projectPageCount: app.player.zeega.getCurrentProject().pages.length,
                userId: app.metadata.userId,
                userName: app.metadata.userName,
                app: "player",
                context: context,
                authenticated: app.metadata.loggedIn
            });

            app.analytics.trackEvent("zeega_view");
        },

        updateWindowTitle: function( info ) {
            var title = app.player.project.get("title") + " by " + app.player.project.get("authors");

            $('title').text( title );
        }

  });

});

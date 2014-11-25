/*

  ui.js

  the ui layer or skin that sits over player and controls/reacts to it
*/

define([
    "app",

    // Libs
    "backbone",

    // Modules,
    "modules/loader",
    "modules/controls",
    "modules/menu-bar-bottom",
    "modules/menu-bar-top",
    "modules/endpage",
    "modules/remix-endpage",
    "modules/pause",
    "modules/countdown"
],

function( app, Backbone, Loader, Controls, MenuBarBottom, MenuBarTop, EndPage, RemixEndpage, PauseView, CountdownView ) {

    var FADE_OUT_DELAY = 3000;

    return Backbone.Layout.extend({

        hasPlayed: false,
        el: "#main",

        initialize: function() {
            this.setWindowSize();

            app.player.on("player:pause", this.onPause, this );
            app.player.on("player:play", this.onPlay, this );

            this.loader = new Loader.View({ model: app.player });
            this.bottomBar = new MenuBarBottom({ model: app.player });
            this.topBar = new MenuBarTop.View({ model: app.player });
            this.endPage = new EndPage.View({ model: app.player });

            if (app.player.get('autoplay')) {
                this.countdown = new CountdownView({ model: app.player });
                this.insertView("#overlays", this.countdown );
            } else {
                this.controls = new Controls.View({ model: app.player });
                this.insertView("#overlays", this.controls );
            }

            this.insertView("#overlays", this.loader );
            this.insertView("#overlays", this.bottomBar );
            this.insertView("#overlays", this.topBar );
            this.insertView("#overlays", this.endPage );

            this.remixEndpage = new RemixEndpage.View({ model: app.player });
            this.insertView("#overlays", this.remixEndpage );
            
            this.render();

            $( window ).resize(function() {
                this.onResize();
            }.bind(this));

            app.player.once("player:play", this.onPlay, this );
        },

        // sets the window size lazily so we don't have to do it elsewhere
        setWindowSize: function() {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
        },

        events : {
            "mousemove": "onMouseMove",
            "resize": "onResize"
        },

        onResize: _.debounce( function() {
            this.setWindowSize();
        }, 500 ),

        onMouseMove: function( e ) {
            if ( this.hasPlayed ) {
                var pageX = e.pageX,
                    pageY = e.pageY;

                if ( pageY < 100 ) {
                    this.showMenubar();
                }
                else if ( pageY > this.windowHeight - 100 ) {
                    this.showCitationbar();
                }
            }
        },

        showMenubar: _.debounce(function() {
            this.topBar.fadeIn();
        }, 500, true ),

        showCitationbar: _.debounce(function() {
            this.bottomBar.fadeIn();
        }, 500, true ),

        onPause: function() {
            this.pause = new PauseView({ model: app.player });
            this.$("#overlays").prepend( this.pause.el );
            this.pause.render();
        },

        onPlay: function() {
            this.hasPlayed = true;
            this.topBar.fadeOut( 0 );
            this.bottomBar.fadeOut( 0 );
            if ( this.pause ) {
                this.pause.remove();
            }
        }

    });
});

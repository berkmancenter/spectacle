define([
    "app",
    "modules/citation.view",
    // Libs
    "backbone"
],

function( app, CitationView, Backbone ) {
    
    return Backbone.View.extend({
        
        timer: null,
        visible: true,
        sticky: false,
        hover: false,
        playing: false,

        remixTimer: null,
        remixVisible: false,

        template: "app/templates/menu-bar-bottom",

        className: "ZEEGA-player-citations",

        serialize: function() {
            if ( this.model.zeega ) {
                return _.extend({
                    path: "http:" + app.metadata.hostname + app.metadata.directory,
                    favorites: this.getFavorites(),
                    isEmbed: app.isEmbed(),
                    remixData: this.model.zeega.getRemixData(),

                    previousProject: this.model.zeega.getPreviousProject() ? this.model.zeega.getPreviousProject().toJSON() : false,
                    currentProject: this.model.zeega.getCurrentProject().toJSON(),
                    rootProject: this.model.zeega.projects.at(0).toJSON()
                },
                    app.metadata
                );
            }
        },

        initialize: function() {
            this.model.on("page:focus soundtrack:ready", this.updateCitations, this );
            this.model.on("pause", this.fadeIn, this );

            /*
            this.model.on("endpage_enter", this.endPageEnter, this );
            this.model.on("endpage_exit", this.endPageExit, this );
            */

            this.hover = this.model.zeega.getCurrentProject().attributes.show_metadata;

            this.model.on("change:currentProject", this.onProjectChange, this );
            app.on('resize_window', this.onWindowResize);
        },

        onWindowResize: function() {
            this.$('.citations').width($(window).width() - 250);
        },

        onProjectChange: function( project ) {
            this.render();

            this.clearRemixTimer();
            this.model.off("page:focus");

            this.model.once("page:focus", this._remix_waitForNext, this );

            this.remixTimer = setTimeout(function() { this._remix_hide(); }.bind(this), 3000 );
            this.remixVisible = true;

            var newSize = (window.innerHeight / 4) + "px";
            this.$("[data-project-id='" + this.model.zeega.getCurrentProject().id + "'] .remix-project-flag")
                .css({
                    height: newSize,
                    width: newSize
                });

            this.$("[data-project-id='" + this.model.zeega.getCurrentProject().id + "']")
                .addClass("show");
        },

        _remix_waitForNext: function( mod, e, o ) {
            this.model.once("page:focus", this._remix_hide, this );
        },

        clearRemixTimer: function() {
            if ( this.remixTimer ) clearTimeout( this.remixTimer );
            this.remixTimer = null;
        },

        _remix_hide: function(){
            this.visible = false;
            this.clearRemixTimer();
            this.$("[data-project-id='" + this.model.zeega.getCurrentProject().id + "']").removeClass("show");
        },

        getFavorites: function(){
            var count = this.model.zeega.projects.at(0).get("favorite_count"),
                html = "";

            if ( count == 1){
                html = '<i class="icon-heart icon-white"></i> ' + count + " favorite";
            } else if ( count > 1 ){
                html = '<i class="icon-heart icon-white"></i> ' + count + " favorites";
            }

            return html;
        },

        endPageEnter: function() {
            this.sticky = true;
            this.$(".citations").hide();
            this.$(".ZEEGA-home").show();
            this.show();
        },

        endPageExit: function() {
            this.sticky = false;
            this.$(".ZEEGA-home").hide();
            this.$(".citations").show();
            this.fadeOut( 0 );
        },

        updateCitations: function( page ) {
            var soundtrack = this.model.zeega.getSoundtrack();

            if ( soundtrack ) this.updateSoundtrackCitation( soundtrack );

            if ( page && page.layers ) {
                this.$(".citations ul").empty();
                var citationCount = 0;
                page.layers.each(function( layer ) {
                    if ( _.contains(["Image"], layer.get("type")) ) {
                        var citation = new CitationView({
                            parent: this,
                            model: layer
                        });

                        this.$(".citations ul").append(citation.el);
                        citation.render();
                        citationCount += 1;
                    }
                }, this );
                this.$('.citations ul li').width((96 / citationCount) + '%');
            }
        },

        updateSoundtrackCitation: function( soundtrack ) {
            this.$(".citation-soundtrack")
                .css({
                    background: "url("+ soundtrack.get("attr").thumbnail_url +")",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                })
                .show();

            this.$(".citation-soundtrack .citation-trackback")
                .attr("href", soundtrack.get("attr").attribution_uri )
                .attr("target", "blank");
        },

        events: {
            "mouseenter": "onMouseenter",
            "mouseleave": "onMouseleave",
            "click #project-play-pause": "playpause",
            "click .ZEEGA-home": "startOver",
            "click .favorite-btnz": "toggleFavorite",
            "click .profile-link": "onProfile",
            "click .play-pause": "toggleMute",
            "click .ZEEGA-fullscreen": "toggleFullscreen" 
        },

        fullscreen: false,

        toggleFullscreen: function() {
            if ( this.fullscreen ) {
                this.exitFullscreen();
            } else {
                this.requestFullScreen( app.layout.el );
            }
        },

        requestFullScreen: function(element) {
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

            if (requestMethod) {
                requestMethod.call(element);
                this.fullscreen = true;
            } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
                this.fullscreen = true;
            }
        },

        exitFullscreen: function() {

            if ( document.webkitCancelFullScreen ) {
                document.webkitCancelFullScreen();
            } else if ( document.cancelFullScreen ) {
                document.cancelFullScreen();
            } else if ( document.mozCancelFullScreen ) {
                document.mozCancelFullScreen();
            }
            this.fullscreen = false;
        },

        toggleMute: function(){
            var soundtrack = this.model.zeega.getSoundtrack();

            if ( soundtrack.visual.getAudio().paused ) {
                this.$(".pp-btn").addClass("pause");
                soundtrack.play();
                this.model.emit("mute_toggle", { state: "unmuted" });
            } else {
                this.$(".pp-btn").removeClass("pause");
                soundtrack.pause();
                this.model.emit("mute_toggle", { state: "muted" });
            }

            return false;
        },

        fadeOut: function( stay ) {
            if( this.visible && this.sticky === false ) {
                var fadeOutAfter = ( stay === 0 ) ? 0 : stay ? stay : 2000;

                if ( this.timer ) {
                    clearTimeout( this.timer );
                }
                this.timer = setTimeout(function(){
                    if ( !this.hover && app.player.state != "paused" ) {
                        this.visible = false;
                        this.$el.animate({ bottom: ( -1 - this.$(".ZEEGA-chrome-metablock").height() ) + "px" }, 500 );
                        // this.$(".ZEEGA-chrome-metablock").hide("blind",{direction:"vertical"},500);
                    }
                }.bind( this ), fadeOutAfter);
            }
        },

        fadeIn: function( stay ) {
            if( !this.visible ) {
                this.show();
                this.fadeOut( stay );
            }
        },

        show: function() {
            this.visible = true;
            if ( this.timer ) {
                clearTimeout( this.timer );
            }
            this.$el.animate({ bottom: 0 }, 500 );
            // this.$(".ZEEGA-chrome-metablock").show("blind",{direction:"vertical"},500);
        },

        onMouseenter: function() {
            this.hover = true;
        },

        onMouseleave: function() {
            this.hover = this.model.zeega.getCurrentProject().attributes.show_metadata;
            this.fadeOut();
        },

        onProfile: function(){
            app.emit("to_profile");
        },

        playpause: function() {
            if ( this.model.state == "paused") {
                this.model.play();
            } else {
                this.model.pause();
            }

            return false;
        },

        startOver: function() {
            this.model.cuePage( this.model.zeega.getFirstPage() );
            app.emit("start_over", {source: "button"});

            return false;
        }
    });

});

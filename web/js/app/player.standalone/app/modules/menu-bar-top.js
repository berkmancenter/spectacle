define([
    "app",
    // Libs
    "backbone"
],

function(app, Backbone) {
    var MenuBar = {};

    MenuBar.View = Backbone.View.extend({
        
        visible: true,
        hover: false,
        sticky: false,

        template: "app/templates/menu-bar-top",

        className: "ZEEGA-player-menu-bar",

        serialize: function() {
            var showChrome;
            if ( this.model.zeega ) {
                return _.extend({
                        remixable: true,
                        show_chrome: app.showChrome,
                        share_links: this.getShareLinks(),
                        path: "http:" + app.metadata.hostname + app.metadata.directory,
                        authenticated: app.metadata.loggedIn
                    },
                    this.model.zeega.getCurrentProject().toJSON()
                );
            }
        },

         getShareLinks: function() {
            var html,
                links = {},
                project = this.model.zeega.projects.at(0),
                webRoot = "http:" + app.metadata.hostname + app.metadata.directory;
                

            if( !_.isUndefined(this.model.zeega.projects.at(0).get("title"))){
                title = project.get("title");
            } else {
                title = "";
            }
            

            html = "<p>" + title + "</p>" +
                "<p><a href='" + webRoot + project.get("id") + "'>" +
                "<strong>►&nbsp;Play&nbsp;Slideshow&nbsp;►</strong></a>" +
                "</p><p>by&nbsp;<a href='" + webRoot + "profile/" + project.get("user_id") + "'>" + project.get("authors") + "</a></p>";

            links.tumblr = "http://www.tumblr.com/share/photo?source=" + encodeURIComponent( project.get("cover_image") ) +
                "&caption=" + encodeURIComponent( html ) +
                "&click_thru="+ encodeURIComponent( webRoot ) + project.get("id");

            links.reddit = "http://www.reddit.com/submit?url=" + encodeURIComponent( webRoot ) + project.get("id") +
                "&title=" + encodeURIComponent( title );

            links.twitter = "https://twitter.com/intent/tweet?original_referer=" + encodeURIComponent( webRoot ) + project.get("id") +
                "&text=" + encodeURIComponent( title  + " made w/ Spectacle") +
                "&url=" + encodeURIComponent( webRoot ) + project.get("id");

            links.facebook = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent( webRoot ) + project.get("id");

            return links;
        },

        initialize: function() {
            this.model.on("data_loaded", this.render, this);
            this.model.on("pause", this.fadeIn, this );
            this.model.on("endpage_enter", this.endPageEnter, this );
            this.model.on("endpage_exit", this.endPageExit, this );
            this.model.on("player:canplay", this.onCanplay, this);
            this.model.on("project:project_switch ", this.render, this );
        },

        onCanplay: function(){
            var soundtrack = this.model.zeega.getSoundtrack();

            if ( soundtrack ) {
                this.$(".ZEEGA-sound-state").show();
            }
        },
        endPageEnter: function() {
            this.sticky = true;
            this.show();
        },

        endPageExit: function() {
            this.sticky = false;
            this.fadeOut( 0 );
        },

        events: {
            "click #project-fullscreen-toggle": "toggleFullscreen",
            "mouseenter": "onMouseenter",
            "mouseleave": "onMouseleave",
            "click .project-title": "startOver",
            "click .share-network a": "onShare",
            "click .ZEEGA-tab": "onHome",
            "click .btn-remix": "onExitEvent",
            "click .btn-favorite": "toggleFavorite"
        },

        toggleFavorite: function(){
            var url;

            this.$(".btn-favorite").toggleClass("favorited");

            if ( this.model.zeega.projects.at(0).get("favorite")) {
                url = "http://" + app.metadata.hostname + app.metadata.directory + "api/projects/" + this.model.zeega.projects.at(0).id + "/unfavorite";
                this.model.zeega.projects.at(0).set({ "favorite": false });
                this.incFavorites(-1);
                app.emit("unfavorite");
            } else {
                url = "http://" + app.metadata.hostname + app.metadata.directory + "api/projects/" + this.model.zeega.projects.at(0).id + "/favorite";
                this.model.zeega.projects.at(0).set({ "favorite": true });
                this.incFavorites(1);
                app.emit("favorite");
            }
            $.ajax({ url: url, type: 'POST',  xhrFields: {withCredentials: true}, success: function(){  }  });

            return false;
        },

        incFavorites: function( inc ){
            this.model.zeega.projects.at(0).set( "favorite_count", this.model.zeega.projects.at(0).get("favorite_count") + inc );
            $(".zeega-favorite_count").html( this.getFavorites() );
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

        fadeOut: function( stay ) {
            if( this.visible && this.sticky === false ) {
                var fadeOutAfter = ( stay === 0 ) ? 0 : stay ? stay : 2000;

                if ( this.timer ) clearTimeout( this.timer );
                this.timer = setTimeout(function(){
                    if ( !this.hover && app.player.state != "paused" ) {
                        this.visible = false;
                        // this.$(".ZEEGA-tab").hide("blind",{direction:"vertical"},500);
                        this.$el.fadeOut();
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
            if ( this.timer ) clearTimeout( this.timer );
            // this.$(".ZEEGA-tab").show("blind",{direction:"vertical"},500);
            this.$el.fadeIn();
        },

        onMouseenter: function() {
            this.hover = true;
        },

        onMouseleave: function() {
            this.hover = false;
            this.fadeOut();
        },

        startOver: function() {
            this.model.cueFrame( this.model.get("startFrame") );
            app.emit("start_over", {source: "title"});

            return false;
        },

        onExitEvent: function( event ){
            if(event.currentTarget.className.indexOf("btn-remix")>-1){
                app.layout.bottomBar.toggleMute();
                app.emit("exit_remix", {"view":"menu-bar-top"});
            } else if(event.currentTarget.className.indexOf("btnz-join")>-1){
                app.emit("exit_create", {"view":"menu-bar-top"});
            }
        },

        onShare: function( event ){
            app.emit( "share", {
                "type": event.currentTarget.name
            });
        },

        onHome: function( ){
            app.emit("to_home");
        }

    });

    return MenuBar;
});

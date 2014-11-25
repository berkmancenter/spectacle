define([
    "app",
    "player/modules/player"
],

function( app, Player ) {

    return Backbone.View.extend({

        firstPreview: true,

        template: "app/templates/project-head",

        serialize: function() {
            return _.extend({
                    web_root: app.getWebRoot(),
                    share_links: this.getShareLinks()
                },
                app.metadata,
                app.zeega.getCurrentProject().toJSON(),
                {
                    userThumbnail: app.metadata.userThumbnail === "" ? "/images/default_profile.jpg" : app.metadata.userThumbnail
                }
            );
        },

        getShareLinks: function() {
            var title, html,
                links = {},
                currentProject = app.zeega.getCurrentProject(),
                webRoot = app.getWebRoot();

            if(_.isUndefined( this.$("#project-caption").val()) ){
                title = app.zeega.getCurrentProject().get("title");
            } else {
                title = this.$("#project-caption").val();
            }

            html = "<p>" + title + "</p>" +
                "<p><a href='" + webRoot + currentProject.get("id") + "'>" +
                "<strong>►&nbsp;Play&nbsp;Zeega&nbsp;►</strong></a>" +
                "</p><p>by&nbsp;<a href='" + webRoot + "profile/" + currentProject.get("user_id") + "'>" + currentProject.get("authors") + "</a></p>";

            links.tumblr = "http://www.tumblr.com/share/photo?source=" + encodeURIComponent( currentProject.get("cover_image") ) +
                "&caption=" + encodeURIComponent( html ) +
                "&click_thru="+ encodeURIComponent( webRoot ) + currentProject.get("id");

            links.reddit = "http://www.reddit.com/submit?url=" + encodeURIComponent( app.getWebRoot() ) + currentProject.get("id") +
                "&title=" + encodeURIComponent( title );

            links.twitter = "https://twitter.com/intent/tweet?original_referer=" + encodeURIComponent( webRoot ) + currentProject.get("id") +
                "&text=" + encodeURIComponent( title  + " made w/ @zeega") +
                "&url=" + encodeURIComponent( webRoot ) + currentProject.get("id");

            links.facebook = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent( app.getWebRoot() ) + currentProject.get("id");

            return links;
        },

        initialize: function() {
            app.zeega.getCurrentProject().on("sync", this.onSync, this );
        },

        onSync: function() {
            this.updateShareUrls();
            this.$(".project-cover").css({
                background: "url(" + app.zeega.getCurrentProject().get("cover_image") + ")",
                backgroundSize: "cover"
            });
        },

        updateShareUrls: function() {

            _.each( this.getShareLinks(), function(value, key){
                this.$(".share-" + key ).attr("href", value );
            });
        },

        afterRender: function() {
            if ( app.zeega.getCurrentProject().get("cover_image") === "" ) {
                this.model.on("layer_added", this.onLayerAdded, this );
            }

            this.makeCoverDroppable();
        },

        makeCoverDroppable: function() {
            this.$(".project-cover").droppable({
                accept: ".item",
                tolerance: "pointer",
                hoverClass: "can-drop",
                drop: function( e, ui ) {
                    if ( _.contains( ["Image"], app.dragging.get("layer_type") )) {

                        this.updateCoverImage( app.dragging.get("uri") );
                    }
                }.bind( this )
            });
        },

        onLayerAdded: function( layer ) {
            if ( app.zeega.getCurrentProject().get("cover_image") === "" ) {
                if ( layer.get("type") == "Image" ) {
                    this.updateCoverImage( layer.getAttr("uri") );
                }
            } else {
                this.model.off("layer_added");
            }
        },

        updateCoverImage: function( url ) {
            var currentProject = app.zeega.getCurrentProject();

            currentProject.save("cover_image", url );

            tumblr_caption = "<p><a href='" + app.getWebRoot() + currentProject.get("id") + "'><strong>Play&nbsp;► " +
                            currentProject.get("title") + "</strong></a></p><p>A Zeega by&nbsp;<a href='" +
                            app.getWebRoot() + "profile/" + currentProject.get("user_id") + "'>" + currentProject.get("authors") + "</a></p>";


            tumblr_share = "source=" + encodeURIComponent( currentProject.get("cover_image") ) +
                            "&caption=" + encodeURIComponent( tumblr_caption ) +
                            "&click_thru="+ encodeURIComponent( app.getWebRoot() ) + currentProject.get("id");
            this.$("#tumblr-share").attr("href", "http://www.tumblr.com/share/photo?" + tumblr_share );

        },

        events: {
            "click .project-share": "toggleShareGrave",
            "click .editor-help": "initHelpSequence",
            "keypress .project-info": "onTitleKeyup",
            "blur .project-info": "onBlur",
            "click .project-preview": "projectPreview",

            "click .close-grave": "closeGrave",
            "mousedown .text-box": "onBoxFocus",
            "click .share-zeega": "showShare",
            "click .embed-zeega": "showEmbed",
            "change #autoplay": "onAutoplayChange",
            "change #show-metadata": "onShowMetadataChange",
            "keyup #autoplay-duration": "onAutoplayDurationKeypress",
            "click .slideshow-zeega": "showSlideshow",
            "keyup #project-caption": "onCaptionKeypress",
            "blur #project-caption": "updateShareUrls",
            "click .share-network a": "onShare",
            "click .profile-link": "onProfile",
            "click .ZEEGA-tab": "onHome"
        },

        onShare: function( event ){
            app.emit( "share", {
                "type": event.currentTarget.name
            });
        },

        initHelpSequence: function() {
            if ( app.layout.initialInstructions.pointing ) {
                app.layout.initialInstructions.cancel();
                app.emit("help",{
                    action: "hide"
                });
            } else {
                app.layout.initialInstructions.startPointing();
                app.emit("help",{
                    action: "show"
                });
            }
        },

        showEmbed: function() {
            this.$(".share-zeega, .share-network, .slideshow-zeega, .share-slideshow").removeClass("active");
            this.$(".embed-zeega, .share-embed").addClass("active");
        },

        showSlideshow: function() {
            this.$(".share-zeega, .share-network, .share-embed, .embed-zeega").removeClass("active");
            this.$(".slideshow-zeega, .share-slideshow").addClass("active");
        },

        showShare: function() {
            this.$(".embed-zeega, .share-embed, .slideshow-zeega, .share-slideshow").removeClass("active");
            this.$(".share-zeega, .share-network").addClass("active");
        },

        onBoxFocus: function( event ) {
            $(event.target).select();
            app.emit( "share", {
                "type": event.currentTarget.name
            });
            return false;
        },

        closeGrave: function() {
            this.$(".share-grave").slideUp("fast");
        },

        toggleShareGrave: function() {

            app.zeega.setCurrentLayer( null );

            if( !this.$(".share-grave").is(":visible") ) {
                app.emit("grave_open", null );
            } else {
                app.emit("grave_closed", null );
            }
            this.$(".share-grave")
                .toggleClass("active")
                .slideToggle("fast");
        },

        onTitleKeyup: function( e ) {
            if ( e.which == 13 ) {
                this.$(".project-info").blur();
                return false;
            }
        },

        onAutoplayChange: function ( e ) {
            this.autoplaySave();
        },

        onShowMetadataChange: function ( e ) {
            this.showMetadataSave();
        },

        onAutoplayDurationKeypress: function ( e ) {
            this.autoplayDurationSave();
        },

        onCaptionKeypress: function( e ) {
            this.captionSave();
        },

        autoplaySave: function( e ) {
            app.zeega.getCurrentProject().save('autoplay', this.$('#autoplay').prop('checked'));
        },

        showMetadataSave: function( e ) {
            app.zeega.getCurrentProject().save('show_metadata', this.$('#show-metadata').prop('checked'));
        },

        autoplayDurationSave: _.debounce(function() {
            app.zeega.getCurrentProject().save("autoplay_duration", parseInt(this.$("#autoplay-duration").val(), 10) );
        }, 1000 ),

        captionSave: _.debounce(function() {
            app.zeega.getCurrentProject().save("title", this.$("#project-caption").val() );
        }, 1000 ),

        onMenuClick: function( e ) {
            var $target = $(e.target).closest("a");

            if ( !$target.hasClass("disabled") ) {
                this[ $target.data("action") ]();
            }
        },

        projectPreview: function() {
          // I turned this into a link instead.
            return true;
        },

        onEndpageEnter: function( layer ) {
            var endView;

            layer.visual.$el.empty();

            if ( app.player.zeega.getNextPage() ) {

                endView = new Backbone.View({
                    template: "app/templates/endpage.remix",
                    className: "ZEEGA-remix-endpage",
                    serialize: function() {
                        return app.player.zeega.getCurrentProject().toJSON();
                    }
                });

                layer.visual.$el.append( endView.el );
                endView.render();
            }

        },

        onEndpageExit: function( layer ) {
            layer.visual.$el.empty();
        },

        onPlayerDestroy: function() {
            // switch instance of Zeega to the editor version and release the player version!!
            app.zeega.injectZeega( app.oldZeega );
            $("body").unbind("keyup.player");
            app.emit("project_preview_ended", null );
            app.player = null;
            // this.stopListening( app.player );
        },

        onBlur: function() {
            if ( this.model.project.get("title") != this.$(".project-info").text() ) {
                this.model.project.save("title", this.$(".project-info").text() );
            }
        },

        onProfile: function(){
            app.emit("to_profile");
        },

        onHome: function(){
            app.emit("to_home");
        }


    });

});

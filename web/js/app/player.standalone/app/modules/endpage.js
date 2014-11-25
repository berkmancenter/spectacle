define([
    "app",
    // Libs
    "backbone"
],

function(app, Backbone) {

    // Create a new module
    var EndPage = {};

    // This will fetch the tutorial template and render it.
    EndPage.View = Backbone.View.extend({
        
        viewed: false,
        visible: false,
        hover: false,
        sticky: false,

        template: "app/templates/endpage",

        className: "ZEEGA-end-page",

        initialize: function() {
            if ( app.isEmbed() ) this.template = "app/templates/endpage-embed";

            this.model.on("endpage_enter", this.endPageEnter, this );
            this.model.on("endpage_exit", this.endPageExit, this );
            this.relatedProjects = $.parseJSON( window.relatedProjectsJSON ).projects;
        },

        serialize: function() {
            if ( this.model.zeega.getCurrentProject() ) {
                return _.extend({
                        path: app.getWebRoot(),
                        projects: this.relatedProjects,
                        authenticated: app.metadata.loggedIn
                    },
                    this.model.zeega.getCurrentProject().toJSON()
                );
            }
        },

        events: {
            "click .create-zeega, .watch-more": "onExitEvent"
        },

        onExitEvent:function(event){
            if(event.currentTarget.className.indexOf("watch-more")>-1){
                app.emit("exit_watch_more", {"view":"endpage"});
            } else {
                app.emit("exit_create", {"view":"endpage"});
            }
        },
        onCreateZeegaRegister:function(a,b){
            console.log(a,b);
        },

        onWatchMore:function(a,b){
            console.log(a,b);
        },

        endPageEnter: function() {
            if ( !this.model.zeega.getNextPage() ) {
                this.show();
                $(".btn-remix").addClass("remix-endpage");
                _.delay(function() {
                    $(".btn-remix .content").text("reply to this Zeega");
                }, 300 );
            }
        },

        endPageExit: function() {
            this.hide();
            $(".btn-remix").removeClass("remix-endpage");
            $(".btn-remix .content").text("reply");
        },

        show: function(){
            this.$el.fadeIn("fast");
            if( !this.viewed ){
                this.viewed = true;
                app.emit("viewed_to_end");
            }
        },
        hide: function(){
            this.$el.fadeOut("fast");
        }

    });

    return EndPage;
});



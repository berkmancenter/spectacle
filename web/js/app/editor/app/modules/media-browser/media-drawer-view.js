define([
    "app",
    "modules/media-browser/media-library",
    "modules/media-browser/search-view",
    "backbone"
],

function( app, MediaLibrary, SearchView ) {

    return Backbone.View.extend({

        el: null,
        template: "app/templates/media-drawer",

        initialize: function() {
            this.model = new MediaLibrary();
        },

        afterRender: function() {
            if ( app.zeega.isRemix() ){
                this.model.setAPI( "Remix" );
                this.$(".socialz-remix").addClass("socialz-white");
                this.$(".socialz-remix").closest("a").addClass("active");
                this.model.getAPI().useBootstrapData();

            } else {
                this.model.setAPI( "Via" );
                this.$(".socialz-harvard-via").addClass("socialz-white");
                this.$(".socialz-harvard-via").closest("a").addClass("active");
                this.model.getAPI().useBootstrapData();
            }
            this.setView();
        },
        
        setView: function( ) {
            var searchView = new SearchView({model: this.model.getAPI() });

            this.$(".ZEEGA-items").empty().append( searchView.el );
            searchView.render();
            searchView.search( app.mediaSearchQuery );
        },

        serialize: function() {
            return _.extend({},
                this.model.toJSON(),
                { remix: app.zeega.isRemix() }
            );
        },

        events: {
            "click .media-toggle": "onMediaToggle"
        },
        onMediaToggle: function(event){
            var api = $(event.target).closest("a").data("api");

            app.emit("media_drawer_toggle", api );
            
            this.$(".media-toggle").removeClass("active");
            this.$(".media-toggle i").removeClass("socialz-white");
            $(event.target).closest("a").addClass("active");
            $(event.target).closest("a").find("i").addClass("socialz-white");

            this.$el.find(".search-box").attr("placeholder", "search " + api);
            

            this.model.setAPI( api );
            this.setView();
            

            // if( api === "Soundcloud" ){
            //     this.$el.addClass("list");
            // } else {
            //     this.$el.removeClass("list");
            // }
            return false;
        }
    });

});

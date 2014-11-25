 define([
    "app",
    "modules/sidebar",
    "modules/feed",
    "modules/cover",
    "modules/footer",
    "modules/zeega-projects.collection",
    "backbone"
],

function( app, SidebarView, FeedView, Cover, FooterView, ZeegaCollection ) {

    
    return Backbone.Layout.extend({

        el: "#main",
        template: "layout-main",

        beforeRender: function(){
            
            zeegas = new ZeegaCollection( app.metadata );
            
            if( _.isUndefined( window.profileData )){
                this.insertView( ".cover-wrapper", new Cover.HomeView() );
            } else {
                this.insertView( ".cover-wrapper", new Cover.ProfileView() );
            }
            
            this.insertView( ".content", new FeedView({ collection: zeegas }) );
            this.insertView( ".content", new SidebarView() );
            this.insertView( ".content", new FooterView() );
        }
    });

});

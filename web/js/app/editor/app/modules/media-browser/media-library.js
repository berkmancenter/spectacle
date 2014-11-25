define([
    "app",
    "modules/media-browser/api/zeega",
    "modules/media-browser/api/flickr",
    "modules/media-browser/api/tumblr",
    "modules/media-browser/api/soundcloud",
    "modules/media-browser/api/giphy",
    "modules/media-browser/api/via",
    "modules/media-browser/api/oasis",
    "modules/media-browser/api/remix",
    "backbone"
],

function( app, ZeegaSearch, FlickrSearch, TumblrSearch, SoundcloudSearch, GiphySearch, ViaSearch, OasisSearch, RemixSearch ) {

    return Backbone.Model.extend({

        defaults:{
            Flickr: new FlickrSearch(),
            Zeega: new ZeegaSearch(),
            Tumblr: new TumblrSearch(),
            Soundcloud: new SoundcloudSearch(),
            Giphy: new GiphySearch(),
            Via: new ViaSearch(),
            Oasis: new OasisSearch(),
            currentAPI: "Favorites"
        },
        
        initialize: function() {
            if ( app.zeega.isRemix() ){
                this.set("Remix", new RemixSearch() );
            }
            app.mediaSearchQuery = "";
        },

        setAPI: function( api ){
            this.set ( "currentAPI", api );
        },

        getAPI: function(){
            return this.get( this.get("currentAPI") );
        },

        more: function(){
            this.get( this.get("currentAPI")).more();
        }

    });

});

define([
    "app",
    "modules/media-browser/search-results-collection",
     "modules/media-browser/item-model",
    "backbone"
],

function( app, MediaCollection, Item ) {

    return Backbone.Model.extend({

        api: "",
        mediaCollection: null,
        apiUrl: "",
        favUrl: "",
        allowSearch: false,

        defaults: {
            urlArguments: {

            },
            title: "",
            placeholder: "",
            searchQuery: null
        },

        initialize: function() {
            this.mediaCollection = new MediaCollection();
            this.mediaCollection.searchModel = this;
            this._initialize();
        },

        _initialize: function() {

        },

        getQuery: function(){
            return this.get("urlArguments").q;
        },

        getRawQuery: function(){
            return this.get("searchQuery");
        },

        resultsReturned: function(){

            return !this.mediaCollection.noResults;
        },

        useBootstrapData: function(){
            //cleanup sloppy layer data
            var mediaData = jQuery.parseJSON( window.mediaJSON ),
                items = [],
                uris = [],
                i = 0;

            _.each(mediaData.items, function(item){
                if(!_.contains( uris, item.uri )){
                    item.id = i;
                    if(_.isNull(item.thumbnail_url)){
                        item.thumbnail_url = item.uri;
                    }
                    items.push( item );
                    uris.push( item.uri );
                    i++;
                }
            });
            this.mediaCollection.add( items );

            if(this.api == "Favorites" && window.audioJSON ){
                var parsedJSON = $.parseJSON( window.audioJSON );
                    if (parsedJSON.items.length > 0) {
                        this.mediaCollection.add( new Item(parsedJSON.items[0]), { at: 0 } );
                    }
            }
        },

        search: function( query ){

            if( _.isUndefined( query ) || _.isNull( query ) ){
                query = "";
            }

            if( query !== this.get( "searchQuery" ) ){
                this.set( "searchQuery", query );
                this._search( query );
                if( query !== "" ){
                    app.emit("media_search",{
                        "query": query,
                       "api": this.api
                    });
                }
            }
            
        },
        more: function(){
            this._more();
        },
        _more: function(){

        },
        _search: function( query ){

            var args = this.get("urlArguments");

            if( query !== args.q ) {
                args.q = query;
            }

            this.set("urlArguments", args );
            this.mediaCollection.fetch();
        },


        onSync: function( collection ) {
            this.mediaBrowser.trigger( "media_ready", collection );
        }
    });

});

define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {

    return SearchModel.extend({

        api: "Zeega",
        allowSearch: false,
        apiUrl: app.getApi() + "items/search?",
        defaults: {
                urlArguments: {
                    collection: "",
                    type: "",
                    page: 1,
                    q: "",
                    limit: 48,
                    data_source: "db",
                    user: function() {
                        return app.getUserId();
                },
                sort: "date-desc"
            },
            title: "My Media",
            headline: "My Media",
            placeholder: "search your media",
            searchQuery: null
        },

         _initialize: function(){
            this.mediaCollection.url = function() {
                var url = this.searchModel.apiUrl;

                _.each( this.searchModel.toJSON().urlArguments, function( value, key ) {
                    if ( value !== "" && value !== null ) {
                        url += key + "=" + ( _.isFunction( value ) ? value() : value ) + "&";
                    }
                });
                console.log(url);
                return url;
            };

            this.mediaCollection.parse = function( res ) {
                var photos = res.items,
                    count = 1;
                
                _.each( photos, function( photo ){
                    photo.allowDelete = 1;
                    count++;
                });

                this.itemsCount = res.items_count;

                if( photos.length == 48 ){
                    this.more = true;
                } else {
                    this.more = false;
                }

                return photos;
            };
        },
        
        _search: function( query ){
            var args = this.get("urlArguments");
            if( query !== args.q ) {
                args.q = query;
            }
            args.page = 1;
            this.set("urlArguments", args );
            this.mediaCollection.fetch();
        },

        _more: function(){
            
            var args = this.get("urlArguments");
            args.page += 1;
            this.set("urlArguments", args );
            this.mediaCollection.fetch({remove: false});
        }
    });

});

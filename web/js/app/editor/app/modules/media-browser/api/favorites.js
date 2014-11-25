define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {

    return SearchModel.extend({

        api: "Favorites",
        mediaCollection: null,
        apiUrl: app.getAPI + "items/search?",
        favUrl: app.getApi() + "items/search?type=Image&user=" + app.metadata.favId + "&limit=48",
        allowSearch: false,

        defaults: {
                urlArguments: {
                    collection: "",
                    type: "Image",
                    page: 1,
                    q: "",
                    limit: 48,
                    user: 1,
                    sort: "date-desc"
            },
            title: "Zeega",
            headline: "Sound and GIFs of the day",
            placeholder: "search Zeega favorites",
            searchQuery: null
        },

        _initialize: function(){
            // var d = new Date(),
            //     weekday = new Array(7);

            // weekday[0]="Sunday";
            // weekday[1]="Monday";
            // weekday[2]="Tuesday";
            // weekday[3]="Wednesday";
            // weekday[4]="Thursday";
            // weekday[5]="Friday";
            // weekday[6]="Saturday";

            // this.set("headline", "Zeega's favorites from " + weekday[d.getDay()]);

            this.mediaCollection.url = function() {
                var url;

                if( this.searchModel.getQuery() === "" && this.searchModel.api != "Zeega" ){
                    
                    url = this.searchModel.favUrl;

                } else {

                    url = this.searchModel.apiUrl;
                    _.each( this.searchModel.toJSON().urlArguments, function( value, key ) {
                        if ( value !== "" && value !== null ) {
                            url += key + "=" + ( _.isFunction( value ) ? value() : value ) + "&";
                        }
                    });
                }
                return url;
            };
        },

        _search: function( query ){

            if( this.mediaCollection.length === 0 ){
                var args = this.get("urlArguments");

                if( query !== args.q ) {
                    args.q = query;
                }

                this.set("urlArguments", args );
                this.mediaCollection.fetch();
            }
            
        }
    });

});

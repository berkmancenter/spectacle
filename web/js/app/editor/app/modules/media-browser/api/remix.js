define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {

    return SearchModel.extend({

        api: "Remix",
        mediaCollection: null,

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
            title: "Remix",
            headline: "Remix Media",
            placeholder: "",
            searchQuery: null
        },

        _initialize: function() {
            this.mediaCollection.url = function(){
                return "";
            };
        },
    
        _search: function(){

        }

    });

});

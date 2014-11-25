define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {


    return SearchModel.extend({
        
        api: "Tumblr",
        apiUrl: app.getApi() + "items/parser?",
        favUrl: app.getApi() + "items/search?archive=Tumblr&type=Image&user=" + app.metadata.favId + "&limit=48&sort=date-desc",
        allowSearch: true,
        defaults: {
            urlArguments: {
                url: "",
                tag: ""
            },
            title: "Tumblr",
            headline: "Favorites from Tumblr",
            placeholder: "search Tumblr posts",
            searchQuery: null
        },
        _initialize: function(){
            this.mediaCollection._parse = function(res){
                var photos = res.items,
                    count = 1;
                
                _.each( photos, function( photo ){
                    if(!_.isUndefined(photo.attributes.id)){
                        photo.id = photo.attributes.id;
                    } else {
                        photo.id = count;
                    }
                    count++;
                });

                this.more = true;
                return photos;
            };
        },

        getQuery: function(){
            return this.get("urlArguments").tag;
        },

        _search: function( query ){

            var args = this.get("urlArguments");

            args.before = new Date().getTime();
            args.tag = query.replace( / /g, "-" );
            if( args.tag !== "" ){
                args.tag = args.tag  + "-gif";
            }
            args.url = "http://www.tumblr.com/tagged/" + args.tag + "/before/" + args.before;

            this.set("urlArguments", args );
            this.mediaCollection.pumpkin ="orange";
            this.mediaCollection.fetch();
            
        },
        
        _more: function( query ){

            var args = this.get("urlArguments");

            args.before = this.mediaCollection.at(this.mediaCollection.length - 1).get("attributes").timestamp;

            args.url = "http://www.tumblr.com/tagged/" + args.tag + "/before/" + args.before;

            this.set("urlArguments", args );
            this.mediaCollection.fetch({remove:false});
        }

    });

       

});

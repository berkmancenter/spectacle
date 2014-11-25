define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {


    return SearchModel.extend({
        
        api: "Giphy",
        apiUrl: app.getApi() + "items/parser?",
        allowSearch: true,
        favUrl: app.getApi() + "items/search?archive=Giphy&type=Image&user=" + app.metadata.favId + "&limit=48&sort=date-desc",


        defaults: {
            urlArguments: {
                url: "",
                tag: "",
                offset: 0
            },
            title: "Giphy",
            headline: "Favorites from Giphy",
            placeholder: "search Giphy gifs",
            searchQuery: null
        },

        _initialize : function(){

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
                
                if( res.request.parser && res.request.parser.more ){
                    this.more = true;
                } else {
                    this.more = false;
                }
                
                return photos;
            };
        },

        getQuery: function(){
            return this.get("urlArguments").tag;
        },
        
        _search: function( query ){

            var args = this.get("urlArguments");

         
            args.offset = 0;
            
            if( query !== "" ){
                args.tag = query.replace( / /g, "-" );
            }
            
            

            args.url = "http://giphy.com/tags/" + args.tag + "/offset/" + args.offset;

            this.set("urlArguments", args );
            this.mediaCollection.fetch();
            
        },
        _more: function(){

            var args = this.get("urlArguments");
            args.offset += 50;
            args.url = "http://giphy.com/tags/" + args.tag + "/offset/" + args.offset;

            this.set("urlArguments", args );
            this.mediaCollection.fetch({remove: false});
        }
    });
});

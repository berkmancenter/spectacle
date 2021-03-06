define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {


    return SearchModel.extend({
        
        api: "Harvard",
        apiUrl: app.getApi() + "items/parser?",
        allowSearch: true,
        favUrl: app.getApi() + "items/search?archive=HarvardVia&type=Image&user=" + app.metadata.favId + "&limit=48&sort=date-desc",


        defaults: {
            urlArguments: {
                url: "",
                tag: "",
                offset: 0
            },
            title: "Harvard",
            headline: "Favorites from Harvard",
            placeholder: "search Harvard images",
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

         
            args.offset = 1;
            
            if( query !== "" ){
                args.tag = query.replace( / /g, "-" );
            }
            args.url = "http://via.lib.harvard.edu/tags/" + args.tag + "/offset/" + args.offset;

            this.set("urlArguments", args );
            this.mediaCollection.fetch();
            
        },
        _more: function(){

            var args = this.get("urlArguments");
            args.offset += 1;
            args.url = "http://via.lib.harvard.edu/tags/" + args.tag + "/offset/" + args.offset;

            this.set("urlArguments", args );
            this.mediaCollection.fetch({remove: false});
        }
    });
});

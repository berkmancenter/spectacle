define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {


    return SearchModel.extend({
        
        api: "Flickr",
        apiUrl: "https://secure.flickr.com/services/rest/?",
        
        favUrl: "https://secure.flickr.com/services/rest/?nojsoncallback=1&format=json&method=flickr.interestingness.getList&extras=owner_name&per_page=100&api_key=97ac5e379fbf4df38a357f9c0943e140",
        allowSearch: true,

        defaults: {
            urlArguments: {
                nojsoncallback: "1",
                format: "json",
                method: "flickr.photos.search",
                extras: "owner_name",
                per_page: "100",
                api_key: "97ac5e379fbf4df38a357f9c0943e140",
                text: "",
                safe_search: "1",
                privacy_filter: "1",
                license: "1,2,4,5,7,8"
    
            },
            title: "Flickr",
            placeholder: "search Flickr photos",
            headline: "Favorites from Flickr",
            searchQuery:  null
        },

        _initialize: function(){
            this.mediaCollection._parse = function( res ) {

                if(!_.isUndefined( res.items_count )){
                    this.itemsCount = res.items_count;

                    return res.items;
                }


                var items =[],
                    item;

                _.each( res.photos.photo, function( photo ){

                    item = {};
                    item.id = photo.id;
                    item.layer_type = "Image";
                    item.media_type = "Image";
                    item.archive = "Flickr";
                    item.title = photo.title;
                    item.thumbnail_url = "https://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" +
                                        photo.id + "_" + photo.secret + "_s.jpg";
                    item.uri = "https://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" +
                                        photo.id + "_" + photo.secret + ".jpg";
                    item.attribution_uri =  "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
                    item.media_user_realname = photo.owner_name;
                    items.push( item );
                });

                if( res.photos.page < res.photos.pages ){
                    this.more = true;
                } else {
                    this.more = false;
                }

                return items;
            };

        },

        getQuery: function(){
            return this.get("urlArguments").text;
        },
        _search: function( query ){

            var args = this.get("urlArguments");
            args.page = 1;
            args.text = query;
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

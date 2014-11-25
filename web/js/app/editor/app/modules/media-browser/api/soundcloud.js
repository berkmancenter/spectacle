define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {


    return SearchModel.extend({
        
        api: "Soundcloud",
        apiUrl: "https://api.soundcloud.com/tracks.json?",
        favUrl: app.getApi() + "items/search?archive=SoundCloud&type=Audio&user=" + app.metadata.favId + "&limit=48&sort=date-desc",
        
        allowSearch: true,
        defaults: {
            urlArguments: {
                callback: "?",
                q: "",
                consumer_key: "lyCI2ejeGofrnVyfMI18VQ",
                license: "to_modify_commercially",
                sharing: "public"
            },
            title: "Soundcloud",
            headline: "Favorites from Soundcloud",
            placeholder: "search SoundCloud audio",
            searchQuery: null
        },

        _initialize:function(){

            this.mediaCollection._parse = function(res){
                var items = [],
                    item,
                    count =1;

                if(!_.isUndefined( res.items_count )){
                    this.itemsCount = res.items_count;

                    return res.items;
                }

                _.each( res, function( track ){
                    item = {};
                    item.id = count;
                    count++;
                    item.layer_type ="Audio";
                    item.media_type = "Audio";
                    item.archive = "SoundCloud";
                    item.title = track.title;
                    item.media_creator_realname = track.user.username;

                    if( !_.isNull( track.artwork_url )){
                        item.thumbnail_url = track.artwork_url;
                    } else if( !_.isNull( track.user.avatar_url )){
                        item.thumbnail_url = track.user.avatar_url;
                    } else {
                        item.thumbnail_url = track.waveform_url;
                    }

                    
                    item.uri = track.stream_url + "?consumer_key=lyCI2ejeGofrnVyfMI18VQ";
                    item.attribution_uri =  track.permalink_url;
                    item.media_user_realname = track.user.username;
                    item.archive = "SoundCloud";

                    if( track.streamable ){
                        items.push( item );
                    }
                    
                });
                this.more = true;
                return items;
            };
        },


        getQuery: function(){
            return this.get("urlArguments").q;
        },
        _search: function( query ){

            var args= this.get("urlArguments");

                args.offset = 0;
                args.q = query;
                this.set("urlArguments", args );
                this.mediaCollection.fetch();
            
        },
        _more: function(){
            
            var args = this.get("urlArguments");
            args.offset += 50;
            this.set("urlArguments", args );

            this.mediaCollection.fetch({remove: false});
        }
    });
});

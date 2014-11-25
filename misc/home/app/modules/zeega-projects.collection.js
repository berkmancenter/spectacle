define([
    "app",
    "modules/zeega-viewer",
    "modules/zeega-card.view",
    "backbone"
],

function( app, ZeegaViewer, ZeegaCardView ) {

    var ZeegaItem = Backbone.Model.extend({
        url: function(){
            var https = app.metadata.api.replace("https", "http").replace("http","https");
            return https + "projects/" + this.id;
        },
        initialize: function(){
            this.card = new ZeegaCardView({ model: this });
        }
    });

    return Backbone.Collection.extend({

        model: ZeegaItem,
        page: 1,
        tags: null,
        user: null,
        limit: 10,

        initialize: function( options ){
            _.extend( this, options );
        },
        
        url: function() {
            var url =  app.metadata.api + "projects/search?limit=" + this.limit + "&page=" + this.page;
 
            if( this.profileId !== "" ){
                url += "&user=" + this.profileId;
                url += "&sort=date-created-desc";
            }
            else if( this.tags !== "" && this.tags !== "realtime" ){
                url += "&tags=" + this.tags;
                url += "&sort=date-tags-updated-desc";
            }

            return url;
        },

        parse: function( response ) {
            if( response.projects.length == this.limit ){
                this.more = true;
            } else {
                this.more = false;
                $(".footer").show();
            }
            return response.projects;
        }

    });

});

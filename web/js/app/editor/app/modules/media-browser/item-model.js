define([
    "app",
    "modules/media-browser/item-view",
    "modules/media-browser/audio-item-view",
    "backbone"
],

function( app, ItemView, AudioItemView ) {

    return Backbone.Model.extend({
        
        view: null,
        defaults: {
            allowDelete: 0
        },
        url: function(){
            var url = app.getApi() + "items/" + this.id;

            return url;
        },
        
        initialize: function( attr ) {

            if( attr.media_type == "Audio"){
                this.view = new AudioItemView({ model: this });
            } else {
                this.view = new ItemView({ model: this });
            }
            
        }
    });

});

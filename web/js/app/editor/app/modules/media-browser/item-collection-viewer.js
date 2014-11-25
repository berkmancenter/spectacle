define([
    "app",
    "modules/views/modal",
    "modules/views/frame",
    "modules/media-browser/item-viewer-image",
    "modules/media-browser/item-viewer-audio",

    "backbone"
],

function( app, Modal, FrameView, ImageView, AudioView, VideoView, YoutubeView ) {


    return Backbone.View.extend({

        start: 0,
        index: 0,
        currentItem: null,

        template: "app/templates/item-collection-viewer",

        className: "ZEEGA-modal ZEEGA-item-collection-viewer",

        initialize: function() {
            this.start = this.options.start;
        },

        init: function( startIndex ) {
            this.start = startIndex;
            this.goToItem( startIndex );
        },

        afterRender: function() {
            $("#main").addClass("modal");
            this.goToItem( this.start );
            this.listen();
        },

        goToItem: function( index ) {
            var item = this.collection.at( index );

            if ( this.currentItem ) {
                this.currentItem.itemView.exit();
            }
            this.index = index;
            this.currentItem = item;
            this.$(".modal-title").text( item.get("title") );
            this.$(".modal-description").text( item.get("description") || 'No Description');

            if ( _.isUndefined( item.itemView ) ) {
                if ( item.get("layer_type") == "Image") {
                    item.itemView = new ImageView({ model: item });
                } else if ( item.get("layer_type") == "Audio") {
                    item.itemView = new AudioView({ model: item });
                } else if ( item.get("layer_type") == "Youtube") {
                    item.itemView = new YoutubeView({ model: item });
                } 
            }
            // just render item.itemView

            if( item.itemView.el ){
               this.$(".modal-body").html( item.itemView.el );
                item.itemView.render();
                app.emit("view_item",{
                    type: item.get("layer_type"),
                    source: item.get("archive"),
                    title: item.get("title") ? item.get("title") : "none",
                    description: item.get("description") ? item.get("description") : "none" 
                });
            } else {
                return false;
            }
            
        },

        listen: function() {
            $("body").bind("keyup.modal", function( e ) { this.keyup( e ); }.bind( this ));
        },

        unlisten: function() {
            $("body").unbind("keyup.modal");
        },

        events: {

            "click .modal-close": "close",
            "click .prev": "prev",
            "click .next": "next",
            "click .add-to-frame": "addToFrame",
            "click .delete-item": "deleteItem",
            "click": "onClick"
        },

        onClick: function( e ){
            if( $( e.target ).attr("class") == "ZEEGA-modal ZEEGA-item-collection-viewer" ){
                this.close();
            }
        },

        keyup: function( e ) {
            if ( e.which == 37 ) { // left
                this.prev();
            } else if ( e.which == 39 ) { // right
                this.next();
            } else if ( e.which == 27 ) { // esc
                this.close();
            }
        },

        prev: function() {
            if ( this.index > 0 ) {
                this.goToItem( this.index - 1 );
            }
        },

        next: function() {
            if ( this.collection.length > this.index + 1 ) {
                this.goToItem( this.index + 1 );
            }
        },

        addToFrame: function() {

            if ( this.collection.at( this.index ).get("layer_type") == "Audio" ) {
                if ( !app.zeega.isRemix() ) {
                    app.layout.soundtrack.updateWaveform( this.collection.at( this.index ).get("thumbnail_url") );
                    app.emit("soundtrack_added", this.collection.at( this.index ) );
                    app.zeega.getCurrentProject().setSoundtrack( this.collection.at( this.index ), app.layout.soundtrack, { source: "add-to-page" } );
                }
            } else {
                app.zeega.getCurrentPage().addLayerByItem( this.collection.at( this.index ), { source: "add-to-page" } );
            }
            this.close();
        },

        close: function() {
            this.unlisten();
            $("#main").removeClass("modal");
            this.$el.fadeOut(function() {
                this.remove();
                this.$el.attr("style", "");
            }.bind( this ));
        },

        deleteItem: function(){
            this.currentItem.destroy();
            this.goToItem( this.index );
        }

    });

});

define([
    "app",
    "backbone"
],

function( app ) {


    return Backbone.Layout.extend({

        template: "zeega-viewer",
        className: "zeega-viewer",
        
        events:{
            "click":"close"
        },

        initialize: function(){
            this.url = window.location.href;
            $(window).keydown($.proxy(function( e ){this.onKeydown( e );}, this) );
        },
        afterRender: function(){
            this.$("#viewer-iframe").load($.proxy(function( ){this.onViewerLoad( );}, this));
        },

        close: function() {
            window.history.pushState("", "Zeega", this.url );
            this.$el.remove();
            $(window).unbind("keydown");
        },

        onKeydown: function(e){
            if (e.keyCode == 27){
                this.close();
            }
        },
        
        onViewerLoad: function(){
            //var id = $('#viewer-iframe').attr('src').split('/')[$('#viewer-iframe').attr('src').split('/').length -1 ];
            
            window.history.pushState("", "", "/" + app.metadata.directory + this.model.id );
        },

        serialize: function() {
            return {
                path: "https:" + app.metadata.hostname + app.metadata.directory + this.model.id
            };
        }
    });


});

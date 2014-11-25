define([
    "app",
    "modules/pointers/pointer.view",
    "backbone"
],

function( app, PointerView ) {

    return Backbone.Model.extend({

        defaults: {
            listenFor: null,
            start: null, // function
            end: null, // function
            pointers: []
        },

        views: null,

        initialize: function() {
            this.collection.on("cancel", this.cancel, this );
            this.views = _.map( this.get("pointers"), function( pointer ) {
                return new PointerView({
                    parent: this,
                    model: new Backbone.Model( pointer )
                });
            }, this );
        },

        point: function() {
            app.once( this.get("listenFor"), this.stopPointing, this );
            _.each( this.views, function( view ) {
                view.show();
            });
        },

        stopPointing: function() {
            _.each( this.views, function( view ) {
                view.hide();
            });
        },

        cancel: function() {
            app.off( this.get("listenFor") );
            _.each( this.views, function( view ) {
                view.cancel();
            });
        }
    });
});

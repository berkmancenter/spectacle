define([
    "app",
    "modules/pointers/pointer.model",
    "backbone"
],

function( app, PointerModel ) {

    return Backbone.Collection.extend({

        model: PointerModel,
        index: 0,
        pointing: false,

        startPointing: function() {
            this.index = 0;
            this.point( this.at( this.index ));
            this.pointing = true;
        },

        point: function( pointer ) {
            pointer.once("end", this.pointNext, this );
            pointer.point();
        },

        pointNext: function() {
            var next;

            this.index++;
            next = this.at( this.index );

            if ( next ) {
                this.point( next );
            } else {
                this.stopPointing();
            }
        },

        stopPointing: function() {
            this.cancel();
        },

        cancel: function() {
            this.trigger("cancel");
            this.pointing = false;
            this.index = 0;
        }

    });
});

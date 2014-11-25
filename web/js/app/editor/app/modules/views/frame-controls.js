define([
    "app",
    "backbone"
],

function( app ) {

    return Backbone.View.extend({

        template: "app/templates/frame-controls",
        className: "ZEEGA-frame",

        saveAdvance: null,

        initialize: function() {
            app.zeega.on("change:currentFrame", this.onChangeFrame, this );

            this.saveAdvance = _.debounce(function() {
                app.status.get("currentFrame").saveAttr({
                    advance: parseInt( this.$("input").val() * 1000, 10 )
                });
            }.bind( this ), 1000 );
        },

        afterRender: function() {
            if ( app.status.get("currentFrame") ) {
                this.updateControls( app.status.get("currentFrame") );
            }
        },

        onChangeFrame: function( status, frameModel ) {
            this.updateControls( frameModel );
        },

        updateControls: function( frameModel ) {
            var attr = frameModel.get("attr");

            this.$("input").val("");
            this.$(".active").removeClass("active");
            if ( _.isEmpty( attr ) || attr.advance === 0 ) {
                this.$(".advance-manual").addClass("active");
            } else {
                this.$("input").val( attr.advance / 1000 );
                this.$(".advance-auto").addClass("active");
            }

        },

        events: {
            "click .advance-manual a": "goManual",
            "click .advance-auto a": "goAuto",
            "keypress input": "keypress",
            "blur input": "onInputBlur"
        },

        goManual: function() {
            this.$(".active").removeClass("active");
            this.$(".advance-manual").addClass("active");
            this.$("input").val("");
            app.status.get("currentFrame").saveAttr({ advance: 0 });
        },

        goAuto: function() {
            this.$(".active").removeClass("active");
            this.$(".advance-auto").addClass("active");
        },

        keypress: function( e ) {
            if ( e.which >= 48 && e.which <= 57 ) { // numbers
                this.saveAdvance();
                return true;
            } else if ( e.which == 13 ) {
                this.$("input").blur();
            } else {
                e.preventDefault();
                return false;
            }
        },

        onInputBlur: function() {
            this.saveAdvance();
        }
        
    });

});

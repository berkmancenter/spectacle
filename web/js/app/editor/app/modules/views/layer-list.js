define([
    "app",
    "modules/views/layer-controls",
    "common/modules/askers/asker",
    "backbone",
    "tipsy"
],

function( app, LayerControls, Asker) {

    // This will fetch the tutorial template and render it.
    return Backbone.View.extend({

        tagName: "li",
        template: "app/templates/layer-list",
        className: "ZEEGA-layer-list",

        serialize: function() {
            return this.model.toJSON();
        },

        openControls: null,

        initialize: function() {
            this.controls = new LayerControls({ model: this.model, target: this });

            this.openControls = _.debounce(function() {
                $("#main").append( this.controls.el );
                this.controls.render();
            }.bind( this ), 750, true );
        },

        afterRender: function() {
            this.listen();

            if ( app.zeega.get("copiedLayer") && app.zeega.get("copiedLayer").id == this.model.id ) {
                this.onCopyFocus();
            }

            this.$(".tooltip").tipsy({
                fade: true,
                gravity: function() {
                    return $(this).data("gravity");
                }
            });
        },

        cleanup: function() {
            this.stopListening( this.model );
        },

        listen: function() {
            this.model.on("blur", this.onBlur, this );
            this.model.on("focus", this.onFocus, this );
            this.model.on("remove", this.onRemove, this );
            this.model.on("sync", this.onSync, this );
            this.model.on("copy_focus", this.onCopyFocus, this );
            this.model.on("copy_blur", this.onCopyBlur, this );
        },

        events: {
            "click .action": "doAction",
            "click": "selectLayer"
        },

        onCopyFocus: function() {
            this.$el.addClass("copied");
            this.$el.effect("bounce", { times:3, distance: 5, direction: "right" }, 500);
        },

        onCopyBlur: function() {
            this.$el.removeClass("copied");
        },

        doAction: function( e ) {
            this[ $(e.target).data("action") ]();
        },

        deleteLayer: function() {
            $(".tipsy").remove();
            this.closeControls();
            this.model.collection.remove( this.model );
            app.emit("layer_deleted", this.model );
        },

        selectLayer: function() {
            if ( app.zeega.getCurrentLayer() != this.model ) {
                app.zeega.setCurrentLayer( this.model );
            } else {
                app.zeega.setCurrentLayer( null );
            }
        },

        onFocus: function() {
            this.$el.addClass("active");
            this.openControls();
        },

        onBlur: function() {
            this.$el.removeClass("active");
            this.closeControls();
        },

        onRemove: function() {
            this.remove();
        },

        onSync: function() {
            this.updateTitle();
        },

        updateTitle: function() {
            this.$(".layer-title").text( this.model.getAttr("title"));
        },

        closeControls: function() {
            this.controls.$el.remove();
        }
        
    });

});

define([
    "app",
    "backbone"
],

function( app, ItemView ) {

    var dim = 100;

    return Backbone.View.extend({

        className: function() {
            return "item audio-item item-" + this.model.id;
        },

        tagName: "li",
        template: "app/templates/audio-item",

        serialize: function() {
            return _.extend({}, this.model.toJSON());
        },

        afterRender: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.$el.draggable({
                revert: "invalid",
                appendTo: $("body"),
                zIndex: 10000,
                cursorAt: {
                    left: 20,
                    top: 20
                },

                helper: function( e ) {
                    return $(this).find(".item-thumb img").clone().addClass("item-dragging");
                },

                start: function() {
                    if ( this.model.get("media_type") == "Image" ) {
                        $("body").append("<img class='img-preload' src='" + this.model.get("uri") + "' height='1px' width='1px' style='position:absolute;left:-1000%;top:-1000%'/>");
                    }
                    app.emit("item_drag_start", this.model );
                    app.dragging = this.model;
                }.bind( this ),
                
                stop: function() {
                    $(".img-preload").remove();
                    app.emit("item_drag_stop", this.model );
                    app.dragging = null;
                }
            });
        },

        events: {
            "click": "viewItem",
            "mouseover img": "onMouseOver",
            "mouseout img": "onMouseOut"
        },


        viewItem: function() {
            this.model.collection.itemViewer( this.model );
            app.layout.soundtrack.pause();
        }

    });

});

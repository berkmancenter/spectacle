define([
    "app",
    "modules/zeega-viewer",
    "backbone"
],

function( app, ZeegaViewer ) {

    return Backbone.Layout.extend({

        tagName: "article",
        template: "zeega-card",
        className: "zeega-card",

        
        serialize: function() {
            return _.extend({
                    path: "http:" + app.metadata.hostname + app.metadata.directory
                },
                this.model.toJSON()
            );
        },

        events:{
            "click .cover-image": "onPlay",
            "click .delete-zeega": "deleteZeega"
        },

        onPlay: function( e ) {
            window.location.href = "http:" + app.metadata.hostname + app.metadata.directory + this.model.id;
            /*var zeegaViewer = new ZeegaViewer({ model: this.model });

            $("body").append(zeegaViewer.render().view.el);
            //window.history.pushState("", this.model.get("title"), "/" + app.metadata.directory + this.model.id );
            */
            return false;

        },

        deleteZeega: function() {
            if (confirm("Delete this slideshow?")) {
                app.emit("delete-zeega");
                this.$el.slideUp(function() {
                    this.remove();
                    this.model.destroy();
                }.bind(this));
            }

            return false;
        }
    });

});

define([
    "app",
    "modules/views/frame",

    "backbone"
],

function( app, FrameView ) {

    return Backbone.View.extend({

        template: "app/templates/frames",
        className: "ZEEGA-frames",

        afterRender: function() {
            this.renderSequenceFrames();
            this.makeSortable();
            this.makeDroppable();

            app.zeega.getCurrentProject().pages.on("add", this.onFrameAdd, this );
            app.zeega.getCurrentProject().pages.on("remove", this.onFrameRemove, this );
        },

        makeSortable: function() {
            this.$(".frame-list").sortable({
                axis: "x",
                containment: "parent",
                tolerance: "pointer",
                placeholder: "frame-placeholder",
                update: function( e, ui ) {
                    this.updateFrameOrder();
                    app.emit("pages_reordered", app.zeega.getCurrentProject() );
                }.bind(this)
            });
        },

        makeDroppable: function() {
            this.$(".frame-list, .add-frame").droppable({
                accept: ".item-image",
                tolerance: "pointer",
                greedy: true,
                activeClass: "is-target",

                drop: function( e, ui ) {
                    if ( _.contains( ["Audio"], app.dragging.get("layer_type") )) {

                    } else {
                        app.emit("item_dropped", app.dragging );
                        app.zeega.getCurrentProject().pages.addPageByItem( app.dragging );
                    }
                }.bind( this )

            });
        },

        updateFrameOrder: function( ) {
            var frameOrder = _.map( this.$("ul.frame-list li"), function( frame ) {
                return $( frame ).data("id");
            });

            frameOrder = _.compact( frameOrder );

            _.each( frameOrder, function( frameID, i ) {
                app.zeega.getCurrentProject().pages.get( frameID ).set("_order", i );
            }, this );

            app.zeega.getCurrentProject().pages.sort();
            app.zeega.getCurrentProject().setPageOrder( frameOrder );
            
        },

        onFrameAdd: function( pageModel, collection ) {
            this.$(".frame-list").sortable("destroy");

            if ( pageModel.editorAdvanceToPage !== false ) {
                app.zeega.setCurrentPage( pageModel );
            }

            this.renderSequenceFrames();
            this.updateFrameOrder( );
            app.emit("page_added", null);
            this.makeSortable();
        },

        onFrameRemove: function( frameModel, collection ) {
            this.renderSequenceFrames();
        },

        renderSequenceFrames: function() {
            this.$(".frame-list").empty();

            app.zeega.get("currentProject").pages.each(function( page ) {
                if ( !page._frameView ) {
                    page._frameView = new FrameView({
                        model: page,
                        attributes: {
                            "data-id": page.id
                        }
                    });
                }

                this.$(".frame-list").append( page._frameView.el );

                if ( app.zeega.get("currentPage").id == page.id ) {
                    page._frameView.$el.addClass("active");
                }
                
                page._frameView.render();
            }.bind( this ));
        },

        events: {
            "click .add-frame a": "addFrame"
        },

        addFrame: function() {
            var pageIndex = 1 + app.zeega.getCurrentProject().pages.indexOf( app.zeega.getCurrentPage() );

            app.zeega.getCurrentProject().pages.addPage( pageIndex );
        }
        
    });

});

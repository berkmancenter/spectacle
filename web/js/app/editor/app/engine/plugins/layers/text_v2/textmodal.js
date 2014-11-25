define([
    "app",
    "engineVendor/ddslick"
],

function( app ) {

    return app.Backbone.View.extend({

        template: "app/engine/plugins/layers/text_v2/textmodal",
        serialize: function() {
            return this.model.toJSON();
        },

        saveContent: null,

        className: "text-modal overlay-dimmer ZEEGA-modal",

        afterRender: function() {
            $("#main").addClass("modal");
            this.loadFonts();
            this.$("textarea").focus().select();
        },

        events: {
            "click .modal-close": "closeThis",
            "click .text-modal-save": "submit",
            "click .page" : "selectPage",
            "click .link-new-page": "selectNewPage",
            "click .link-page-open": "openLinkDrawer",
            "click .unlink-text": "unlink"
        },

        closeThis: function() {
            $("#main").removeClass("modal");

            if ( !this.model.get("attr").to_frame ) {
                this.$(".page-chooser-wrapper").addClass("hide");
                this.$(".link-page-open").removeClass("hide");
            }

            this.$el.fadeOut(function() {
                this.$el.attr("style", "");
                this.remove();
            }.bind( this ));
            this.$("input").unbind("input propertychange");
        },

        openLinkDrawer: function() {

            this.$(".page-chooser-wrapper").slideDown();
            this.$(".link-page-open").hide();
            app.emit("init_link", this.model );
        },

        unlink: function() {
            this.selectedFrame = null;
            this.model.saveAttr({ to_frame: null });

            this.model.visual.$el.removeClass("linked-layer");

            this.$(".page-chooser-wrapper").slideUp(function(){
                $(this).parent().find(".link-page-open").show();
            });
            app.emit("unlink", this.model );
            
        },

        submit: function() {
            this.closeThis();

            if ( this.$("textarea").val() !== "" ) {
                this.model.setAttr({ content: this.$("textarea").val() });
                this.updateVisualElement();

                if ( this.selectedFrame !== null && this.selectedFrame == "NEW_FRAME" ) {
                    this.linkToNewPage();
                    this.closeThis();
                    this.model.visual.$el.addClass("linked-layer");
                    // this.model.save();
                } else if ( this.selectedFrame !== null && !_.isUndefined( this.selectedFrame )) {
                    this.model.setAttr({ to_frame: this.selectedFrame });
                    this.model.trigger("change:to_frame", this.model, this.selectedFrame );
                    this.closeThis();
                    this.model.visual.$el.addClass("linked-layer");
                }
                this.model.save();
            } else {
                this.model.collection.remove( this.model );
                app.emit("layer_deleted", this.model );
                $(".ZEEGA-control-floater").remove();
            }
        },

        loadFonts: function() {
            this.$(".font-list").empty();

            _.each( this.model.fontList, function( fontName ) {
                var opt = $("<option value='" + fontName + "' data-nondescription='" + fontName + "'>" + fontName + "</option>");

                if ( this.model.getAttr("fontFamily") == fontName ) {
                    opt.attr("selected", "selected");
                }
                this.$(".font-list").append( opt );
            }, this );

            $('#font-list-' + this.model.id ).ddslick({
                height: "200px",
                onSelected: function(data){
                    if(this.model.getAttr("fontFamily") != data.selectedData.value ){
                        app.emit("layer_font_change", {
                            font: data.selectedData.value
                        });
                    }

                    this.model.setAttr({ fontFamily: data.selectedData.value });

                    this.updateSample();

                }.bind( this )
            });
        },

        updateSample: function() {
            this.$("textarea").css({
                fontFamily: this.model.getAttr("fontFamily")
            });
        },

        updateVisualElement: function() {
            this.model.visual.updateStyle();
        },

        selectPage: function( e ) {
            app.emit("select_link_page", this.model );
            var $frameLI = $(e.target).closest("li");

            if ( !$frameLI.hasClass("inactive") ) {
                this.$(".page-chooser-list li.active, .link-new-page").removeClass("active");
                $frameLI.addClass("active");
                this.selectedFrame = $frameLI.data("id");
            }

            this.$(".submit").removeClass("btnz-inactive");
        },

        selectNewPage: function() {
            this.$(".page-chooser-list li.active").removeClass("active");
            this.$(".link-new-page").addClass("active");
            this.selectedFrame = "NEW_FRAME";
            this.$(".submit").removeClass("btnz-inactive");
        },

        linkToNewPage: function() {
            app.emit("link_new_page", this.model );
            var newFrame = app.status.get("currentSequence").frames.addFrame( "auto", false );

            newFrame.once("sync", this.onNewFrameSave, this );
            this.closeThis();
        },

        onNewFrameSave: function( newFrame ) {
            this.model.saveAttr({ to_frame: newFrame.id });
            this.model.trigger("change:to_frame", this.model, newFrame.id );
        }
    });

});
define([
    "app",
    "engine/modules/layer.model",
    "engine/modules/layer.visual.view",
    "engine/plugins/layers/link/frame-chooser"
],

function( app, _Layer, Visual, FrameChooser ) {

    var Layer = {};

    Layer.Link = _Layer.extend({

        layerType: "Link",

        attr: {
            title: "Link Layer",
            to_frame: null,
            left: 25,
            top: 25,
            height: 50,
            width: 50,
            opacity: 1,
            opacity_hover: 1,
            blink_on_start: true,
            glow_on_hover: true,
            citation: false,
            link_type: "default",
            linkable: false,
            default_controls: false
        },

        controls: [
            "position",
            "resize",
            "linkto"
            //"linkimage"
        ]
    });

  Layer.Link.Visual = Visual.extend({

    template: "link/link",

    visualProperties: [
        "height",
        "width",
        "opacity"
    ],

    serialize: function() {
        return this.model.toJSON();
    },

    init: function() {
        this.frameChooser = new FrameChooser({ model: this.model });
    },

    afterEditorRender: function() {
        if ( this.getAttr("to_frame") === null ) {
            this.startFrameChooser();
        }
        this.setLinkImage();
    },

    startFrameChooser: function() {
        $("body").append( this.frameChooser.el );
        this.frameChooser.render();
    },

    beforePlayerRender: function() {
        style = {
            "border-radius": "0",
            "height": this.getAttr("height") + "%",
            "background": this.getAttr("backgroundColor"),
            "opacity": this.getAttr("opacity"),
            "box-shadow": "0 0 10px rgba(255,255,255,"+ this.getAttr("opacity") + ")"
        };

        this.$el.attr("data-glowOnHover", this.getAttr("glow_on_hover") );

        this.setLinkImage();
        this.$(".ZEEGA-link-inner").css( style );
    },

    setLinkImage: function() {
        this.$el.addClass("link-type-" + this.getAttr("link_type") );
    },

    events: {
        "click": "goClick",
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut"
    },

    onMouseOver: function() {
        this.$el.stop().fadeTo( 500, this.getAttr("opacity_hover") );
    },

    onMouseOut: function() {
        this.$el.stop().fadeTo( 500, this.getAttr("opacity") );
    },

    goClick: function() {
        if ( this.model.mode == "editor" ) {
            app.status.setCurrentLayer( this.model );
        } else {
            this.model.relay.set( "current_frame", this.getAttr("to_frame") );
        }
        return false;
    }

  });

    return Layer;
});
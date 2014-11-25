define([
    "app",
    // Libs
    "backbone"
],

function(app, Backbone) {

    return Backbone.View.extend({
        tagName: "li",
        template: "app/templates/citation",

        serialize: function() {
            var iconType;

            switch( this.model.get("type") ) {
                case "Image":
                    iconType = "picture";
                    break;
                case "Video":
                    iconType = "film";
                    break;
                case "Audio":
                    iconType = "volume-up";
                    break;
            }

            return _.extend(
                { iconType: iconType },
                this.model.toJSON()
            );
        },

        events: {
            "mouseenter": "",
            "mouseleave": ""
        },

        onMouseEnter: function() {
            var title = this.model.get("attr").title !== "" ? this.model.get("attr").title : "[untitled]";

            this.options.parent.$(".citation-title").text( title );
        },

        onMouseLeave: function() {
            this.options.parent.$(".citation-title").empty();
        }
    });

});

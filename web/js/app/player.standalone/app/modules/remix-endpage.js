define([
    "app",
    // Libs
    "backbone"
],

function(app, Backbone) {

    // Create a new module
    var EndPage = {};

    // This will fetch the tutorial template and render it.
    EndPage.View = Backbone.View.extend({
        
        viewed: false,
        visible: false,
        hover: false,
        sticky: false,

        template: "app/templates/remix-endpage",
        className: "ZEEGA-remix-endpage",

        initialize: function() {
            this.model.on("endpage_enter", this.endPageEnter, this );
            this.model.on("endpage_exit", this.endPageExit, this );

            this.relatedProjects = $.parseJSON( window.relatedProjectsJSON ).projects;
        },

        serialize: function() {
            if ( this.isRemixPage() && this.model.zeega.getNextPage() ) {
                return _.extend({
                        path: "http:" + app.metadata.hostname + app.metadata.directory
                    },
                    this.model.zeega.getCurrentProject().toJSON()
                );
            }
        },

        endPageEnter: function( layer ) {
            
            if ( this.isRemixPage() ) {
                this.render();
                this.show();
            }
        },

        isRemixPage: function() {
            return this.model.zeega.getNextPage() !== false;
        },

        endPageExit: function() {
            this.hide();
        },

        show: function(){
            this.$el.fadeIn("fast");
        },

        hide: function(){
            this.$el.fadeOut("fast");
        }

    });

    return EndPage;
});



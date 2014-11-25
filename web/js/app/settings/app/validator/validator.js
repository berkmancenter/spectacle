define([
    "validator/facet.collection",
    "backbone"
],

function( FacetCollection ) {

    return Backbone.Model.extend({
        
        facets: null,

        initialize: function() {
            this.facets = new FacetCollection( this.get("facets") );

            if ( this.facets.length ) {
                this.listen();
            }
        },

        add: function( facets ) {
            this.facets.add( facets );
        },

        listen: function() {
            this.facets.on("change:valid", this.onValidated, this);
        },

        unlisten: function() {
            this.facets.off("validated");
        },

        start: function() {
            this.unlisten();
            this.listen();
        },

        pause: function() {
            this.listen();
        },

        onValidated: function( validation ) {
            var invalid = this.getInvalid();

            this.trigger("validated", {
                valid: this.facets.isValid(),
                flash: invalid.length ? "There are " + invalid.length + " unresolved issues" : "valid"
            });
        },

        isValid: function() {
            return this.facets.isValid();
        },

        getValid: function() {
            return this.facets.filter(function( facet ) {
                return facet.get("valid");
            });
        },

        getInvalid: function() {
            return this.facets.filter(function( facet ) {
                return !facet.get("valid");
            });
        }

    });
});

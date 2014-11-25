define([
    "validator/facet",
    "backbone"
],

function( Facet ) {

    return Backbone.Collection.extend({
        
        model: Facet,

        isValid: function() {
            return _.every( this.pluck("valid"), Boolean );
        }

    });

});

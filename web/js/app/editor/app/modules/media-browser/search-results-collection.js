define([
    "app",
    "modules/media-browser/item-model",
    "modules/media-browser/item-collection-viewer",
    "backbone"
],

function( app, ItemModel, ItemCollectionViewer ) {


    return Backbone.Collection.extend({

        model: ItemModel,
        view: null,
        searchModel: null,
        itemsCount: 0,
        noResults: false,

        url: function() {
            var url;

            if( this.searchModel.getQuery() === "" ){
                
                url = this.searchModel.favUrl;

            } else {

                url = this.searchModel.apiUrl;
                _.each( this.searchModel.toJSON().urlArguments, function( value, key ) {
                    if ( value !== "" && value !== null ) {
                        url += key + "=" + ( _.isFunction( value ) ? value() : value ) + "&";
                    }
                });
            }
            return url;
        },

        itemViewer: function( model ) {
            var startIndex = _.indexOf( this.pluck("id"), model.id );

            startIndex = startIndex < 0 ? 0 : startIndex;

            if ( this.view === null ) {
                this.view = new ItemCollectionViewer({ collection: this, start: startIndex });
            } else {
                this.view.init( startIndex );
            }

            $("body").append( this.view.el );
            this.view.render();
        },

        parse: function( res ) {
            items = this._parse(res);
            
            if( items.length === 0 ){
                this.noResults = true;
            } else {
                this.noResults = false;
            }
            return items;

        },

        _parse: function( res ) {
            return res.items;
        }
    });

});

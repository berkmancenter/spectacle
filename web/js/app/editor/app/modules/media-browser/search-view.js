define([
    "app",
    "modules/media-browser/media-upload-view",
    "spin",
    "backbone"
],

function( app, UploadView, Spinner ) {

    return Backbone.View.extend({

        busy: false,
        spinner: null,

        defaults: {
            title: "untitled"
        },

        className: "media-collection",
        template: "app/templates/media-collection",

        serialize: function() {
            return _.defaults( this.model.toJSON(), this.defaults );
        },

        listen: null,

        initialize: function() {
            this.$el.addClass(this.model.api );
            this.listen = _.once(function() {
                this.model.mediaCollection.on("sync", this.renderItems, this );
                this.model.mediaCollection.on("error", this.onError, this );
            }.bind( this ));

            
            if( this.model.api == "Zeega" ){
                this.insertView( ".media-collection-header",  new UploadView({ model: this.model }) );
            }

            this.initSpinner();
        },

        initSpinner: function() {
            var opts = {
                lines: 12, // The number of lines to draw
                length: 5, // The length of each line
                width: 2, // The line thickness
                radius: 5, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                color: '#fff' // #rgb or #rrggbb
            };
            this.spinner = new Spinner( opts );
        },

        onError: function( a, b  ){
            
            this.$(".more-tab").remove();
            this.$(".media-collection-items").append("<div class='empty-collection'>Oops! Couldn't connect to "+ this.model.get("title") +".<br>  Try again?</div>");
            this.releaseSearchBox();
        },

        releaseSearchBox: function(){
            this.$(".search-box, .media-collection-wrapper").css({
                opacity: 1
            });
            this.$(".label").css("visibility", "visible");
            this.spinner.stop();
            this.busy = false;
        },

        afterRender: function() {
            
            this.renderItems();
            this._afterRender();
            
            if( this.model.allowSearch ){
                $(".media-collection-search").show();
            }
        },

        //extend this function
        _afterRender: function(){

        },

        renderItems: function() {

            this.$(".more-tab").remove();

            if ( this.model.mediaCollection.length && this.model.mediaCollection.at( 0 ).get("uri") ) {
                this.model.mediaCollection.each(function( item ) {
                    this.$(".media-collection-items").append( item.view.el );
                    item.view.render();
                }, this );
                if( this.model.mediaCollection.more ){
                    this.$(".media-collection-items").append("<li class='item more-tab'><h2>more</h2></li>");
                }
            } else if( !this.model.resultsReturned() && this.model.mediaCollection.length === 0) {
                
                this.$(".media-collection-items").append("<div class='empty-collection'>no items found :( try again?</div>");
            }


            this.listen();

           

            if( this.model.getQuery() === "" && this.model.api != "Zeega" ){
                this.$(".media-collection-headline").show();
            } else {
                this.$(".media-collection-headline").hide();
            }

            this.releaseSearchBox();

            $(this.el).find("img").on("error", function(e) {
                $(e.target).closest("li").hide();
            });
        },

        events: {
            "keyup .search-box": "onSearchKeyPress",
            "click .submit": "onSubmitClick",
            "click .more-tab": "loadMore"
        },

        onSearchKeyPress: function( e ) {
            if ( !this.busy ){
                if ( e.which == 13 ) {
                    app.mediaSearchQuery = this.$(".search-box").val();
                    this.search( app.mediaSearchQuery );
                }
            }
        },

        onSubmitClick: function() {
            if ( !this.busy ) {
                app.mediaSearchQuery = this.$(".search-box").val();
                this.search( app.mediaSearchQuery );
            }
        },
        loadMore: function(){
            this.busy = true;
            this.$( ".more-tab").empty();
            this.spinner.spin( this.$( ".more-tab")[0] );
            this.model.more();
        },
        search: function( query ) {
            if( !this.model.allowSearch ){
                this.model.search( "" );
            } else if( this.model.getRawQuery() != query){
                this.$(".search-box").attr("value", query);
                this.busy = true;
                this.$(".media-collection-items").empty();
                this.model.search( query );
                this.$(".search-box").blur();
                this.$(".search-box, .media-collection-wrapper").css({
                    opacity: 0.5
                });

                this.$(".label").css("visibility", "hidden");

                this.spinner.spin( this.$(".submit")[0] );
            } else {
                this.render();
            }
        }

    });

});

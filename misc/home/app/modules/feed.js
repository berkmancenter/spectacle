define([
    "app",
    "backbone"
],

function( app ) {

    return Backbone.View.extend({

        template: "feed",
        className: "ZEEGA-feed",

        events: {
            "click .scroll-to-top": function(){ window.scrollTo(0,1); }
        },

        initialize: function(){

            this.collection.on( "add", function( model ){
                this.$el.append( model.card.render().view.el);
            }, this );

            this.collection.on( "sync", function( model, b, c){
                this.$el.find(".loading").remove();
            }, this );
            
        },

        serialize: function(){
            var headline = "Recent Zeegas";

            if( app.metadata.tags !== "" && app.metadata.tags !== "homepage" ){
                headline =  "#" + app.metadata.tags;
            }

            return { headline: headline };
        },

        afterRender:function(){
           
            if ( window.feedData !== false ){
                this.collection.add( $.parseJSON(window.feedData).projects );
                if( this.collection.length >= this.collection.limit ){
                    this.collection.more = true;
                } else {
                    $(".footer").show();
                }
            } else {
                this.collection.fetch();
            }
            var onScroll = $.proxy( function(e){ this.onScroll(e); }, this );
            $(window).scroll( onScroll );
        },

        onScroll: function(e){

            var loc = $(window).scrollTop() + $(window).innerHeight();
            var height = $("body")[0].scrollHeight;
            if( height !== 0 && loc >= height - 500 && this.collection.more ){
                this.$el.append("<div class='zeega-card'><article class='loading'></article> </div>");
                this.collection.more = false;
                this.collection.page ++;
                this.collection.fetch();
            }
            if( $(window).scrollTop() > 1000 && $(".scroll-to-top.hidden")[0]){
                $(".scroll-to-top").removeClass("hidden");
            } else if( $(window).scrollTop() < 1000 && !$(".scroll-to-top.hidden")[0] ) {
                $(".scroll-to-top").addClass("hidden");
            }
            
        }


    });
});

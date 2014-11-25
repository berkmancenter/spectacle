define('analytics/analytics',[
    "app",

    "backbone"
],

function( app ) {

    return Backbone.Model.extend({

        loggingEnabled: true,

        initialize: function() {
            app.on( "all", this.onEvent, this );
            if( !window.mixpanel ){
                this.generateConsole();
            }
        },

        onEvent: function( event, args ){
            if(_.contains( this.plainEvents, event )){
                this.trackEvent (event, args);
            } else if( _.contains( this.modelEvents, event ) ) {
                this.parseModelEvent (event, args);
            } else {
                //console.log("untracked event:: ", event, args );
            }
        },

        parseModelEvent: function ( event, model ){
            var params = {};
            if( model.modelType == "frame" ){
                params.layerCount = model.layers.length;
            } else if ( model.modelType == "layer" ){
                params = {
                    type: model.get("type"),
                    api: model.get("attr").archive ?  model.get("attr").archive : "none"
                };
            } else if ( model.modelType == "sequence" ){
                params = {
                    pageCount: model.frames.length
                };
            } else if ( model.modelType == "item" ){
                params = {
                    type: model.get("media_type"),
                    api: model.get("archive") ?  model.get("archive") : "none"
                };
            }
            
            params = _.extend( params, model.eventData );

            this.trackEvent( event, params );


        },

        people: {
            increment:function( attr ){
                mixpanel.people.increment( attr );
            },
            set: function( obj ){
                mixpanel.people.set( obj );
            }
        },

        identify: function( id ){
            mixpanel.identify( id );
        },

        setGlobals: function ( args ){

            _.each(args, function (value, key){
                var param = {};
                param[ key ] = value;
                mixpanel.register( param );
            });
        },

        trackEvent: function ( event, args ){
            mixpanel.track( event, args );
        },

        plainEvents: [
        //editor
            "project_preview",
            "media_search",
            "page_added",
            "layer_font_change",
            "toggle_help",
            "help",
            "preview_toggle_view",
            "toggle_page_background",
            "new_zeega",
            "new_user",
            "advance_toggle",
          
           // "view_item",

            //player
            
            // "start_over",
            // "mute_toggle",
            // "fullscreen_toggle",
            "zeega_view",
            "favorite",
            "unfavorite",
            "viewed_to_end",


            //mobile player
            "swipe_to_play",

            //community

            "to_signup",
            "delete-zeega",

        //shared

            "share",
            "to_profile",
            "to_home"

        ],

        modelEvents: [
        //editor
            "page_delete",
            "layer_added_success",
            "layer_deleted",
            "soundtrack_added_success",
            "soundtrack_delete",
            "pages_reordered",
            "layers_reordered"

            // "select_link_page",
            // "link_new_page",
            // "unlink",
            // "init_link"


        ],

        generateConsole: function(){

            var debug = this.loggingEnabled;

            window.mixpanel = {
                register: function (obj){
                    if( debug ){
                        console.log("registering global property::  " + _.keys(obj) + " : " + _.values(obj) );
                    }
                },
                track: function ( event, params ){
                    if( debug ){
                        console.log( "tracking event:: " + event, params );
                    }
                },
                people: {
                    set: function( obj ){
                        if( debug ){
                            console.log( "setting people", obj );
                        }
                    },
                    increment: function( obj ){
                        if( debug ){
                            console.log( "increment", obj );
                        }
                    }
                },
                identify: function( id ){
                    if( debug ){
                        console.log( "identify", id );
                    }
                }
            };
        }

    });

});

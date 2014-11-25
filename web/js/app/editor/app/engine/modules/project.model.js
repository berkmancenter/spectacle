define([
    "app",
    "engine/modules/page.collection",
    "engine/plugins/layers/_all",
    "engine/modules/sequence.model"
],

function( app, PageCollection, Layers, SequenceModel ) {

    return app.Backbone.Model.extend({

        pages: null,
        zeega: null,
        soundtrack: false,

        modelType: "project",

        defaults: {
            _soundtrack: {},
            id: null,
            user: {
                id: null,
                display_name: "",
                username: "",
                thumbnail_url: ""
            },
            title: "",
            date_created: null,
            date_updated: null,
            date_published: null,
            tags: [],
            authors: "",
            cover_image: "",
            enabled: true,
            estimated_time: "",
            description: "",
            location: "",
            item_id: null,
            mobile: true,
            published: true,
            views: 0,
            editable: true,
            favorite: false,
            favorite_count: 0,
            
            sequences: [],
            frames: [],
            layers: [],

            remix: {
                remix: false
            }
        },
        initialize: function() {
            this.on('change', this.onImport);
        },

        url : function() {
            return app.getApi() + "projects/" + this.id;
        },

        _loadProject: function() {
            this._loadSequence(); // sequences should be eraticated
            this._loadPages();
            this._loadSoundtrack();
            this.initSaveEvents();
        },

        // sequences should be eraticated
        _loadSequence: function() {
            this.sequence = new SequenceModel( this.get("sequences")[0]);
        },

        _loadPages: function() {
            var pageArray = _.map( this.get("sequences")[0].frames, function( pageId ) {
                    return _.find( this.get("frames"), function( page ) {
                        return page.id == pageId;
                    });
                }, this );

            this.pages = new PageCollection( pageArray );
            this.pages.load( this.get("layers"), this );
            this.pages.setPageOrder( this.get("sequences")[0] );
        },

        _loadSoundtrack: function() {
            if ( this.get("_soundtrack") ) {
                this.soundtrack = new Layers["Audio"]( _.extend( this.get("_soundtrack"), { type: "Audio" }) );

                this.soundtrack.visual = new Layers["Audio"].Visual({
                        model: this.soundtrack,
                        attributes: {
                            "data-id": this.get("_soundtrack").id
                        }
                    });
            }
        },

        getRemixData: function() {
            return this.get("remix");
        },

        setPageOrder: function( order ) {
            this.sequence.save("frames", order );
        },

        
        setSoundtrack: function( item, soundtrackView, eventData ) {
            var newLayer;

            if ( this.soundtrack ) this.removeSoundtrack( this.soundtrack );

            newLayer = new Layers[ item.get("layer_type") ]({
                    type: item.get("layer_type")
                });

            newLayer.set( "attr", _.extend({},
                newLayer.get("attr"),
                {
                    loop: true,
                    soundtrack: true
                },
                item.toJSON())
            );

            newLayer.eventData = eventData;
            newLayer
                .save()
                .success(function( response ) {
                    this.soundtrack = newLayer;

                    newLayer.visual = new Layers["Audio"].Visual({
                            model: this.soundtrack,
                            attributes: {
                                "data-id": newLayer.id
                            }
                        });

                    this.sequence.save({
                            attr: _.extend({}, this.sequence.get("attr"), { soundtrack: newLayer.id })
                        });

                    soundtrackView.setSoundtrackLayer( newLayer );
                    app.emit("soundtrack_added_success", newLayer);
                }.bind( this ));
        },

        removeSoundtrack: function( layer ) {
            if ( this.soundtrack ) {
                this.sequence.save({
                        attr: _.extend({}, this.sequence.get("attr"), { soundtrack: false })
                    });
                app.emit("soundtrack_delete", this.soundtrack);
                this.soundtrack.destroy();
            }
            
        },

        ///////


        getProjectJSON: function() {
            var frames = [], layers = [];

            this.sequences.each(function( sequence ) {
                frames = frames.concat( sequence.frames.toJSON() );
                sequence.frames.each(function( frame ) {
                    layers = layers.concat( frame.layers.toJSON() );
                });
                if ( sequence.soundtrackModel ) {
                    layers = layers.concat( [ sequence.soundtrackModel.toJSON() ] );
                }
            });

            return _.extend({}, this.toJSON(), {
                sequences: this.sequences.toJSON(),
                frames: frames,
                layers: _.uniq( layers )
            });
        },

        getSimpleJSON: function() {
            return _.pick(this.toJSON(),["cover_image", "user", "id"]);
        },

        getRemixParent: function() {

        },

        getRemixRoot: function() {

        },

        getFrame: function( frameID ) {
            
        },

        // TODO keep a central repo of layers!
        // this is not the best. cache these somewhere in a big collection?
        getLayer: function( layerID ) {
            
        },

        /* editor */

        publishProject: function() {

            if ( this.get("date_updated") != this.get("date_published") || this.updated ) {
                this.updated = false;
                this.once("sync", this.onProjectPublish, this);

                if ( !this.get("published") ) {
                     this.set({ published: true });
                }
                this.save({
                    publish_update: 1,
                    mobile: true
                });
                console.log("already published. published again");
            } else {
                this.trigger("update_buttons");
            }
        },

        onProjectPublish: function( model, response ) {
            this.set({ publish_update: 0 });
        },

        destroy: function() {
            if ( this.soundtrack ) this.soundtrack.destroy();
            this.pages.each(function( page ) {
                page.destroy();
            });
        },

        parse: function(data) { return data.project; },

        onImport: function() {
            //TODO: update uploads
            this._loadSequence();
            this._loadPages();
            app.layout.frames.renderSequenceFrames();
        }

    });

});

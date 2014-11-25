define([
    "app",
    "modules/views/soundtrack-viewer"
],

function( app, Viewer ) {

    return Backbone.View.extend({

        model: null,
        template: "app/templates/soundtrack",
        className: "ZEEGA-soundtrack",

        serialize: function() {
            if ( this.model === null || this.model.get("type") != "Audio" ) {
                return { model: false };
            } else if ( this.model.get("type") == "Audio" ) {
                return _.extend({
                    canplayMpeg: this.canPlayMpeg(),
                    model: true,
                    remix: app.zeega.getCurrentProject().get("remix").remix
                }, this.model.toJSON() );
            }
        },

        initialize: function() {
            this.onEnterSequence();
        },

        canPlayMpeg: function() {
            var a = document.createElement('audio');

            return !!( a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
        },

        onEnterSequence: function( sequence ) {
            var soundtrack = app.zeega.getSoundtrack();

            if ( soundtrack ) this.setSoundtrackLayer( soundtrack );
        },

        afterRender: function() {
            this.makeDroppable();

            app.trigger("rendered", this );

            this.$("[title]").tipsy({
                fade: true,
                gravity: function() {
                    return $(this).data("gravity");
                }
            });
            this.initProgress();
        },

        makeDroppable: function() {
            this.$el.droppable({
                accept: ".audio-item",
                tolerance: "pointer",
                activeClass: "can-drop",
                drop: function( e, ui ) {
                    if ( _.contains( ["Audio"], app.dragging.get("layer_type") )) {
                        this.updateWaveform( app.dragging.get("thumbnail_url") );

                        app.emit("soundtrack_added", app.dragging );
                        app.zeega.getCurrentProject().setSoundtrack( app.dragging, this, { source: "drag-to-soundtrack" } );
                    }
                }.bind( this )
            });
        },

        updateWaveform: function( url ) {
            this.$(".soundtrack-waveform").css({
                background: "url(" + url + ")",
                backgroundSize: "100% 100%"
            });
        },

        setSoundtrackLayer: function( layer ) {
            if ( this.model !== null ) {
                this.removeSoundtrack( false );
            }
            if ( layer ) {
                this.model = layer;
                this.model.on("play", this.onPlay, this );
                this.model.on("pause", this.onPause, this );
                this.model.on("timeupdate", this.onTimeupdate, this );
            }
            this.render();
        },

        onPlay: function( obj ) {
            this.$(".playpause i")
                .removeClass("icon-play")
                .addClass("icon-pause");
        },

        onPause: function( obj ) {
            this.$(".playpause i")
                .addClass("icon-play")
                .removeClass("icon-pause");
        },

        onTimeupdate: function( obj ) {
            this.updateProgress( obj );
        },

        initProgress: function() {
            this.bg = this.$(".progress")[0];
            this.ctx = ctx = this.bg.getContext('2d');
            this.imd = null;
            this.circ = Math.PI * 2;
            this.quart = Math.PI / 2;

            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgba(0,102,204,0.7)"; // "rgba(255,69,0,0.5)";// '#FF4500';
            this.ctx.lineCap = 'square';
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.lineWidth = 5.0;

            this.imd = this.ctx.getImageData(0, 0, 80, 80);
        },

        updateProgress: function( time ) {
            this.ctx.putImageData( this.imd, 0, 0 );
            this.ctx.beginPath();
            this.ctx.arc( 40, 40, 25, - ( this.quart ), (( this.circ ) * ( time.currentTime / time.duration )) - this.quart, false );
            this.ctx.stroke();
        },

        events: {
            "click .playpause": "playpause",
            "click .remove": "removeSoundtrack"
        },

        soundtrackLoaded: null,

        playpause: function() {
            if ( this.soundtrackLoaded != this.model.id ) {
                this.model.once("visual:after_render", function() {
                    this.model.visual.verifyReady();
                    this.model.visual.playPause();
                }, this );

                this.soundtrackLoaded = this.model.id;
                this.$(".audio-wrapper").empty().append( this.model.visual.el );
                this.model.visual.playWhenReady = true;
                this.model.visual.render();
            } else {
                this.model.visual.playPause();
            }
            this.$(".playpause").toggleClass("playing paused");
        },

        pause: function() {
            if ( this.canPlayMpeg() && this.model && this.model.visual.audio ) {
                this.model.visual.audio.pause();
            }
        },

        onRemoveSoundtrack: function() {
            if ( confirm("Remove soundtrack from project?") ) {
                this.removeSoundtrack( true );
            }
        },

        removeSoundtrack: function( save ) {
            this.soundtrackLoaded = null;
            this.stopListening( this.model );
            $(".tipsy").remove();
            if ( save ) {
                app.zeega.getCurrentProject().removeSoundtrack();
                // app.status.get('currentSequence').removeSoundtrack();
                // app.status.get('currentSequence').lazySave();
            }
            this.model = null;
            this.render();
        },

        toMinSec: function( s ) {
            var min, sec;

            min = Math.floor( s / 60 );
            min = min < 10 ? "0" + min : min;
            sec = Math.round( s % 60 );
            sec = sec < 10 ? "0" + sec : sec;

            return min + ":" + sec;
        }
        
    });

});

define([
    "app",
    // Libs
    "backbone"
],

function(app, Backbone) {

    return Backbone.View.extend({
        
        className: "countdown",
        template: "app/templates/countdown",
        
        initialize: function() {
            app.player.on("player:play", this.onPlay, this );
            app.player.on("player:next", this.onNext, this );
            app.player.on("player:prev", this.onPrev, this );
            app.player.on("player:pause", this.onPause, this );
        },
        
        serialize: function() {
            return this.model.zeega.toJSON();
        },

        reset: function() {
            $(this.el).removeAttr('style').width(0).hide().show(0);
        },

        animate: function() {
            this.reset();
            var time = app.player.get('autoplayDuration'),
                transition = 'linear';
            $(this.el).css({
                'transition': 'width ' + time + 'ms ' + transition,
                '-webkit-transition': 'width ' + time + 'ms ' + transition,
                '-moz-transition': 'width ' + time + 'ms ' + transition,
                '-o-transition': 'width ' + time + 'ms ' + transition,
                'width': '100%'
            });
        },

        onNext: function() {
            this.animate();
        },

        onPrev: function() {
            this.animate();
        },

        onPlay: function() {
            this.animate();
        },

        onPause: function() {
            this.reset();
        }
    });

});

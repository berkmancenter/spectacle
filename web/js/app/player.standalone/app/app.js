define([
    "common/_app.common",
    "plugins/backbone.layoutmanager"
],

function( _App ) {
    
    var app = {
        // The root path to run the application.
        root: "/",

        getIframeAttributes: _.memoize(function() {
            try {
                if ( window != window.top ) {
                    return {
                        hideChrome: window.frameElement ? ( window.frameElement.getAttribute("hideChrome") || true ) : true,
                        loop: window.frameElement ? ( window.frameElement.getAttribute("loop") || false ) : false
                    }
                } else {
                    return false;
                }
            } catch ( err ) {
                return false
            }
        }),

        Backbone: Backbone,
        $: $
    };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    // events that trigger the save indicator on the editor interface
    Backbone.Model.prototype.initSaveEvents = function() { /* empty for player */ };
    Backbone.Model.prototype.put = function() {
        var args = [].slice.call( arguments ).concat([ { silent: true } ]);
        return this.set.apply( this, args );
    };

    Backbone.Layout.configure({
        // Allow LayoutManager to augment Backbone.View.prototype.
        manage: true,

        fetch: function( path ) {
            var done;

            path = path + ".html";

            if (JST[path]) {
                return JST[path];
            } else {
                done = this.async();

                return $.ajax({ url: app.root + path }).then(function(contents) {
                    done(JST[path] = _.template(contents));
                });
            }
        }
    });
    
    return _.extend(app, _App, Backbone.Events);
});

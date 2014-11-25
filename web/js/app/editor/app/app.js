define([
    "common/_app.common",
    "backbone.layoutmanager"
], function( _app ) {

    var meta = $("meta[name=zeega]");

    // Provide a global location to place configuration settings and module
    // creation.
    var app = {
        // The root path to run the application.
        attributes: { mobile: false },
        mode: "editor",
        parserPath: "app/engine/",
        dragging: null,
        mediaCollection: null,

        _saving: 0,
        _saveIndicatorTimeout: null,

        getTemplateBase: function() {
            if ( this.metadata.dev ) return "";
            else return this.metadata.root;
        },

        onSaveStart: function( target ) {

            if ( this._saveIndicatorTimeout ) {
                clearTimeout( this._saveIndicatorTimeout );
            }

            $(".saving-indicator").text("saving");
            this._saving++;
        },

        onSaveSuccess: function( target, opts ) {
            this._saving--;

            if( this._saving < 1 ) {
                $(".saving-indicator").text("all changes saved");
                this._saveIndicatorTimeout = setTimeout( function() {
                    $(".saving-indicator").empty();
                }, 2000 );
            }
        },
        
        onSaveError: function() {}
    };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};


    // Curry the |set| method with a { silent: true } version
    // to avoid repetitious boilerplate code throughout project
    Backbone.Model.prototype.put = function() {
        var args = [].slice.call( arguments ).concat([ { silent: true } ]);
        return this.set.apply( this, args );
    };

    // events that trigger the save indicator on the editor interface
    Backbone.Model.prototype.initSaveEvents = function() {
        this.on("request", app.onSaveStart, app );
        this.on("sync error", app.onSaveSuccess, app );
    };

    $ = jQuery;

    Backbone.Layout.configure({
        manage: true,
        prefix: "",

        fetch: function(path) {
            path = path + ".html";

            if (JST[path]) {
                return JST[path];
            }

            var done = this.async();

            $.get( app.getTemplateBase() + path, function(contents) {
                done(JST[path] = _.template(contents));
            });
        }
    });

    return _.extend(app, _app, {
        Backbone: Backbone,
        $: jQuery,
    }, Backbone.Events);

});

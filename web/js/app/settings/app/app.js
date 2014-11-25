define([
    "backbone.layoutmanager"
], function() {

    var meta = $("meta[name=zeega]");

    // Provide a global location to place configuration settings and module
    // creation.
    var app = {
        // The root path to run the application.
        metadata: $("meta[name=zeega]").data(),
        root: $("meta[name=zeega]").data("root"),
        emit: function( event, args ) {
            // other things can be done here as well
            this.trigger( event, args );
        }
    };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    // Configure LayoutManager with Backbone Boilerplate defaults.
    Backbone.LayoutManager.configure({
        // Allow LayoutManager to augment Backbone.View.prototype.
        manage: true,
        prefix: "app/",

        fetch: function(path) {
            // Concatenate the file extension.
            path = path + ".html";

            // If cached, use the compiled template.
            if (JST[path]) {
                return JST[path];
            }

            // Put fetch into `async-mode`.
            var done = this.async();

            // Seek out the template asynchronously.
            $.get(app.root + path, function(contents) {
                done(JST[path] = _.template(contents));
            });
        }
    });

    // Mix Backbone.Events, modules, and layout management into the app object.
    return _.extend(app, {
        Backbone: Backbone,
        $: jQuery
    }, Backbone.Events);

});

// Set the require.js configuration for your application.
require.config({

    // Initialize the application with the main application file.
    deps: ["main"],

    paths: {
        // JavaScript folders.
        libs: "../assets/js/libs",
        plugins: "../assets/js/plugins",
        vendor: "../assets/vendor",
        engineVendor: "engine/vendor",

        // Libraries.
        jquery: "../assets/js/libs/jquery",
        jqueryUI: "../assets/js/plugins/jquery-ui",
        lodash: "../assets/js/libs/lodash",
        backbone: "../assets/js/libs/backbone",

        zeega: "../assets/js/zeega",

        player: "player",
        swfObject: "engine/vendor/swfobject"

    },

    shim: {
        // Backbone library depends on lodash and jQuery.
        backbone: {
            deps: ["jquery", "lodash"],
            exports: "Backbone"
        },

        player: ["jquery", "backbone"],
        jqueryUI: ["jquery"],

        // Backbone.LayoutManager depends on Backbone.
        "plugins/backbone.layoutmanager": ["backbone"]
    }

});

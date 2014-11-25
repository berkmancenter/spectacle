require.config({

  deps: ["../vendor/jam/require.config", "main"],

  paths: {
    jqueryUI: "../assets/js/plugins/jquery-ui/js/jquery-ui-1.10.1.custom",

    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",
    vendor: "../vendor",
    engineVendor: "engine/vendor",

    player: "player",
    mousetrap: "../vendor/mousetrap/mousetrap",
    spin: "../assets/js/libs/spin",
    tipsy: "../vendor/tipsy/src/javascripts/jquery.tipsy",
    swfObject: "engine/vendor/swfobject"
  },

  shim: {
    jqueryUI: ["jquery"],
    ddslick: ["jquery"],
    simpleColorPicker: ["jquery"],
    mousetrap: {
        exports: 'Mousetrap'
    },

    tipsy: ["jquery"]
  }
});
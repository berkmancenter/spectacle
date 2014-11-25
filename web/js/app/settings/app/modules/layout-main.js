 define([
    "app",
    "pages/settings/settings",
    "pages/social-registration/social",
    "pages/register/register",
    "backbone"
],

function( app, Settings, Social, Register ) {

    return Backbone.Layout.extend({
        el: "#main",
        template: "templates/layout-main",

        beforeRender: function(){

            switch ( app.page ) {

                case "settings":
                    this.insertView( ".ZEEGA-content-wrapper", new Settings({ model: app.user }) );
                    break;
                case "social":
                    new Social();
                    break;
                case "register":
                    new Register();
                    break;
            }
        }
    });

});

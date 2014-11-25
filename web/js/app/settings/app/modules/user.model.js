define([
    "app",
    "backbone"
],

function( app ) {

    return Backbone.Model.extend({

        usernameMinLength: 3,
        displayNameMinLength: 3,
        omits: "zeega,admin",
        
        defaults: {
            background_image_url: "",
            bio: "",
            created_at: null,
            display_name: "",
            editable: false,
            id: null,
            location: null,
            locationLatitude: null,
            locationLongitude: null,
            thumbnail_url: "",

            username: "yourname",
            email: "tester@test.com"
        },

        url: function() {
            var https = app.metadata.api.replace("https","http").replace("http","https");

            return https + "users/" + this.id;
        },

        initialize: function() {
            if ( window.profileData ) this.set( $.parseJSON( profileData ));
        },


        // TODO: Validate

        validate: function( attr, opt ) {
            if ( !this.isUsername ) {

            }

            if ( !this.isDisplayName ) {
                
            }

            if ( !this.isEmail ) {
                
            }

            if ( !this.isUsername ) {
                
            }

        },

        isEmail: function( value ) {

        },

        isUsername: function( value ) {

        },

        isDisplayName: function( value ) {

        },

        isPassword: function( value ) {

        },

        isMinLength: function( value ) {
            return;
        }


    });

});

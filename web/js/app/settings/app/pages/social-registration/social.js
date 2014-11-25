define([
    "app",
    "modules/user.model",
    "validator/validator",
    "backbone"
],

function( app, User, Validator ) {

    return Backbone.View.extend({

        el: $("body"),
       
        initialize: function() {
            this.model = new User();
            this.$("label[for*='zeega_user_registration_social_username']").append(" <span class='username-validation'></span>");
            $(".username-preview").text( $("#zeega_user_registration_social_username").val());

            this.initValidation();
        },

        initValidation: function() {
            this.validator = new Validator({
                facets:[
                    {
                        type: "email",
                        $el: this.$("#zeega_user_registration_social_email")
                    }, {
                        type: "username",
                        $el: this.$("#zeega_user_registration_social_username"),
                        omits: "zeega,admin",
                        minLength: 3,
                        alphanumeric: true
                    }
                ]
            });

            this.validator.on("validated", this.onValidation, this );
        },

        onValidation: function( response ) {

            if ( response.valid ) {
                this.$(".submit").removeClass("btnz-disabled");
            } else {
                this.$(".submit").addClass("btnz-disabled");
            }
        },

        events: {
            "click .submit": "saveUserModel",
            "keyup #zeega_user_registration_social_username": "onUsernameKeyup"
        },

        onUsernameKeyup: function( e ) {
            $(".username-preview").text( $("#zeega_user_registration_social_username").val() );
        },

        saveUserModel: function() {
            this.model.save({
                display_name: this.$("#display-name").val(),
                username: this.$("#zeega_user_registration_social_username").val(),
                email: this.$("#email").val(),
                password: this.$("#password").val()
            });
            $(".submit")
                .text("Updates Saved!")
                .addClass("btnz-success btnz-flat")
                .removeClass("btnz-disabled");
        }

    });


});

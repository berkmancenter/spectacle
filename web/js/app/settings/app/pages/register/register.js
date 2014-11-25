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
            this.initValidation();
        },

        initValidation: function() {
            this.validator = new Validator({
                facets:[
                    {
                        type: "email",
                        $el: this.$("#fos_user_registration_form_email")
                    }, {
                        type: "username",
                        $el: this.$("#fos_user_registration_form_username"),
                        omits: "zeega,admin",
                        minLength: 3,
                        alphanumeric: true
                    }, {
                        type: "plaintext",
                        $el: this.$("#fos_user_registration_form_displayName"),
                        omits: "zeega,admin",
                        minLength: 3
                    }, {
                        type: "plaintext",
                        $el: this.$("#fos_user_registration_form_plainPassword"),
                        minLength: 6
                    }
                ]
            });

            this.validator.on("validated", this.onValidation, this );
        },

        onValidation: function( response ) {

            if ( response.valid ) {
                this.$(".submit").removeClass("btnz-disabled").addClass("btnz-green");
            } else {
                this.$(".submit").addClass("btnz-disabled").removeClass("btnz-green");
            }
        },

        events: {
            "click .submit": "saveUserModel",
            "keyup #fos_user_registration_form_username": "onUsernameKeyup"
        },

        onUsernameKeyup: function( e ) {
            if ( $(".help-block").is(":hidden") ) $(".help-block").fadeIn();
            $(".username-preview").text( $("#fos_user_registration_form_username").val());
        },

        saveUserModel: function() {
            this.model.save({
                display_name: this.$("#display-name").val(),
                username: this.$("#fos_user_registration_form_username").val(),
                email: this.$("#email").val(),
                password: this.$("#password").val()
            });
            $(".submit").addClass("btnz-disabled");
        }

    });


});

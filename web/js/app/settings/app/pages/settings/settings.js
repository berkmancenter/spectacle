define([
    "app",
    "validator/validator",
    "backbone"
],

function( app, Validator ) {

    return Backbone.View.extend({

        template: "pages/settings/settings",
        className: "settings",

        serialize: function() {

            return  _.extend({},
                app.metadata,
                this.model.toJSON(),
                {
                    path: "http:" + app.metadata.hostname + app.metadata.directory
                }
            );
        },

        afterRender: function() {
            this.initValidation();
        },

        initValidation: function() {
            this.validator = new Validator({
                facets:[
                    {
                        type: "email",
                        $el: this.$("#email")
                    }, {
                        type: "username",
                        $el: this.$("#username"),
                        omits: "zeega,admin",
                        minLength: 3,
                        alphanumeric: true
                    }, {
                        type: "plaintext",
                        $el: this.$("#display-name"),
                        omits: "zeega,admin",
                        minLength: 3
                    }, {
                        type: "plaintext",
                        $el: this.$("#password"),
                        minLength: 6,
                        required: false
                    }
                ]
            });

            this.validator.on("validated", this.onValidation, this );
        },

        onValidation: function( response ) {
            $(".settings-submit").text("Save Updates");
            if ( response.valid ) {
                this.$(".settings-submit").removeClass("btnz-disabled").addClass("btnz-green");
            } else {
                this.$(".settings-submit").addClass("btnz-disabled").removeClass("btnz-green");
            }
        },

        events: {
            "click .settings-submit": "saveUserModel",
            "keyup #username": "onUsernameKeyup"
        },

        onUsernameKeyup: function() {
            $(".username-preview").text( $("#username").val() );
        },

        saveUserModel: function() {
            this.model.save({
                display_name: this.$("#display-name").val(),
                username: this.$("#username").val(),
                email: this.$("#email").val(),
                password: this.$("#password").val()
            });

            $(".settings-submit")
                .text("Updates Saved")
                .addClass("btnz-disabled");
        }

    });


});

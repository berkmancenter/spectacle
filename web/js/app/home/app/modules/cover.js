define([
    "app",
    "libs/spin",
    "backbone"
],

function( app, Spinner ) {

    var User = Backbone.Model.extend({

        url: function() {
            var https = app.metadata.api.replace("https","http").replace("http","https");
            return https + "users/" + this.id;
        }

    });

    var Cover = {};

    Cover.HomeView = Backbone.View.extend({
        template: "home-cover",
        className: "home-cover"
    });

    Cover.ProfileView = Backbone.View.extend({
        
        template: "profile-cover",
        className: "profile-cover",

        initialize: function() {
            this.model = new User( $.parseJSON(window.profileData) );
        },

        serialize: function() {
            return this.model.toJSON();
        },

        events: {
            "click .edit-bio": "editBio",
            "click .save-bio": "saveBio",

            "keydown .display-name": "onKeydown",
            "keydown .bio": "onKeydown",

            "change input": "onChangeInput"
        },

        onKeydown: function( e ) {
            if ( e.which == 13 ) {
                this.$(".display-name, .bio").blur();

                return false;
            }
        },

        editBio: function() {
            this.$(".display-name, .bio")
                .addClass("editing")
                .prop("contenteditable", "true");
            this.$(".profile-image-inputs").slideDown();

            this.$(".edit-bio").hide();
            this.$(".save-bio").show();

            return false;
        },

        saveBio: function() {
            this.$(".display-name, .bio")
                .removeClass("editing")
                .prop("contenteditable", "false");
            this.$(".profile-image-inputs").slideUp();

            this.$(".save-bio").hide();
            this.$(".edit-bio").show();

            this.model.save({
                "display_name": this.$(".display-name").text(),
                bio: this.$(".bio").text()
            });

            return false;
        },

        onChangeInput: function( event ) {
            var fileInput = event.target,
                imageData,
                sizes;

            imageData = new FormData();
            imageData.append( "file", fileInput.files[0] );

            var updateProgress = function( e ){};

            $(event.target).fadeTo( 250, 0.1);
            var opts = {
                lines: 13, // The number of lines to draw
                length: 5, // The length of each line
                width: 2, // The line thickness
                radius: 10, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#FFF', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: true, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };
            
            if ( $(event.target).hasClass("profile-image") ) {
                sizes ="4";
                this.spinner = new Spinner(opts).spin( $(".profile-token-large")[0]);
            } else {
                sizes = "7";
                this.spinner = new Spinner(opts).spin( $(".cover")[0]);
            }


            $.ajax({
                url: app.metadata.mediaServer + "image?sizes="+sizes,
                type: "POST",
                data: imageData,
                dataType: "json",
                processData: false,
                contentType: false,
                fileElementId: "imagefile",
                
                xhr: function() {  // custom xhr
                    myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){ // check if upload property exists
                        myXhr.upload.addEventListener('progress', updateProgress, false); // for handling the progress of the upload
                    }
                    return myXhr;
                },
                
                success: function( data ) {
                    var attr = {};

                    if ( $(event.target).hasClass("profile-image") ) {
                        attr.thumbnail_url = data.image_url_4;
                        this.$(".profile-token-large").css("background-image", "url(" + data.image_url_4 + ")");
                    } else {
                        attr.background_image_url = data.fullsize_url;
                        this.$(".cover").css("background-image", "url(" + data.fullsize_url + ")");
                    }

                    $(event.target).fadeTo( 500, 1);
                    this.spinner.stop();
                    this.model.save( attr );
                }.bind(this)
            });

        }

    });

    return Cover;

});
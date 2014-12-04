define([
    "app",
    "modules/media-browser/item-view",
    "common/modules/askers/asker",
    "backbone"
],

function( app, ItemView, Asker ) {

    var UploadItem = Backbone.Model.extend({
        modelType: "item",
        url: app.getApi() + "items",
        defaults:{
            "title": "",
            "headline": "",
            "description": "",
            "text": "",
            "uri": "",
            "zga_uri": null,
            "attribution_uri": "",
            "media_type": "Image",
            "layer_type": "Image",
            "archive": "Upload",
            "media_geo_latitude": null,
            "media_geo_longitude": null,
            "media_date_created": "",
            "child_items_count": 0,
            "editable": true,
            "published": false,
            "enabled": true,
            "allowDelete": true
        },

        initialize: function() {
            this.view = new ItemView({ model: this });
        }
    });

    var WebItem = UploadItem.extend({
        defaults:{
            "title": "",
            "headline": "",
            "description": "",
            "text": "",
            "uri": "",
            "zga_uri": null,
            "attribution_uri": "",
            "media_type": "Image",
            "layer_type": "Image",
            "archive": "Absolute",
            "media_geo_latitude": null,
            "media_geo_longitude": null,
            "media_date_created": "",
            "child_items_count": 0,
            "editable": true,
            "published": false,
            "enabled": true,
            "allowDelete": true
        },
        url: function(){
            // console.log("API", app.getApi() + "items/parser?url=" + this.get("web_url"));
            return app.getApi() + "items/parser?url=" + this.get("web_url");
        },

        parse: function( res ) {
            var item;

            if ( res.code == 500 ){
                this.itemsCount = 0;
                return array();
            }

            if(!_.isUndefined(res.item)){
                item = res.item[ 0 ];
            } else {
                item = res.items[ 0 ];
            }

            
            item.editable = -1;

            return item;
        }

    });

    var WebItemSet = Backbone.Collection.extend({
        model: WebItem
    });

    var Portfolio = Backbone.Model.extend({
        url: function(){
            return app.getApi() + "items/parser?url=" + this.get("web_url");
        },
        parse: function( res ) {
            res.items = _.map(res.items, function(item) {
                return new UploadItem(item);
            });
            return res;
        },
        initialize: function() {
            this.set('items', new WebItemSet());
            this.on('sync', this.updateProject);
            this.on('error', this.onUploadError);
        },
        updateProject: function() {
            if (this.get('items').length === 0) {
              new Asker({
                  question: "Something went wrong with your upload!",
                  description: "We couldn't find any images. Maybe the portfolio format is incorrect.",
                  cancel: false,
                  okay: function() {
                      //this.render();
                  }.bind( this )
              });
              $('.upload-instructions').html("click here to upload a portfolio");
              return;
            }

            var items = {
                items: _.map(this.get('items'), function(item) { return item.attributes; })
            };
            $.ajax({
                url: app.getApi() + 'projects/' + app.zeega.getCurrentProject().get('id') + '/items?_method=PUT',
                type: "POST",
                data: items,
                dataType: 'json',
                success: function(data) { 
                    $('.upload-instructions').html("click here to upload a portfolio");
                    app.zeega.getCurrentProject().trigger('upload');
                    app.zeega.getCurrentProject().fetch();
                },
                error: function( XHR, status, error ) {
                    this.onUploadError( XHR, status, error );
                }.bind(this)
            });
        },
        onUploadError: function( XHR, status, error) {
            $('.upload-instructions').html("click here to upload a portfolio");
            console.log("AJAX ERROR:", XHR, "status:", status, "error:", error);
            var message;

            switch( error ) {
                case "Request Entity Too Large":
                    message = "Nertz! Your file is over 3mb. Make it smaller and try again.";
                    break;
                case "Unsupported Media Type":
                    message = "Spectacle doesn't support this file type. Instead, try a .xml!";
                    break;
                default:
                    message = "We hit an error: '" + error + "'";
            }
            if (typeof error != 'string') {
              message = 'We hit an unknown error.';
            }
            new Asker({
                question: "Something went wrong with your upload!",
                description: message,
                cancel: false,
                okay: function() {
                    //this.render();
                }.bind( this )
            });
        }
    });

    return Backbone.View.extend({

        template: "app/templates/media-upload",
        className: "media-upload",
        tabState: "upload",

        events: {
            "click .upload-image-action": "showUploadImage",
            "click .paste-url-action": "showPasteBox",
            "change #portfoliofile": "imageUpload",
            "keyup .url-box": "onSearchKeyPress"
        },

        showUploadImage: function() {

            if( this.tabState == "upload"){
                $("#portfoliofile").trigger("click");
            } else {
               this.tabState = "upload";
                this.$("#image-file").trigger("click");
                this.$(".upload-file").show();
                this.$(".paste-url").hide();
                this.$(".upload-image-action").addClass("active");
                this.$(".paste-url-action").removeClass("active");
            }
            
        },

        showPasteBox: function() {
            this.tabState = "url";
            this.$(".upload-file").hide();
            this.$(".paste-url").show();
            this.$(".upload-image-action").removeClass("active");
            this.$(".paste-url-action").addClass("active");
        },

        afterRender: function(){

            if(this.tabState == "url" ){
                this.showPasteBox();
            } else {
                this.tabState = "";
                this.showUploadImage();
            }
        },
        
        onSearchKeyPress: function( e ) {
            var url = this.$(".url-box").val();
            if ( e.which == 13 ) {
                this.$(".url-box").val("");
                this.search( url );
                return false;
            }
        },

        addItem: function( item ) {
            item.off("sync");
            app.layout.$(".intro").remove();
            item.url = app.getApi() + "items";
            item.on("sync", this.refreshUploads, this );


            // gifs only
            if( item.get("thumbnail_url").indexOf(".gif") > 0 ){
                item.set({
                    "attributes": {
                        animate_url: item.get("thumbnail_url")
                    },
                    "create_thumbnail": true
                });
            }

            item.save();

            if ( item.get("layer_type")  && _.contains( ["Audio"], item.get("layer_type") )) {
                app.zeega.getCurrentProject().setSoundtrack( item, app.layout.soundtrack, { source: "import-item", itemSource: item.get("Archive") } );
            } else {
                var project = app.zeega.getCurrentProject();
                project.pages.addPageByItem( item, { source: "import-item", itemSource: item.get("Archive") } );
            }
        },

        search: function( url ){
            var item = new WebItem({ web_url: url });

            item.on("sync", this.addItem, this );
            item.fetch();
        },

        refreshUploads: function( item ){

            this.model.mediaCollection.add( item, {at:0} );
            this.model.mediaCollection.trigger("sync");

        },

        updateProgress: function(){
            // console.log("updating progress");
        },

        imageUpload: function(event) {

            this.$('.upload-instructions').html("working... ");

            var fileInput = event.target,
                imageData,
                _this = this;

            imageData = new FormData();
            imageData.append( "file", fileInput.files[0] );

            var updateProgress = function( e ){
                // This was hacky and now it's not really needed
            };

            $.ajax({
                url: app.getMediaServerUrl() + "upload.php",
                type: "POST",
                data: imageData,
                dataType: "json",
                processData: false,
                contentType: false,
                fileElementId: "portfoliofile",
                
                xhr: function() {  // custom xhr
                    myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){ // check if upload property exists
                        myXhr.upload.addEventListener('progress', updateProgress, false); // for handling the progress of the upload
                    }
                    return myXhr;
                },
                
                success: function( data ) {
                    var portfolio = new Portfolio({ web_url: data.url });
                    portfolio.fetch();
                }.bind(this),

                error: function( XHR, status, error ) {
                    this.$('.upload-instructions').html("click here to upload a portfolio");
                    this.onUploadError( XHR, status, error );
                }.bind(this)
            });
        },

        onUploadError: function( XHR, status, error) {
            // console.log("AJAX ERROR:", XHR, "status:", status, "error:", error);
            var message;

            switch( error ) {
                case "Request Entity Too Large":
                    message = "Nertz! Your file is over 3mb. Make it smaller and try again.";
                    break;
                case "Unsupported Media Type":
                    message = "Spectacle doesn't support this file type. Instead, try a .xml!";
                    break;
                default:
                    message = "We hit an unknown error: '" + error + "'";
            }
            this.render();
            new Asker({
                question: "Something went wrong with your upload!",
                description: message,
                cancel: false,
                okay: function() {
                    //this.render();
                }.bind( this )
            });
        }


    });

});


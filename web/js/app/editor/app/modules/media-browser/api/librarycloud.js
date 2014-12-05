define([
    "app",
    "modules/media-browser/search-model",
    "backbone"
],

function( app, SearchModel ) {


    return SearchModel.extend({
        
        api: "LibraryCloud",
        apiUrl: "http://api.lib.harvard.edu/v2/items.json?",

        favUrl: "http://api.lib.harvard.edu/v2/items.json?resourceType=still%20image&isCollection=false&isOnline=true&q=Hiroshige&limit=10",
        allowSearch: true,

        defaults: {
            urlArguments: {
                resourceType: 'still image',
                isCollection: 'false',
                isOnline: 'true',
                limit: "100",
                start: '0',
                q: 'Hiroshige'
            },
            title: "LibraryCloud",
            placeholder: "search LibraryCloud",
            headline: "Favorites from LibraryCloud",
            searchQuery:  null
        },

        _initialize: function(){
            var that = this;
            that.mediaCollection._parse = function( res ) {

                var items =[],
                    item;

                _.each( res.items, function( image ){
                    if (!that.hasProperImages(image) || !that.isPublic(image)) {
                        return;
                    }

                    item = {};
                    item.id = that.getImageId(image),
                    item.layer_type = "Image";
                    item.media_type = "Image";
                    item.archive = "LibraryCloud";
                    item.title = image.mods.titleInfo.title;
                    item.thumbnail_url = that.getThumbnailUrl(image);
                    item.description = that.getDescription(image);
                    item.uri = that.getFullUrl(image);
                    item.attribution_uri = that.getAttributionUrl(image);
                    item.media_user_realname = that.getCreator(image);
                    items.push( item );
                }, that);

                if( res.pagination.start + res.pagination.limit < res.pagination.numFound ){
                    this.more = true;
                } else {
                    this.more = false;
                }

                return items;
            };

        },

        getDescription: function(image) {
            if (!_.has(image.mods, 'note')) {
                return;
            }
            if (_.isArray(image.mods.note)) {
                return image.mods.note.join(' - ');
            } else {
                return image.mods.note;
            }
        },

        getCreator: function(image) {
            if (!_.has(image.mods, 'name')) {
                return;
            }

            if (!_.isArray(image.mods.name)) {
                image.mods.name = [image.mods.name];
            }

            var creator = _.find(image.mods.name, function(name) {
                if (_.isArray(name.role.roleTerm)) {
                    return _.contains(name.role.roleTerm, 'creator');
                } else {
                    return name.role.roleTerm === 'creator';
                }
            });

            if (creator) {
                return creator.namePart[0];
            }
        },

        getImageId: function(image) {
          return image.mods.recordInfo.recordIdentifier.source + '$' +
            image.mods.recordInfo.recordIdentifier.$;
        },

        getThumbnailUrl: function(image) {
            var loc = _.find(this.getUrlBlock(image), function(url) {
                return url.displayLabel === 'Thumbnail';
            });
            return loc.$;
        },

        getFullUrl: function(image) {
            var loc = _.find(this.getUrlBlock(image), function(url) {
                return url.displayLabel === 'Full Image';
            });
            return loc.$;
        },

        splitId: function(image) {
            var parts = image.mods.recordInfo.recordIdentifier.$.split(':');
            return [parts[0].replace('_urn-3', ''), parts[1] + ':' + parts[2]];
        },

        getAttributionUrl: function(image) {
            if (image.mods.recordInfo.recordIdentifier.source === 'MH:VIA') {
                var parts = this.splitId(image);
                return 'http://via.lib.harvard.edu/via/deliver/deepLinkItem?recordId=' +
                    parts[0] + '&componentId=' + parts[1];
            }
        },

        getUrlBlock: function(image) {
            var block = _.find(image.mods.location, function(loc) {
                return _.has(loc, 'url');
            });
            if (block) {
                return block.url;
            }
        },

        isPublic: function(image) { 
            return _.some(this.getUrlBlock(image), function(url) {
                return _.has(url, 'note') && url.note === 'unrestricted';
            });
        },

        hasProperImages: function(image) {
            var hasLocation = _.has(image.mods, 'location'),
                urlBlock = this.getUrlBlock(image),
                hasUrlBlock = hasLocation && !_.isUndefined(urlBlock),
                hasUrls = hasUrlBlock && urlBlock.length >= 2,
                hasFullImage = hasUrls && _.some(urlBlock, function(url) {
                    return _.has(url, 'displayLabel') && url.displayLabel === 'Full Image';
                }),
                hasThumbnail = hasUrls && _.some(urlBlock, function(url) {
                    return _.has(url, 'displayLabel') && url.displayLabel === 'Thumbnail';
                }),
                pass = hasFullImage && hasThumbnail;
            return pass;
        },

        getQuery: function(){
            return this.get("urlArguments").text;
        },
        _search: function( query ){

            var args = this.get("urlArguments");
            args.start = 0;
            if (!_.isEmpty(query)) {
                args.q = query;
            }
            this.set("urlArguments", args );
            this.mediaCollection.fetch();
  
        },
        _more: function(){
            var args = this.get("urlArguments");
            args.start += 100;
            this.set("urlArguments", args );
            this.mediaCollection.fetch({remove: false});
        }
    });

});

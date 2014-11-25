/*

metatags


// editor
<meta name="zeega" content="zeega-editor"
    data-api-root=""
    data-root=""
    data-api-root=""
    data-hostname="//zeega.com/"
    data-editor="editor"

    data-user-id="51afee498d34d4d711002a33"
    data-user-name="Joseph Bergen"
    data-user-thumbnail="http://static.zeega.org/community/users/36/profile/502539ff1d03e.gif"
    data-user-username="jbergen"


    data-media-root="kinok/"
    data-project-id="521c157a7131b2085800001e"
    data-user-email="joseph@zeega.com"

    data-fav-id="51afedf18d34d4d711000000"
    data-new-user="false"
    data-new-zeega="false"
/>


// player-standalone
<meta name="zeega" content="zeega-player"
    data-user-thumbnail="http://static.zeega.org/community/users/36/profile/502539ff1d03e.gif"
    data-views="65"
    data-directory=""
    data-hostname="//zeega.com/"
    data-user-id="51afee498d34d4d711002a33"
    data-logged-in=true
/>

*/

define([
    "common/libs/spin",
    "backbone"
],

function( Spinner ) {

    return {

        metadata: $("meta[name=zeega]").data(),

        getHostname: function() {
            return "http:" + this.metadata.hostname;
        },

        getWebRoot: function() {
            if( this.metadata.root || this.metadata.directory ){
                return this.getHostname() + ( this.metadata.root || this.metadata.directory );
            } else {
                return this.getHostname();
            } 
        },

        getApi: function() {
            return this.getWebRoot() + "api/";
        },

        getUserId: function() {
            return this.metadata.userId;
        },

        getMediaServerUrl: function() {
            return "http:" + this.metadata.hostname + this.metadata.mediaRoot;
        },

        isEmbed: _.memoize(function() {
            return window != window.top;
        }),

        getPlatformInfo: _.memoize(function() {
            var info, userAgent;

            userAgent = navigator.userAgent;
            info = {
                    platformName: "unknown",
                    platformVersion: "unknown",
                    browserName: "unknown",
                    browserVersion: "unknown",
                    device: "desktop",
                    embed: this.isEmbed()
                }

            if ( /CriOS/i.test( userAgent ) ) {

                _.extend( info, {
                    platformName: /\((.*);/.exec( userAgent )[1].split(";")[0],
                    platformVersion: /\s([0-9_\.]*)\s/.exec( userAgent )[1],
                    browserName: "chrome",
                    browserVersion: /CriOS\/([0-9_\.]*)\s/.exec( userAgent )[0].split("/")[0],
                    device: "mobile"
                });

            } else if ( /(iPhone|iPod|iPad)/i.test( userAgent ) ) {

                _.extend( info, {
                    platformName: /\((.*)\;?/.exec( userAgent )[1].split(";")[0],
                    platformVersion: /\s([0-9_\.]*)\s/.exec( userAgent )[1],
                    browserName: "safari",
                    browserVersion: /Version\/([a-zA-Z\d\.\s\S]*)\//.exec( userAgent )[1].split("/")[0],
                    device: "mobile"
                });

            } else if ( /(Linux).*Chrome/i.test( userAgent ) ) {

                _.extend( info, {
                    platformName: "android",
                    platformVersion: /\s([0-9_\.]*);\s/.exec( userAgent )[1],
                    browserName: "chrome",
                    browserVersion: /Chrome\/([a-zA-Z\d\.\s\S]*)\//.exec( userAgent )[1].split("/")[0],
                    device: "mobile"
                });

            }

            return info;
        }),

        emit: function( event, args ) {
            // other things can be done here as well
            this.trigger( event, args );
        },

        spinner: new Spinner({
            lines: 13, // The number of lines to draw
            length: 10, // The length of each line
            width: 4, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#FFF', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        }),

        spin: function( el ) {
            var target = el || this.layout.el;

            this.spinner.spin( target );
        },

        spinStop: function() {
            this.spinner.stop();
        }
    };
});

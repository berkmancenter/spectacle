// define([
//     "app",
//     "backbone"
// ],

// function( app, Backbone ) {
    
//     return Backbone.View.extend({
        
//         tagName: "li",
//         template: "app/templates/remix-head",

//         serialize: function() {
//             return _.extend({
//                     path: "http:" + app.metadata.hostname + app.metadata.directory,
//                     favorites: this.getFavorites()
//                 },
//                     app.metadata,
//                     this.model.zeega.getCurrentProject().toJSON()
//                 );
//         }

//     });

// });
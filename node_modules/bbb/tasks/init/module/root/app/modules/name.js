// {%= module_name %} module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var {%= module_name %} = app.module();

  // Default Model.
  {%= module_name %}.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  {%= module_name %}.Collection = Backbone.Collection.extend({
    model: {%= module_name %}.Model
  });

  // Default View.
  {%= module_name %}.Views.Layout = Backbone.Layout.extend({
    template: "{%= name %}"
  });

  // Return the module for AMD compliance.
  return {%= module_name %};

});

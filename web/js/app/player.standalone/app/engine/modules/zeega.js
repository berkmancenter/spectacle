define([
    "app",
    "engine/parser",

    "engine/modules/project.collection",
    "engine/modules/project.model",
    "engine/modules/page.collection",
    "engine/modules/page.model",
    "engine/modules/layer.collection",
    "engine/modules/layer.model"
],

function( app, Parser, ProjectCollection, ProjectModel, PageCollection, PageModel, LayerCollection, LayerModel ) {

    return app.Backbone.Model.extend({

        projects: null,
        waiting: false,

        defaults: {
            mode: "editor",

            currentProject: null,
            currentPage: null,
            currentLayer: null,

            // do I need these?
            previousProject: null,
            previousPage: null,
            previousLayer: null,

            clipboard: null
        },

        initialize: function( models, options ) {
            this.injectZeega( this );

            if ( options.projects ) this.projects = new ProjectCollection( options.projects );

            this.projects.each(function( project ) {
                project._loadProject();
            });

            this._initCurrentState();
        },

        injectZeega: function( zeega ) {
            ProjectCollection.prototype.zeega =
            ProjectModel.prototype.zeega =
            PageCollection.prototype.zeega =
            PageModel.prototype.zeega =
            LayerCollection.prototype.zeega =
            LayerModel.prototype.zeega = zeega;
        },

        focusPage: function( page ) {
            if ( this.getCurrentProject().id != page.project.id ) {
                this.onNewProject( this.getCurrentProject(), page.project );
                this.set("currentProject", page.project );
                this.emit("project:project_switch", page.project );
            }

            this.blurPage( this.get("currentPage") );
            this.set("currentPage", page );
            page.trigger("focus");
            this.emit("page page:focus", page );
        },

        onNewProject: function( previous, next ) {
            if ( (previous.soundtrack && next.soundtrack) && (previous.soundtrack.get("attr").uri == next.soundtrack.get("attr").uri) ) {
                next.soundtrack = previous.soundtrack;
            } else if ( (!previous.soundtrack && next.soundtrack) || (previous.soundtrack && !next.soundtrack) || (previous.soundtrack && next.soundtrack) && (previous.soundtrack.get("attr").uri != next.soundtrack.get("attr").uri) ) {
                this.emit("project:soundtrack_switch", {
                        next: next ? next.soundtrack : false,
                        previous: previous ? previous.soundtrack : false
                    });
            }
        },

        blurPage: function( page ) {
            this.set("previousPage", page );
            page.trigger("blur");
            this.emit("page page:blur", page );
        },

        getFirstPage: function() {
            return this.projects.at(0).pages.at(0);
        },

        getNextPage: function( page ) {
            var p = page || this.getCurrentPage();
            var nextPage = false;

            if ( p.get("_order") + 1 < this.getCurrentProject().pages.length ) {
                nextPage = this.getCurrentProject().pages.at( p.get("_order") + 1 );
            } else if ( this.getNextProject() ) {
                nextPage = this.getNextProject().pages.at(0);
            } else if ( this.get("loop")) {
                nextPage = this.projects.at(0).pages.at(0);
            }

            return nextPage;
        },

        getPreviousPage: function( page ) {
            var p = page || this.getCurrentPage();
            var previousPage = false;

            if ( p.get("_order") > 0 ) {
                previousPage = this.getCurrentProject().pages.at( p.get("_order") - 1 );
            } else if ( this.getPreviousProject() ) {
                previousPage = this.getPreviousProject().pages.at( this.getPreviousProject().pages.length - 1 );
            } else if ( this.get("loop")) {
                var project = this.projects.at( this.projects.length - 1 );

                previousPage = project.pages.at( project.pages.length - 1 );
            }

            return previousPage;
        },

        getCurrentProject: function() {
            return this.get("currentProject");
        },

        getNextProject: function() {
            var index = this.projects.indexOf( this.getCurrentProject() );

            return this.projects.at( index + 1 );
        },

        getPreviousProject: function() {
            var index = this.projects.indexOf( this.getCurrentProject() );

            return this.projects.at( index - 1 );
        },

        getCurrentPage: function() {
            return this.get("currentPage");
        },

        setCurrentPage: function( page ) {
            var oldPage = this.get("currentPage");

            this.setCurrentLayer( null );

            if ( oldPage && page ) {
                oldPage.trigger("blur");
            }

            if ( page ) {
                this.set("currentPage", page );
                page.trigger("focus");
            } else if ( page === null ) { // should this be allowed?
                this.set("currentPage", null);
            }
        },

        getPages: function() {
            var pagesArray = [];
            
            this.projects.each(function( project ) {
                project.pages.each(function( page ) {
                    pagesArray.push( page );
                });
            });

            return pagesArray;
        },

        getPage: function( pageID ) {

        },

        getCurrentLayer: function() {
            return this.get("currentLayer");
        },

        setCurrentLayer: function( layer ) {
            var oldLayer = this.get("currentLayer");

            if ( oldLayer ) {
                oldLayer.trigger("blur");
            }

            if ( layer ) {
                this.set("currentLayer", layer );
                layer.trigger("focus");
            } else if ( layer === null ) {
                this.set("currentLayer", null );
            }
        },

        getSoundtrack: function() {
            return this.getCurrentProject().soundtrack;
        },

        isRemix: function() {
            return this.getCurrentProject().get("remix").remix;
        },

        isNew: function() {
            return this.getCurrentProject().pages.length == 1 && this.getCurrentProject().pages.at(0).layers.length === 0;
        },

        copyLayer: function( layer ) {
            if ( layer ) {
                this.set("clipboard", layer );
                layer.trigger("copy_focus");
                this.emit("layer_copied", layer );
            }
        },

        getClipboard: function() {
            return this.get("clipboard");
        },

        emptyClipboard: function() {
            var old = this.get("clipboard");

            this.set("clipboard", false );
            return old;
        },

        preloadNextZeega: function() {
            var remixData = this.getRemixData();

            if ( remixData.descendants.length && !this.waiting ) {
                var existingProjectIDs = _.difference( _.pluck( remixData.descendants, "id"), this.projects.pluck("id") );
                
                if ( existingProjectIDs.length ) {
                    var projectUrl = app.getApi() + "projects/" + existingProjectIDs[0];

                    this.waiting = true;
                    this.emit("project:fetching", existingProjectIDs[0] );

                    $.getJSON( projectUrl, function( data ) {
                        this._onDataLoaded( data );
                        console.log("got json", data);
                        this.waiting = false;
                        this.emit("project:fetch_success");
                    }.bind(this));
                }
            }
        },

        getRemixData: function() {
            var remix = _.extend({}, this.projects.at(0).get("remix"));

            if ( remix.descendants ) {
                var desc = remix.descendants;

                remix.descendants = [ this.projects.at(0).getSimpleJSON() ].concat( desc );
            }
            
            return remix;
        },

        _onDataLoaded: function( data ) {
            var numberOfProjects = this.getRemixData().descendants.length;

            var newProjectData = Parser( data,
                _.extend({},
                    this.toJSON(),
                    {
                        endPage: !this.get("loop") && app.isEmbed() && this.projects.length + 1 == this.getRemixData().descendants.length,
                        mode: "player"
                    })
                );
            var newProject = new ProjectModel( newProjectData);

            newProject._loadProject();

            this.projects.push( newProject );
        },

        getProjectJSON: function() {
            var pData, currentProject, layers, soundtrack;

            pData = {};
            currentProject = this.getCurrentProject();
            layers = _.flatten( currentProject.pages.map(function( page ) {
                    return page.layers.toJSON();
                }), true );
            soundtrack = currentProject.soundtrack ? currentProject.soundtrack.toJSON() : {};

            layers.push( soundtrack );

            currentProject.sequence.clearVirtualPages();

            _.extend( pData, currentProject.toJSON(), {
                sequences: [ currentProject.sequence.toJSON() ],
                frames: currentProject.pages.toJSON(),
                layers: layers
            });

            pData.sequences = [ currentProject.sequence.toJSON() ];

            return pData;
        },

        addProject: function( project ) {

        },

        removeProject: function( projectID ) {

        },

        emit: function( event, attributes ) {
            this.trigger( event, attributes );
        },

        // can be updated to use the startFrame property. good for now
        _initCurrentState: function() {
            var currentProject = this.projects.at(0),
                currentPage = this.getFirstPage();

            this.set({
                currentProject: currentProject,
                currentPage: currentPage
            });
        },

        _setFirstPage: function() {
            this.projects.at(0);
        },

        destroy: function() {
            this.projects.each(function( project ) {
                project.finish();
            });
        }
    });

});

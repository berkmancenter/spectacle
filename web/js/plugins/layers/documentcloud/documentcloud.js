/************************************

	DOCUMENTCLOUD LAYER CHILD CLASS
	
	
	TODO:
		
		Features: 
			-fullscreen bleed?

************************************/
(function(Layer){

	Layer.DocumentCloud = Layer.Model.extend({

		layerType : 'DocumentCloud',
		draggable : true,
		scalable  : true,
		visual    : true,

		defaultAttributes : {
			'title' : 'Document Cloud Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
		}
		
	});
	
	Layer.Views.Controls.DocumentCloud = Layer.Views.Controls.extend();

	Layer.Views.Visual.DocumentCloud = Layer.Views.Visual.extend({
		
		render : function()
		{
			console.log('trying to preloaded doc cloud');
			var cssObj = {
				'position' : 'absolute',
				'top' : '-1000%',
				'left' : '-1000%',
				'z-index' : this.zIndex,
				'width' : this.attr.width +'%',
				'opacity' : this.attr.opacity
			};

			console.log('a trying to preloaded doc cloud');

			/* For use with generic document cloud documents

			var document=$('<iframe>')
				.attr({'src':'https://www.documentcloud.org/documents/'+this.attr.url,'id':'layer-iframe-'+this.model.id})
				.css({'width':'100%','height':'100%'});
			*/

			//** For use with DocumentCloud Account: allows sidebar and text tab removal **//
			$(this.el).attr({'id':'DV-viewer-'+this.model.id})
			.addClass('DV-container')
			.css({'width':'100%','height':'100%'});
			//** End DocumentCloud Account**//

			$(this.el).css( cssObj );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		onPreload : function()
		{
			console.log(this,'http://www.documentcloud.org/documents/'+this.model.get('attr').uri+'.js')
			//** For use with DocumentCloud Account: allows sidebar and text tab removal **//
			DV.load('http://www.documentcloud.org/documents/'+this.model.get('attr').uri+'.js', {sidebar: false,  pdf: false,  text: false,   container: "#DV-viewer-"+this.model.id});
			//** End DocumentCloud Account**//
		}
		
		
	});
	
		
})(zeega.module("layer"));
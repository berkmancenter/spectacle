// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
module.exports = function(grunt) {

	grunt.initConfig({

		// The clean task ensures all files are removed from the dist/ directory so
		// that no files linger from previous builds.
		clean: ["dist/"],

		// The lint task will run the build configuration and the application
		// JavaScript through JSHint and report any errors.  You can change the
		// options for this task, by reading this:
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md
		lint: {
			files: [
				"build/config.js", [
					"app/modules/*.js",

					// engine
					"app/engine/data-parsers/*.js",
					"app/engine/modules/*.js",
					"app/engine/plugins/**/*.js",

					// player
					"app/player/modules/*.js"
				]
			]
		},

		// The jshint option for scripturl is set to lax, because the anchor
		// override inside main.js needs to test for them so as to not accidentally
		// route.
		jshint: {
			options: {
				scripturl: true
			}
		},

		// The jst task compiles all application templates into JavaScript
		// functions with the underscore.js template function from 1.2.4.  You can
		// change the namespace and the template options, by reading this:
		// https://github.com/gruntjs/grunt-contrib/blob/master/docs/jst.md
		//
		// The concat task depends on this file to exist, so if you decide to
		// remove this, ensure concat is updated accordingly.
		jst: {
			"dist/debug/templates.js": [
				"app/templates/**/*.html",
				"app/engine/plugins/**/*.html",
				"app/player/templates/**/*.html"
			]
		},

		// The handlebars task compiles all application templates into JavaScript
		// functions using Handlebars templating engine.
		//
		// Since this task defaults to writing to the same file as the jst task,
		// edit the debug task replacing jst with handlebars.
		//
		// The concat task depends on this file to exist, so if you decide to
		// remove this, ensure concat is updated accordingly.
		handlebars: {
			"dist/debug/templates.js": ["app/templates/**/*.html"]
		},

		// The concatenate task is used here to merge the almond require/define
		// shim and the templates into the application code.  It's named
		// dist/debug/require.js, because we want to only load one script file in
		// index.html.
		concat: {
			dist: {
				src: [
					"assets/js/libs/almond.js",
					"dist/debug/templates.js",
					"dist/debug/require.js"
				],

				dest: "dist/debug/require.js",

				separator: ";"
			}
		},

		// This task uses the MinCSS Node.js project to take all your CSS files in
		// order and concatenate them into a single CSS file named index.css.  It
		// also minifies all the CSS as well.  This is named index.css, because we
		// only want to load one stylesheet in index.html.
		mincss: {
			"dist/release/index.css": [
				"assets/css/style.css"
			]
		},

/*
		styles: {
			// Out the concatenated contents of the following styles into the below
			// development file path.
			"dist/debug/index.css": {
				// Point this to where your `index.css` file is location.
				src: "assets/css/index.css",

				// The relative path to use for the @imports.
				paths: ["assets/css"],

				// Additional production-only stylesheets here.
				additional: []
			}
		},
*/
		// Takes the built require.js file and minifies it for filesize benefits.
		min: {
			"dist/release/require.js": [
				"dist/debug/require.js"
			]
		},

		// Running the server without specifying an action will run the defaults,
		// port: 8000 and host: 127.0.0.1.  If you would like to change these
		// defaults, simply add in the properties `port` and `host` respectively.
		// Alternatively you can omit the port and host properties and the server
		// task will instead default to process.env.PORT or process.env.HOST.
		//
		// Changing the defaults might look something like this:
		//
		// server: {
		//   host: "127.0.0.1", port: 9001
		//   debug: { ... can set host and port here too ...
		//  }
		//
		//  To learn more about using the server task, please refer to the code
		//  until documentation has been written.
		server: {
			// Ensure the favicon is mapped correctly.
			files: {
				"favicon.ico": "favicon.ico",
				"testproject.json": "testdata/remix.json"
			},

			debug: {
				// Ensure the favicon is mapped correctly.
				files: {
					"favicon.ico": "favicon.ico",
					"testproject.json": "testdata/remix.json"
				},

				// Map `server:debug` to `debug` folders.
				folders: {
					"app": "dist/debug",
					"assets/js/libs": "dist/debug",
					"assets/css": "dist/debug",
					"testproject.js": "testproject.js"
				}
			},

			release: {
				// This makes it easier for deploying, by defaulting to any IP.
				host: "0.0.0.0",

				// Ensure the favicon is mapped correctly.
				files: { "favicon.ico": "favicon.ico" },

				// Map `server:release` to `release` folders.
				folders: {
					"app": "dist/release",
					"assets/js/libs": "dist/release",
					"assets/css": "dist/release"
				}
			}
		},

		// This task uses James Burke's excellent r.js AMD build tool.  In the
		// future other builders may be contributed as drop-in alternatives.
		requirejs: {
			// Include the main configuration file.
			mainConfigFile: "app/config.js",

			// Output file.
			out: "dist/debug/require.js",

			// Root application module.
			name: "config",

			// Do not wrap everything in an IIFE.
			wrap: false
		},

		// The watch task can be used to monitor the filesystem and execute
		// specific tasks when files are modified.  By default, the watch task is
		// available to compile stylus templates if you are unable to use the
		// runtime builder (use if you have a custom server, PhoneGap, Adobe Air,
		// etc.)
		watch: {
			less: {
				files: ["assets/css/less/*.less"],
				tasks: "less:main"
			}
		},

		less: {

			layers: {
				files: {
					"assets/css/layers.less" : "app/engine/plugins/layers/**/*.less"
				}
			},

			controls: {
				files: {
					"assets/css/controls.less" : "app/engine/plugins/controls/**/*.less"
				}
			},

			player: {
				files: {
					"assets/css/player.less" : "app/player/assets/css/less/_all.less"
				}
			},

			app: {
				files: {
					"assets/css/app.less" : "assets/css/less/_all.less"
				}
			},

			main: {
				files: {
					"assets/css/style.css" : [
						"assets/css/reset.less",
						"assets/css/layers.less",
						"assets/css/controls.less",
						"assets/css/player.less",
						"assets/css/app.less"
					]
				}
			}
		},
		
		copy: {

			css: {
				files: {
					"dist/debug/index.css": "assets/css/style.css"
				}
			},

			player: {
				options: {
					cwd: "/",
					flatten : false
				},
				files: {
					"assets/img/zeegaplayer/": "app/player/assets/img/*"
				}
			},

			layers: {
				options: {
					cwd: "/",
					flatten : false
				},
				files: {
					"assets/img/zeegaplayer/": "app/player/assets/img/*"
				}
			},

			dist: {
				options: {
					cwd: "/",
					flatten : true
				},
				files: {
					"dist/img/": [ "assets/img/*", "assets/img/zeegaplayer/*" ],
					"dist/img/layers/": "assets/img/zeegaplayer/layers/*"
				}
			}

		}

	});
    grunt.registerTask("default", "clean lint jst requirejs concat copy");

	// The debug task will remove all contents inside the dist/ folder, lint
	// all your code, precompile all the underscore templates into
	// dist/debug/templates.js, compile all the application code into
	// dist/debug/require.js, and then concatenate the require/define shim
	// almond.js and dist/debug/templates.js into the require.js file.
	grunt.registerTask("debug", "clean lint  jst requirejs concat less");

	// The release task will run the debug tasks and then minify the
	// dist/debug/require.js file and CSS files.
	grunt.registerTask("release", "debug min mincss copy");

};

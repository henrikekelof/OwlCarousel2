/**
 * Owl Carousel
 *
 * Bartosz Wojciechowski
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {

	if (!grunt.file.isDir('bower_components')) {
		grunt.fail.fatal('>> Please run "bower install" before continuing.');
	}
	require('load-grunt-tasks')(grunt);

	grunt
		.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			app: grunt.file.readJSON('_config.json'),
			vendor: 'bower_components',
			banner: '/**\n' + ' * Owl Carousel v<%= pkg.version %>\n'
				+ ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n'
				+ ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' + ' */\n',

			// assemble
			assemble: {
				options: {
					flatten: false,
					expand: true,
					production: false,
					assets: '<%= app.docs.dest %>/assets',
					postprocess: require('pretty'),

					// metadata
					pkg: '<%= pkg %>',
					app: '<%= app %>',
					data: [ '<%= app.docs.src %>/data/*.{json,yml}' ],

					// templates
					partials: '<%= app.docs.templates %>/partials/*.hbs',
					layoutdir: '<%= app.docs.layouts %>/',

					// extensions
					helpers: '<%= app.docs.src %>/helpers/*.js'
				},
				index: {
					options: {
						layout: 'home.hbs'
					},
					files: [ {
						expand: true,
						cwd: '<%= app.docs.pages %>/',
						src: '*.hbs',
						dest: '<%= app.docs.dest %>/'
					} ]
				},
				demos: {
					options: {
						layout: 'demos.hbs'
					},
					files: [ {
						expand: true,
						cwd: '<%= app.docs.pages %>/demos/',
						src: '*.hbs',
						dest: '<%= app.docs.dest %>/demos'
					} ]
				},
				docs: {
					options: {
						layout: 'docs.hbs'
					},
					files: [ {
						expand: true,
						cwd: '<%= app.docs.pages %>/docs/',
						src: '*.hbs',
						dest: '<%= app.docs.dest %>/docs'
					} ]
				},
				svdemos: {
					options: {
						layout: 'svdemos.hbs'
					},
					files: [ {
						expand: true,
						cwd: '<%= app.docs.pages %>/svdemos/',
						src: '*.hbs',
						dest: '<%= app.docs.dest %>/svdemos'
					} ]
				}
			},

			// clean
			clean: {
				docs: [ '<%= app.docs.dest %>/**/*.*' ],
				dist: [ 'dist/**/*.*' ]
			},

			// sass
			sass: {
				docs: {
					options: {
						outputStyle: 'compressed',
						includePaths: [ '<%= app.docs.src %>/assets/scss/', 'bower_components/foundation/scss' ]
					},
					files: {
						'<%= app.docs.dest %>/assets/css/docs.theme.min.css': '<%= app.docs.src %>/assets/scss/docs.theme.scss'
					}
				},
				dist: {
					options: {
						outputStyle: 'nested'
					},
					files: [ {
						expand: true,
						flatten: true,
						cwd: 'src/scss/',
						src: '*scss',
						dest: 'src/css/',
						ext: '.css',
						extDot: 'last'
					} ]
				}
			},

			less: {
				dist: {
					options: {
						paths: [ 'src/css' ]
					},
					files: {
						'src/css/<%= pkg.svname %>.css': 'src/less/<%= pkg.svname %>.less'
					}
				}
			},

			concat: {
				dist: {
					options: {
						process: {
							data: { pluginName: 'owlCarousel' }
						}
					},
					files: {
						'dist/assets/owl.carousel.css': [ 'src/css/*.css', '!src/css/owl.theme*.css', '!src/css/sv-*.css' ],
						'dist/<%= pkg.name %>.js': '<%= app.src.scripts %>'
					}
				},
				svdist: {
					options: {
						process: {
							data: { pluginName: 'svCarousel' }
						}
					},
					files: {
						'dist/<%= pkg.svname %>.js': '<%= app.src.svscripts %>'
					}
				}
			},

			cssmin: {
				dist: {
					files: {
						'dist/assets/<%= pkg.name %>.min.css': [ 'src/css/*.css', '!src/css/owl.theme*.css', '!src/css/sv-*.css' ],
						'dist/assets/owl.theme.default.min.css': 'src/css/owl.theme.default.css',
						'dist/assets/sv-carousel.min.css': 'src/css/sv-carousel.css',
						'dist/assets/owl.theme.green.min.css': 'src/css/owl.theme.green.css'
					}
				},
				svdist: {
					files: {
						'dist/assets/<%= pkg.svname %>.min.css': 'src/css/<%= pkg.svname %>.css'
					}
				}
			},

			jshint: {
				options: {
					jshintrc: 'src/js/.jshintrc'
				},
				dist: {
					src: [ '<%= app.src.scripts %>', 'Gruntfile.js' ]
				}
			},

			qunit: {
				dist: [ 'test/*.html' ]
			},

			jscs: {
				options: {
					config: 'src/js/.jscsrc',
					reporter: 'text.js',
					reporterOutput: 'jscs.report.txt'
				},
				dist: {
					src: [ 'dist/<%= pkg.name %>.js', 'Gruntfile.js' ]
				},
				svdist: {
					src: [ 'dist/<%= pkg.svname %>.js', 'Gruntfile.js' ]
				}
			},

			uglify: {
				dist: {
					files: {
						'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
					}
				},
				svdist: {
					files: {
						'dist/<%= pkg.svname %>.min.js': 'dist/<%= pkg.svname %>.js'
					}
				}
			},

			// copy
			copy: {
				themes: {
					expand: true,
					flatten: true,
					cwd: 'src/css/',
					src: [ 'owl.theme.*' ],
					dest: 'dist/assets'
				},

				svCss: {
					expand: true,
					flatten: true,
					cwd: 'src/css/',
					src: [ 'sv-*.css' ],
					dest: 'dist/assets'
				},

				distImages: {
					expand: true,
					flatten: true,
					cwd: 'src/',
					src: [ 'img/*.*' ],
					dest: 'dist/assets'
				},

				distToDocs: {
					expand: true,
					cwd: 'dist/',
					src: [ '**/*.*' ],
					dest: '<%= app.docs.dest %>/assets/owlcarousel'
				},

				srcToDocs: {
					expand: true,
					cwd: 'src/js',
					src: [ '**/*.js' ],
					dest: '<%= app.docs.dest %>/assets/owlcarousel/src'
				},

				docsAssets: {
					expand: true,
					cwd: '<%= app.docs.src %>/assets/',
					src: [ 'css/*.css', 'vendors/*.js', 'vendors/*.map', 'img/*.*', 'js/*.*' ],
					dest: '<%= app.docs.dest %>/assets/'
				},
				readme: {
					files: [ {
						'dist/LICENSE': 'LICENSE',
						'dist/README.md': 'README.md'
					} ]
				}
			},

			// connect
			connect: {
				options: {
					port: 9000,
					open: true,
					livereload: true,
					hostname: 'localhost'
				},
				docs: {
					options: {
						base: "<%= app.docs.dest %>"
					}
				}
			},

			// watch
			watch: {
				options: {
					livereload: true
				},
				templates: {
					files: [ '<%= app.docs.templates %>/**/*.hbs' ],
					tasks: [ 'assemble' ]
				},
				sass: {
					files: [ '<%= app.docs.src %>/assets/**/*.scss' ],
					tasks: [ 'sass:docs' ]
				},
				sassDist: {
					files: [ 'src/**/*.scss' ],
					tasks: [ 'sass:dist', 'concat:dist', 'cssmin:dist', 'copy:themes','copy:distToDocs' ]
				},
				jsDocs: {
					files: [ '<%= app.docs.src %>/assets/**/*.js' ],
					tasks: [ 'copy:docsAssets' ]
				},
				js: {
					files: [ 'src/**/*.js' ],
					tasks: [ 'jscs:dist', 'jshint:dist', 'qunit:dist', 'uglify:dist', 'concat:dist', 'copy:distToDocs', 'copy:srcToDocs' ]
				},
				helpers: {
					files: [ '<%= app.src %>/helpers/*.js' ],
					tasks: [ 'assemble' ]
				},
				test: {
					files: [ 'test/*.html', 'test/unit/*.js' ],
					tasks: [ 'qunit:dist' ]
				}
			},

			// compress zip
			compress: {
				zip: {
					options: {
						archive: 'docs/download/owl.carousel.<%= pkg.version %>.zip'
					},
					files: [ {
						expand: true,
						cwd: 'dist/',
						src: [ '**' ],
						dest: 'owl.carousel.<%= pkg.version %>'
					} ]
				}
			},

			// publish to github pages
			'gh-pages': {
				options: {
					base: 'docs'
				},
				src: '**/*'
			}
		});

	grunt.loadNpmTasks('assemble');

	// tasks
	grunt.registerTask('dist', [ 'clean:dist', 'sass:dist', 'concat:dist', 'cssmin:dist', 'copy:themes', 'copy:distImages', 'jscs:dist', 'uglify:dist', 'copy:readme' ]);
	grunt.registerTask('svdist', [ 'clean:dist', 'less:dist', 'concat:svdist', 'cssmin:svdist', 'copy:svCss', 'copy:distImages', 'jscs:svdist', 'uglify:svdist', 'copy:readme' ]);

	grunt.registerTask('docs', [ 'dist', 'clean:docs', 'assemble', 'sass:docs', 'copy:docsAssets', 'copy:distToDocs', 'zip' ]);
	grunt.registerTask('svdocs', [ 'clean:docs', 'assemble', 'sass:docs', 'copy:docsAssets', 'copy:distToDocs', 'zip' ]);

	grunt.registerTask('test', [ 'jshint:dist', 'qunit:dist' ]);

	grunt.registerTask('owldefault', [ 'dist', 'docs', 'test' ]);

	grunt.registerTask('default', [ 'svdist', 'svdocs' ]);

	grunt.registerTask('serve', [ 'connect:docs', 'watch' ]);

	grunt.registerTask('zip', [ 'compress' ]);

	grunt.registerTask('deploy', [ 'docs', 'gh-pages' ]);

};

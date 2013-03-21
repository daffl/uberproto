/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: [ 'lib/es5.js', 'lib/proto.js'],
				dest: 'dist/proto.js'
			},
			es5: {
				src: ['lib/proto.js'],
				dest: 'dist/proto.es5.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/proto.min.js'
			},
			legacy: {
				src: '<%= concat.dist.dest %>',
				dest: 'proto.min.js'
			},
			es5: {
				src: '<%= concat.es5.dest %>',
				dest: 'dist/proto.es5.min.js'
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				boss: true,
				eqnull: true,
				globals: {},
				loopfunc: true
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib_test: {
				src: ['lib/**/*.js', 'test/**/*.js']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task.
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};

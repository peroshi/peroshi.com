'use strict';

module.exports = function (grunt) {

    var _ = require('lodash');
    var fs = require('fs');

    // Use jit-grunt to only load necessary tasks for each invocation of grunt.
    require('jit-grunt')(grunt, {
        // useminPrepare is a task of usemin.
        'useminPrepare': 'grunt-usemin'
    });

    require('time-grunt')(grunt);

    grunt.initConfig({
        config: {
            content: 'content',
            output: 'output',
            theme: 'theme',
            static: 'theme/static',
            pelicanConfig: 'pelicanconf.py',
            app: 'app',
            dist: 'dist',
            lib: 'app/lib',
            htmlmin: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: [
                'shell:pelican-watch',
                'compass:watch'
            ]
        },
        connect: {
            options: {
                port: process.env.PORT || 9000
            },
            dev: {
                options: {
                    base: '<%= config.output %>'
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    keepalive: true
                }
            }
        },
        shell: {
            pelican: {
                command: 'pelican <%= config.content %> -o <%= config.output %> -s <%= config.pelicanConfig %>'
            },
            'pelican-watch': {
                command: 'pelican -r <%= config.content %> -o <%= config.output %> -s <%= config.pelicanConfig %>'
            }
        },
        compass: {
            options: {
                sassDir: '<%= config.theme %>/sass',
                cssDir: '<%= config.static %>/styles',
                imagesDir: '<%= config.static %>/images',
                generatedImagesDir: '<%= config.static %>/images/generated',
                fontsDir: '<%= config.static %>/fonts',
                relativeAssets: true,
                debugInfo: false
            },
            dev: {
                options: {}
            },
            force: {
                options: {
                    force: true
                }
            },
            watch: {
                options: {
                    watch: true
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            dev: [
                '<%= config.static %>/styles',
                '<%= config.static %>/images/generated',
                '<%= config.output %>'
            ]
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '<%= config.theme %>/**/*.js'
            ]
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/theme/scripts/*.js',
                        '<%= config.dist %>/theme/styles/**/*.css',
                        '<%= config.dist %>/theme/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '!<%= config.dist %>/theme/images/inline_html_images/**/*',
                        '<%= config.dist %>/theme/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= config.dist %>/index.html',
            options: {
                dest: '<%= config.dist %>'
            }
        },
        usemin: {
            html: ['<%= config.dist %>/**/*.html'],
            css: ['<%= config.dist %>/**/*.css'],
            options: {
                assetsDirs: ['<%= config.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    src: '<%= config.dist %>/theme/images/**/*.{png,jpg,jpeg}'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    src: '<%= config.dist %>/theme/images/**/*.svg'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: '<%= config.htmlmin %>',
                files: [{
                    expand: true,
                    src: '<%= config.dist %>/**/*.html'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.output %>',
                        dest: '<%= config.dist %>',
                        src: '**/*'
                    }
                ]
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            }
        }
    });

    grunt.registerTask('default', 'dev');

    grunt.registerTask('dev', function () {
        grunt.task.run([
            'clean:dev',
            'compass:dev',
            'shell:pelican',
            'connect:dev',
            'concurrent:dev'
        ]);
    });

    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean',
            'compass:dev',
            'shell:pelican',
            'copy:dist',
            'useminPrepare',
            'concat:generated',
            'imagemin',
            'svgmin',
            'cssmin',
            'uglify',
            'rev',
            'usemin',
            'htmlmin'
        ]);
    });

    grunt.registerTask('dist', 'Debug the built site', function () {
        grunt.task.run([
            'build',
            'connect:dist'
        ]);
    });

    grunt.registerTask('test', [
        'jshint'
    ]);
};

/* jshint node:true */

var path = require('path');
var matchdep = require("matchdep");

module.exports = function(grunt) {
    // autoload dependencies
    matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);


    grunt.registerTask('default', ['prepare', 'build', 'package']);
    grunt.registerTask('prepare', ['uglify:libs']);
    grunt.registerTask('build', ['sass', 'browserify', 'clean:build', 'copy:build', 'nodewebkit']);
    grunt.registerTask('package', ['compress:winapp', 'compress:macapp']);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        paths: {
            src: './src/',
            modules: './src/modules/',
            assets: './src/assets/',
            libs: './src/libs/',
            build: './build/',
            wkCache: './webkitbuilds/cache/',
            wkRelease: './webkitbuilds/releases/',
            release: './webkitbuilds/releases/<%= pkg.name %>/'
        },

        uglify: {
            libs: {
                files: {
                    '<%=paths.assets %>libs.js': [
                        '<%=paths.libs %>jquery-2.1.0.js',
                        //'<%=paths.libs%>react.js'
                        '<%=paths.libs %>react-with-addons.js'
                    ]
                }
            },
            options: {
                mangle: false//,
                //beautify: true
            }
        },

        sass: {
            app: {
                style: 'expanded',
                files: {
                    '<%=paths.assets%>styles.css': '<%=paths.src%>scss/styles.scss'
                }
            }
        },

        // not used by browserify
        react: {
            files: {
                expand: true,
                cwd: '<%=paths.src%>',
                src: ['**/*.jsx'],
                dest: '<%=paths.assets%>',
                ext: '.js'
            }
        },

        browserify: {
            // TODO: libs.js could be included with noParse
            options: {
                transform: [require('grunt-react').browserify],
                extension: 'jsx'
            },
            app: {
                src: '<%=paths.src%>main.jsx',
                dest: '<%=paths.assets%>main.js'
            }
        },

        clean: {
            build: ['<%=paths.build %>']
        },

        copy: {
            build: {
                nonull: true,
                files: [
                    { src: '<%=paths.src %>/index.html', dest: '<%=paths.build %>/index.html' },
                    { src: '<%=paths.src %>/nodewebkit-package.json', dest: '<%=paths.build %>/package.json' },
                    { expand: true, cwd: '<%=paths.modules %>/', src: ['**'], dest: '<%=paths.build %>/modules/' },
                    { expand: true, cwd: '<%=paths.assets %>/', src: ['**'], dest: '<%=paths.build %>/assets/' }
                ]
            }
        },

        nodewebkit: {
            options: {
                appName: '<%= pkg.name %>',
                appVersion: '<%= pkg.version %>',
                buildDir: '<%= paths.wkRelease %>',
                cacheDir: '<%= paths.wkCache %>',
                platforms: ['win','osx'],
                version: '0.10.5'

            },
            src: ['<%=paths.build %>**/*']
        },

        compress: {
            winapp: {
                options: {
                    archive: '<%= paths.release %><%= pkg.name %>-win.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.release %>win/<%= pkg.name %>',
                    src: ['**'],
                    dest: '.'
                }]
            },
            macapp: {
                options: {
                    archive: '<%= paths.release %><%= pkg.name %>-mac.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.release %>mac',
                    src: ['**'],
                    dest: '.'
                }]
            }
        }
    });
};

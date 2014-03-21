/* jshint node:true */

var path = require('path');
var matchdep = require("matchdep");

module.exports = function(grunt){
    // autoload dependencies
    matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);


    grunt.registerTask('default', ['prepare','build','package']);
    grunt.registerTask('prepare', ['uglify:libs']);
    grunt.registerTask('build', ['browserify','nodewebkit']);
    grunt.registerTask('package', ['compress:winapp','compress:macapp']);

    /*
    TODO: create a build folder so only built resources are included in the app

    */


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        paths: {
            src         : './src/',
            assets      : './src/assets/',
            libs        : './src/libs/',
            build_dir   : './webkitbuilds',
            release_dir : './webkitbuilds/releases/<%= pkg.name %>/'
        },

        uglify: {
            libs: {
                files: {'<%=paths.assets%>libs.js':
                [
                    '<%=paths.libs%>jquery-2.1.0.js',
                    //'<%=paths.libs%>react.js'
                    '<%=paths.libs%>react-with-addons.js'
                ]}
            },
            options: {
                mangle: false,
                beautify: true
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

        nodewebkit: {
            options: {
                app_name: '<%= pkg.name %>',
                app_version: '<%= pkg.version %>',
                build_dir: '<%= paths.build_dir %>',
                mac: true,
                win: true,
                linux32: false,
                linux64: false
            },
            src: ['<%=paths.src%>**/*']
        },

        compress: {
            winapp: {
                options: { archive: '<%= paths.release_dir %><%= pkg.name %>-win.zip' },
                files: [{
                    expand: true,
                    cwd: '<%= paths.release_dir %>win/<%= pkg.name %>',
                    src: ['**'],
                    dest: '.'
                }]
            },
            macapp: {
                options: { archive: '<%= paths.release_dir %><%= pkg.name %>-mac.zip' },
                files: [{
                    expand: true,
                    cwd: '<%= paths.release_dir %>mac',
                    src: ['**'],
                    dest: '.'
                }]
            }
        }
    });
};
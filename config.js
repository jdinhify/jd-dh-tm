'use strict';

var src = {
        src: {
            'appcss': 'src/**/**/app.scss',
            'scss': 'src/**/**/*.scss',
            'js': 'src/app/**/*.js',
            'app': 'src/app.js',
            'html': 'src/*.html',
            'dir': 'src',
            'assets': 'src/assets'
        }
    },
    dest = {
        dest: {
            'style': 'style.css',
            'styledir': 'dist/styles',
            'app': 'js/app.js',
            'dist': 'dist',
            'assets': 'dist/assets'
        }
    };


var config = Object.assign({}, src, dest);

module.exports = config;

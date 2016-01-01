'use strict';

var gulp = require('gulp'),
    config = require('./config'),
    del = require('del'),
    browserSync = require('browser-sync'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    usemin = require('gulp-usemin'),
    minifyCSS = require('gulp-minify-css'),
    browserify = require('browserify'),
    babel = require('babelify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    reload = browserSync.reload,
    eslint = require('gulp-eslint'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin');


var customOpts = {
    entries: config.src.app,
    debug: true
};
var opts = _.assign({}, watchify.args, customOpts);
var b = browserify(opts);

/**
 * compile & watch using browserify, watchify & return a gulp stream object
 * @returns {stream}
 */
function watch() {
    var w = watchify(b)
        .transform(babel);

    function rebundle() {

        console.log('bundling...');

        gulp.src(config.src.js)
            .pipe(eslint())
            .pipe(eslint.format());

        // log errors if they happen
        return w.bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source(config.dest.app))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.dest.dist))
            .pipe(reload({stream: true}));
    };

    w.on('update', rebundle);
    w.on('log', gutil.log);

    return rebundle();
};

/**
 * compile
 * @returns {*}
 */
function bundle() {

    console.log('bundling...');

    gulp.src(config.src.js)
        .pipe(eslint())
        .pipe(eslint.format());
    return b.transform(babel).bundle()
        // log errors if they happen
        .on('error', function (err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(source(config.dest.app))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest.dist));
};
/**
 * compile & minify for prod
 */
function compileProd() {
    gulp.src(config.src.js)
        .pipe(eslint());
        // .pipe(eslint.format());

    return b.transform(babel).bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source(config.dest.app))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(config.dest.dist));
};


gulp
    /**
     * Cleaning dist/ folder
     */
    .task('clean', function (cb) {
        return del(['dist/**'], cb);
    })

    /**
     * copy files
     */
    .task('copy-assets', function () {
        return gulp.src(config.src.assets)
            .pipe(gulp.dest(config.dest.assets));
    })


    /**
     * run usemin
     */
    .task('usemin', function () {
        return gulp.src(config.src.html)
            .pipe(usemin({
                css: [sourcemaps.init, 'concat', sourcemaps.write],
                js: [sourcemaps.init, eslint, 'concat', sourcemaps.write]
            }))
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(gulp.dest(config.dest.dist))
            .pipe(reload({stream: true}));
    })
    /**
     * usemin - prod
     */
    .task('usemin-prod', function () {
        return gulp.src(config.src.html)
            .pipe(usemin({
                css: [minifyCSS],
                js: [uglify]
            }))
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(config.dest.dist));
    })
    /**
     * scss compiling for app.css
     */
    .task('sass', function() {
        return sass(config.src.appcss, {sourcemap: true})
            .on('error', sass.logError)
            .pipe(concat('app.css'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.dest.styledir))
            .pipe(reload({stream: true}));
    })
    /**
     * scss compiling for app.css - prod
     */
    .task('sass-prod', function() {
        return sass(config.src.appcss, {sourcemap: false})
            .on('error', sass.logError)
            .pipe(concat('app.css'))
            .pipe(minifyCSS())
            .pipe(gulp.dest(config.dest.styledir));
    })
    /**
     * eslint
     */
    .task('eslint', function () {
        return gulp.src(config.src.js)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    })
    /**
     * js
     */
    .task('js', bundle)
    /**
     * js watch
     */
    .task('js-watch', watch)
    /**
     * js for production, minify without sourcemaps
     */
    .task('js-prod', compileProd)

    /**
     * build
     */
    .task('build', ['copy-assets', 'usemin', 'sass', 'js'])
    .task('watch', ['copy-assets', 'usemin', 'sass', 'js-watch'])

    /**
     * Running livereload server
     */
    .task('server', ['watch'], function () {
        browserSync({
            server: {
                baseDir: config.dest.dist
            }
        });
    })

    /**
     * build
     */
    .task('serve', ['server'], function () {
        gulp.watch(config.src.html, ['usemin']);
        gulp.watch(config.src.scss, ['sass']);
    })
    /**
     * default - serve
     */
    .task('default', ['serve'])
    /**
     * prod
     */
    .task('build-prod', ['copy-assets', 'usemin-prod', 'sass-prod', 'js-prod'])
;
